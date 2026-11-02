<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte"
    import {fade} from "svelte/transition"
    import type {NoteEdit, ScheduledNote, SongMeta} from "$lib/nbs/nbs-player"
    import {NavOverlay} from "$lib/store"
    import {instruments, keyName} from "$lib/nbs/nbs-instruments"
    import type {ConvertResult, MidiSource} from "$lib/nbs/midi-to-nbs"
    import NoteBlockMidiSettings from "$lib/component/nbs/note-block-midi-settings.svelte"

    export let notes: readonly ScheduledNote[]
    export let position: number
    export let playing = false
    export let loading = false
    // Ticks per second, and ticks between the stronger grid lines
    export let tempo = 10
    export let timeSignature = 4
    // Whether the song has been changed since it loaded, so there's something to download
    export let edited = false
    export let canUndo = false
    export let canRedo = false
    export let meta: SongMeta = {name: "", author: "", originalAuthor: "", description: ""}
    // Kept by the parent, as every edit rebuilds the notes and it has to find them again
    export let selected: readonly ScheduledNote[] = []
    // Set for songs converted from a MIDI, which can be converted again with other settings while they play
    export let midiSource: MidiSource | null = null

    type NoteChange = {note: ScheduledNote, edit: NoteEdit}

    const dispatch = createEventDispatcher<{
        close: void
        seek: number
        add: NoteEdit
        edit: NoteChange[]
        remove: readonly ScheduledNote[]
        undo: void
        redo: void
        meta: SongMeta
        reconvert: ConvertResult
        download: void
    }>()

    // Seconds of upcoming notes shown above the keyboard
    const fallTime = 2.5
    // The drawn notes move forward in steps, so the list is only rebuilt twice a second
    const windowStep = 0.5
    // Seconds a key stays lit after a note hits it
    const hitFade = 0.3
    // Seconds a note particle takes to float up and fade
    const particleLife = 0.9

    const clampKey = (key: number) => Math.min(87, Math.max(0, key))

    // Minecraft's note particle colour, which cycles through the hues every 24 semitones starting green at F#3 (NBS key 33).
    // Some white is mixed in so the darker blues still stand out against the background
    const particleColors = Array.from({length: 88}, (_, key) => {
        const step = ((key - 33) % 24 + 24) % 24 / 24
        const channel = (offset: number) => {
            const value = Math.max(0, Math.sin((step + offset) * Math.PI * 2) * 0.65 + 0.35)
            return Math.round((value + (1 - value) * 0.35) * 255)
        }
        return `rgb(${channel(0)}, ${channel(1 / 3)}, ${channel(2 / 3)})`
    })

    // 8x8 pixel art of the note particle, as an SVG path
    const particlePath = [
        "....XX..",
        "....XXX.",
        "....X.XX",
        "....X..X",
        "..XXX...",
        ".XXXX...",
        ".XXXX...",
        "..XX....",
    ].flatMap((row, y) => [...row].map((pixel, x) => pixel === "X" ? `M${x} ${y}h1v1h-1z` : "")).join("")

    type PianoKey = {
        key: number
        black: boolean
        left: number
        width: number
    }

    type DrawnNote = ScheduledNote & {id: number}

    type LitKey = {
        background: string
        glow: string
        strength: number
    }

    type Particle = {
        id: number
        key: number
        progress: number
    }

    // NBS key 0 is A0, so shifting by 9 gives the semitone within a C-based octave
    const isBlack = (key: number) => [1, 3, 6, 8, 10].includes((key + 9) % 12)

    // Fit the keyboard to the song's range: at least two octaves, starting and ending on white keys.
    // The editor adds some room either side so notes can be moved past the song's range
    const getKeyboard = (notes: readonly ScheduledNote[], padding = 0) => {
        let low = notes.length ? Infinity : 33
        let high = notes.length ? -Infinity : 57

        for (const note of notes) {
            low = Math.min(low, note.key)
            high = Math.max(high, note.key)
        }

        const missing = 24 - (high - low)
        if (missing > 0) {
            low -= Math.floor(missing / 2)
            high += Math.ceil(missing / 2)
        }

        low -= padding
        high += padding

        low = Math.max(0, low)
        high = Math.min(87, high)
        if (isBlack(low)) low--
        if (isBlack(high)) high++

        let whiteCount = 0
        for (let key = low; key <= high; key++) if (!isBlack(key)) whiteCount++

        const whiteWidth = 100 / whiteCount
        const blackWidth = whiteWidth * 0.6
        const keys: PianoKey[] = []
        let white = 0

        for (let key = low; key <= high; key++) {
            if (isBlack(key)) {
                keys.push({key, black: true, left: white * whiteWidth - blackWidth / 2, width: blackWidth})
            } else {
                keys.push({key, black: false, left: white * whiteWidth, width: whiteWidth})
                white++
            }
        }

        return keys
    }

    // Index of the first note at or after the given time
    const findNote = (seconds: number) => {
        let low = 0
        let high = notes.length

        while (low < high) {
            const mid = (low + high) >> 1
            if (notes[mid].time < seconds) low = mid + 1
            else high = mid
        }

        return low
    }

    const getDrawnNotes = (start: number) => {
        const drawn: DrawnNote[] = []
        const end = start + fallTime + windowStep

        for (let i = findNote(start); i < notes.length && notes[i].time <= end; i++) {
            drawn.push({...notes[i], id: i})
        }

        return drawn
    }

    const getLitKeys = (position: number) => {
        const colors = new Map<number, Set<string>>()
        const strengths = new Map<number, number>()

        for (let i = findNote(position - hitFade); i < notes.length && notes[i].time <= position; i++) {
            const note = notes[i]
            const strength = 1 - (position - note.time) / hitFade

            if (!colors.has(note.key)) colors.set(note.key, new Set())
            colors.get(note.key)!.add(instruments[note.instrument].color)
            strengths.set(note.key, Math.max(strengths.get(note.key) ?? 0, strength))
        }

        const lit = new Map<number, LitKey>()

        for (const [key, set] of colors) {
            const list = [...set]
            // Several instruments on one key split it into hard-edged stripes
            const stops = list.map((color, i) => `${color} ${i / list.length * 100}% ${(i + 1) / list.length * 100}%`)

            lit.set(key, {
                background: list.length === 1 ? list[0] : `linear-gradient(to right, ${stops.join(", ")})`,
                glow: list[0],
                strength: strengths.get(key)!,
            })
        }

        return lit
    }

    // One particle per key per hit, even when several instruments play the same note together
    const getParticles = (position: number) => {
        const particles: Particle[] = []
        const seen = new Set<string>()

        for (let i = findNote(position - particleLife); i < notes.length && notes[i].time <= position; i++) {
            const note = notes[i]
            const hit = `${note.key}:${note.time}`
            if (seen.has(hit)) continue

            seen.add(hit)
            particles.push({id: i, key: note.key, progress: (position - note.time) / particleLife})
        }

        return particles
    }

    let fallHeight = 0
    let fallArea: HTMLDivElement

    // Editor state. The keyboard is frozen while editing so the lanes don't shift as notes move
    let editing = false
    let adding = false
    let addInstrument = 0
    let editKeyboard: PianoKey[] = []
    let hover: NoteEdit | null = null
    // Instrument swatch under the pointer, named in the tooltip before it's picked
    let hoverInstrument: number | null = null
    // Moves notes by whole octaves when changing instrument, so they sound at the same pitch
    let keepPitch = true
    let metaOpen = false
    let convertOpen = false
    let metaDraft: SongMeta = {...meta}

    // Dragging any selected note moves the whole selection by the same amount
    type Drag = {
        anchor: ScheduledNote
        group: readonly ScheduledNote[]
        startY: number
        pointer: number
        offset: {ticks: number, keys: number} | null
        // A plain click on a note that's already in a bigger selection selects just that note, unless it gets dragged
        collapse: boolean
    }

    // Selection box, in pixels from the top left of the notes area
    type Marquee = {
        pointer: number
        x0: number
        y0: number
        x1: number
        y1: number
        base: readonly ScheduledNote[]
    }

    let drag: Drag | null = null
    let marquee: Marquee | null = null

    const noteId = (note: ScheduledNote) => `${note.tick}:${note.layer}`

    // Only widened when a note ends up past the edges, such as after a jump of a couple of octaves
    $: if (editing && notes.some(note => note.key < editKeyboard[0].key || note.key > editKeyboard[editKeyboard.length - 1].key)) {
        editKeyboard = getKeyboard(notes, 12)
    }
    $: keyboard = editing ? editKeyboard : getKeyboard(notes)
    $: keyLookup = new Map(keyboard.map(key => [key.key, key]))
    $: octaveLines = keyboard.filter(key => (key.key + 9) % 12 === 0)
    $: usedInstruments = [...new Set(notes.map(note => note.instrument))].sort((a, b) => a - b)
    $: pixelsPerSecond = fallHeight / fallTime
    $: windowStart = Math.floor(position / windowStep) * windowStep
    $: drawnNotes = notes && getDrawnNotes(windowStart)
    $: litKeys = notes && getLitKeys(position)
    $: particles = notes && getParticles(position)

    $: canEdit = editing && !playing && !loading
    $: tickHeight = pixelsPerSecond / tempo
    // Notes shrink on fast songs so neighbouring ticks don't overlap
    $: noteHeight = canEdit ? Math.max(4, Math.min(10, tickHeight - 3)) : 10
    // Ticks a note can be placed on while staying fully on screen
    $: firstTick = Math.ceil(position * tempo - 1e-6)
    $: lastTick = Math.max(firstTick, Math.floor((position + fallTime) * tempo - noteHeight / tickHeight))
    $: gridTicks = canEdit && tickHeight > 0 ? Array.from({length: lastTick - firstTick + 1}, (_, i) => firstTick + i) : []
    $: whiteKeys = keyboard.filter(key => !key.black)
    $: blackKeys = keyboard.filter(key => key.black)

    // Playing hides the editing controls, so drop anything half done
    $: if (!canEdit) clearInteraction()

    $: selectedIds = new Set(selected.map(noteId))
    $: dragIds = drag?.offset ? new Set(drag.group.map(noteId)) : null
    $: selectedInstruments = new Set(selected.map(note => note.instrument))
    $: selectedKeys = keyRange(selected)
    $: tooltip = canEdit && selected.length && !drag && !marquee ? getTooltip(selected, position, pixelsPerSecond, fallHeight, noteHeight) : null
    $: if (!selected.length) hoverInstrument = null

    const clearInteraction = () => {
        drag = null
        marquee = null
        hover = null
        if (selected.length) selected = []
    }

    // Loops rather than spreading into Math.min, as select all can pick thousands of notes
    const range = (values: number[]) => {
        let low = Infinity
        let high = -Infinity
        for (const value of values) {
            low = Math.min(low, value)
            high = Math.max(high, value)
        }
        return {low, high}
    }

    const keyRange = (notes: readonly ScheduledNote[]) => range(notes.map(note => note.key))

    // Limits a shift so every note in the group stays between the bounds
    const clampShift = (values: number[], shift: number, low: number, high: number) => {
        const current = range(values)
        return Math.min(high - current.high, Math.max(low - current.low, shift))
    }

    // Notes on screen stay on screen, but a selection that's already partly off it can still move
    const shiftTicks = (group: readonly ScheduledNote[], shift: number) => {
        const ticks = group.map(note => note.tick)
        const current = range(ticks)
        return clampShift(ticks, shift, current.low >= firstTick ? firstTick : 0, current.high <= lastTick ? lastTick : Infinity)
    }

    const moveChanges = (group: readonly ScheduledNote[], ticks: number, keys: number): NoteChange[] =>
        group.map(note => ({note, edit: {tick: note.tick + ticks, key: note.key + keys, instrument: note.instrument}}))

    // Only one of the toolbar's panels is open at a time
    const openMeta = () => {
        metaDraft = {...meta}
        metaOpen = !metaOpen
        convertOpen = false
    }

    const openConvert = () => {
        convertOpen = !convertOpen
        metaOpen = false
    }

    const saveMeta = () => {
        metaOpen = false
        const changed = (Object.keys(meta) as (keyof SongMeta)[]).some(field => meta[field] !== metaDraft[field].trim())
        if (changed) dispatch("meta", {
            name: metaDraft.name.trim(),
            author: metaDraft.author.trim(),
            originalAuthor: metaDraft.originalAuthor.trim(),
            description: metaDraft.description.trim(),
        })
    }

    const toggleEditing = () => {
        if (!editing) editKeyboard = getKeyboard(notes, 12)
        editing = !editing
        adding = false
        metaOpen = false
        clearInteraction()
    }

    // Black keys sit on top of the white ones, so they're checked first
    const keyAt = (clientX: number) => {
        const rect = fallArea.getBoundingClientRect()
        const percent = (clientX - rect.left) / rect.width * 100
        const key = blackKeys.find(key => percent >= key.left && percent < key.left + key.width)
            ?? whiteKeys.find(key => percent >= key.left && percent < key.left + key.width)
            ?? (percent < 50 ? whiteKeys[0] : whiteKeys[whiteKeys.length - 1])

        return key.key
    }

    const clampTick = (tick: number) => Math.min(lastTick, Math.max(firstTick, tick))

    // Puts the pointer in the middle of the note, rather than on the edge that hits the keyboard
    const tickAt = (clientY: number) => {
        const fromBottom = fallArea.getBoundingClientRect().bottom - clientY - noteHeight / 2
        return clampTick(Math.round((position + fromBottom / pixelsPerSecond) * tempo))
    }

    // Ctrl, Cmd or Shift adds to the selection, the same as most editors
    const isAdditive = (event: PointerEvent) => event.metaKey || event.ctrlKey || event.shiftKey

    const selectNote = (event: PointerEvent, note: ScheduledNote) => {
        if (!canEdit || event.button !== 0) return

        event.stopPropagation()

        if (isAdditive(event)) {
            selected = selectedIds.has(noteId(note)) ? selected.filter(other => noteId(other) !== noteId(note)) : [...selected, note]
            return
        }

        const already = selectedIds.has(noteId(note))
        if (!already) selected = [note]

        drag = {
            anchor: note,
            group: already ? selected : [note],
            startY: event.clientY,
            pointer: event.pointerId,
            offset: null,
            collapse: already && selected.length > 1,
        }
    }

    const handleAreaPointerDown = (event: PointerEvent) => {
        if (!canEdit || event.button !== 0) return

        if (adding) {
            const edit = {tick: tickAt(event.clientY), key: keyAt(event.clientX), instrument: addInstrument}
            dispatch("add", edit)
            return
        }

        const rect = fallArea.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const additive = isAdditive(event)

        marquee = {pointer: event.pointerId, x0: x, y0: y, x1: x, y1: y, base: additive ? selected : []}
        if (!additive) selected = []
    }

    // Every drawn note touching the box, added to whatever was selected before it was started
    const updateMarquee = (event: PointerEvent, box: Marquee) => {
        const rect = fallArea.getBoundingClientRect()
        box.x1 = Math.min(rect.width, Math.max(0, event.clientX - rect.left))
        box.y1 = Math.min(rect.height, Math.max(0, event.clientY - rect.top))

        const left = Math.min(box.x0, box.x1)
        const right = Math.max(box.x0, box.x1)
        const top = Math.min(box.y0, box.y1)
        const bottom = Math.max(box.y0, box.y1)

        const hits = drawnNotes.filter(note => {
            const key = keyLookup.get(note.key)
            if (!key) return false

            const noteLeft = key.left / 100 * rect.width
            const noteRight = noteLeft + key.width / 100 * rect.width
            const noteBottom = rect.height - (note.time - position) * pixelsPerSecond
            return noteLeft < right && noteRight > left && noteBottom - noteHeight < bottom && noteBottom > top
        })

        const ids = new Set(box.base.map(noteId))
        selected = [...box.base, ...hits.filter(note => !ids.has(noteId(note)))]
        marquee = box
    }

    const handlePointerMove = (event: PointerEvent) => {
        if (!canEdit) return

        if (marquee && event.pointerId === marquee.pointer) {
            updateMarquee(event, marquee)
            return
        }

        if (drag && event.pointerId === drag.pointer) {
            const {anchor, group} = drag
            const ticks = shiftTicks(group, Math.round((drag.startY - event.clientY) / tickHeight))
            const keys = clampShift(group.map(note => note.key), keyAt(event.clientX) - anchor.key, keyboard[0].key, keyboard[keyboard.length - 1].key)
            drag.offset = ticks || keys || drag.offset ? {ticks, keys} : null
            return
        }

        if (adding && fallArea.contains(event.target as Node)) {
            hover = {tick: tickAt(event.clientY), key: keyAt(event.clientX), instrument: addInstrument}
        } else {
            hover = null
        }
    }

    const handlePointerUp = (event: PointerEvent) => {
        if (marquee && event.pointerId === marquee.pointer) {
            marquee = null
            return
        }

        if (!drag || event.pointerId !== drag.pointer) return

        const {anchor, group, offset, collapse} = drag
        drag = null

        if (offset && (offset.ticks || offset.keys)) {
            dispatch("edit", moveChanges(group, offset.ticks, offset.keys))
        } else if (collapse) {
            selected = [anchor]
        }
    }

    // Each note keeps its own pitch, so a mixed selection moves by different amounts
    const setInstrument = (instrument: number) => {
        const to = instruments[instrument].octave

        const changes = selected.filter(note => note.instrument !== instrument).map(note => {
            const from = instruments[note.instrument].octave
            let key = note.key

            if (keepPitch && from !== undefined && to !== undefined) {
                key += (from - to) * 12
                // Past the end of the range, the nearest octave that fits will have to do
                while (key > 87) key -= 12
                while (key < 0) key += 12
            }

            return {note, edit: {tick: note.tick, key, instrument}}
        })

        addInstrument = instrument
        if (changes.length) dispatch("edit", changes)
    }

    const moveSelected = (ticks: number, keys: number) => {
        if (!selected.length) return

        ticks = shiftTicks(selected, ticks)
        keys = clampShift(selected.map(note => note.key), keys, 0, 87)
        if (ticks || keys) dispatch("edit", moveChanges(selected, ticks, keys))
    }

    // Scrolling up moves forward through the song, as that's where the upcoming notes are
    const handleWheel = (event: WheelEvent) => {
        if (!canEdit) return

        event.preventDefault()
        dispatch("seek", Math.max(0, position - event.deltaY / pixelsPerSecond))
    }

    // Sits above the highest selected note on screen, centred over them all, or below the lowest when there's no room at the top
    const tooltipWidth = 240
    const tooltipHeight = 140

    const getTooltip = (notes: readonly ScheduledNote[], position: number, pixelsPerSecond: number, fallHeight: number, noteHeight: number) => {
        if (!fallArea) return null

        const width = fallArea.clientWidth
        let left = Infinity
        let right = -Infinity
        let lowest = Infinity
        let highest = -Infinity

        for (const note of notes) {
            const key = keyLookup.get(note.key)
            const bottom = (note.time - position) * pixelsPerSecond
            if (!key || bottom < 0 || bottom > fallHeight) continue

            left = Math.min(left, key.left / 100 * width)
            right = Math.max(right, (key.left + key.width) / 100 * width)
            lowest = Math.min(lowest, bottom)
            highest = Math.max(highest, bottom)
        }

        if (left === Infinity) return null

        const above = highest + noteHeight + tooltipHeight + 12 < fallHeight

        return {
            left: Math.min(width - tooltipWidth / 2 - 4, Math.max(tooltipWidth / 2 + 4, (left + right) / 2)),
            bottom: above ? highest + noteHeight + 8 : Math.max(4, lowest - tooltipHeight - 8),
        }
    }

    // Notes being dragged are drawn where they would land
    const placement = (note: ScheduledNote, drag: Drag | null, dragIds: Set<string> | null) =>
        drag?.offset && dragIds?.has(noteId(note))
            ? {key: note.key + drag.offset.keys, time: (note.tick + drag.offset.ticks) / tempo}
            : note

    // Up moves a note later, as that's the way the song scrolls. Shift moves by a beat or an octave
    const arrowMoves: Record<string, [ticks: number, keys: number]> = {
        ArrowUp: [1, 0],
        ArrowDown: [-1, 0],
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
    }

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            if (metaOpen) metaOpen = false
            else if (convertOpen) convertOpen = false
            else if (selected.length) selected = []
            else if (adding) adding = false
            else dispatch("close")
            return
        }

        // Typing in the song info shouldn't delete or move notes
        // Dropdowns use the arrow keys too, so they're left alone as well
        const typing = event.target instanceof Element && event.target.closest("input[type=text], textarea, select")
        if (typing || !canEdit) return

        const shortcut = event.metaKey || event.ctrlKey
        const key = event.key.toLowerCase()

        if (shortcut && (key === "z" || key === "y")) {
            event.preventDefault()
            dispatch(key === "y" || event.shiftKey ? "redo" : "undo")
            return
        }

        if (shortcut && key === "a") {
            event.preventDefault()
            adding = false
            selected = [...notes]
            return
        }

        if (!selected.length || shortcut) return

        if (event.key === "Delete" || event.key === "Backspace") {
            event.preventDefault()
            dispatch("remove", selected)
            return
        }

        const move = arrowMoves[event.key]
        if (move) {
            event.preventDefault()
            moveSelected(move[0] * (event.shiftKey ? timeSignature : 1), move[1] * (event.shiftKey ? 12 : 1))
        }
    }

    // Locks page scrolling while keeping the scrollbar's space reserved, so the page never shifts sideways
    // (the lock is only released once the fade out finishes, while the page is already showing)
    let previousOverflow = ""
    let previousGutter = ""

    onMount(() => {
        const root = document.documentElement
        previousOverflow = root.style.overflow
        previousGutter = root.style.scrollbarGutter
        root.style.scrollbarGutter = "stable"
        root.style.overflow = "hidden"

        // Lets the layout show its menu button over the visualiser on desktop
        NavOverlay.set(true)
    })

    onDestroy(() => {
        if (typeof document === "undefined") return

        NavOverlay.set(false)

        const root = document.documentElement
        root.style.overflow = previousOverflow
        root.style.scrollbarGutter = previousGutter
    })
</script>

<svelte:window on:keydown={handleKeydown} on:pointermove={handlePointerMove} on:pointerup={handlePointerUp} on:pointercancel={() => drag = null}/>

<!-- Above the layout's z-50 menu button; the player shares z-60 but comes later in the page, so stays on top -->
<div class="visualiser fixed inset-0 z-[60] flex flex-col" transition:fade={{duration: 200}}>
    <!-- Space for the player, which moves to the top while expanded -->
    <div class="h-[7.5rem] shrink-0"></div>

    <div class="flex items-start gap-3 px-4 pb-4">
        <div class="legend flex flex-1 flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-white/70">
            {#each usedInstruments as instrument}
                <div class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full" style="background: {instruments[instrument].color}; box-shadow: 0 0 6px {instruments[instrument].color}"></span>
                    {instruments[instrument].name}
                </div>
            {/each}
        </div>

        <!-- Beside the player on wide screens, and above the notes where it would cover it -->
        <div class="relative flex shrink-0 flex-col items-end gap-1.5 xl:fixed xl:top-6 xl:right-6">
            <div class="toolbar">
                {#if editing}
                    <button class="tool" class:active={adding} aria-label="Add Notes" title="Add notes" on:click={() => { adding = !adding; selected = [] }} disabled={!canEdit}>
                        <svg class="h-3.5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                    </button>
                    <button class="tool" aria-label="Undo" title="Undo (Ctrl/⌘ Z)" on:click={() => dispatch("undo")} disabled={!canEdit || !canUndo}>
                        <svg class="h-3.5" viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>
                    </button>
                    <button class="tool" aria-label="Redo" title="Redo (Ctrl/⌘ Shift Z)" on:click={() => dispatch("redo")} disabled={!canEdit || !canRedo}>
                        <svg class="h-3.5 -scale-x-100" viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>
                    </button>
                    <button class="tool" class:active={metaOpen} aria-label="Song Info" title="Song name and author" on:click={openMeta} disabled={loading}>
                        <svg class="h-3.5" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                    </button>
                    <button class="tool" aria-label="Download Edited Song" title={edited ? "Download your edited song" : "Make a change to download it"} on:click={() => dispatch("download")} disabled={!edited}>
                        <svg class="h-3.5" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                    </button>
                    <div class="mx-0.5 h-5 w-px bg-white/10"></div>
                {/if}
                {#if midiSource}
                    <button class="tool" class:active={convertOpen} aria-label="Conversion Settings" title="Change how the MIDI was converted" on:click={openConvert} disabled={loading}>
                        <svg class="h-3.5" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/></svg>
                    </button>
                {/if}
                <button class="tool" class:active={editing} aria-label={editing ? "Stop Editing" : "Edit Song"} title={editing ? "Stop editing" : "Edit song"} on:click={toggleEditing} disabled={loading}>
                    <svg class="h-3.5" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                </button>
            </div>

            {#if editing}
                <p class="legend text-[11px] text-white/50 text-right">
                    {#if playing}
                        Pause to edit
                    {:else if selected.length}
                        Arrow keys nudge, Shift for beats and octaves
                    {:else if adding}
                        Click to place notes
                    {:else}
                        Drag to select, scroll to move through the song
                    {/if}
                </p>
            {/if}

            <!-- Every change converts the song again and swaps it in where it's up to, so variations can be heard straight away -->
            {#if convertOpen && midiSource}
                <div class="convert-panel" transition:fade={{duration: 100}}>
                    <p class="text-sm font-medium text-white/90">Conversion settings</p>
                    <p class="mt-0.5 mb-4 text-xs text-white/40">Changes rebuild the song from the MIDI and replace any edits since. Undo brings the last version back.</p>
                    <NoteBlockMidiSettings
                        midi={midiSource.midi}
                        name={midiSource.name}
                        bind:settings={midiSource.settings}
                        on:change={event => dispatch("reconvert", event.detail)}
                    />
                </div>
            {/if}

            {#if metaOpen}
                <form class="meta-panel" on:submit|preventDefault={saveMeta} transition:fade={{duration: 100}}>
                    <label>
                        <span>Song name</span>
                        <input type="text" bind:value={metaDraft.name} maxlength="255">
                    </label>
                    <label>
                        <span>Author</span>
                        <input type="text" bind:value={metaDraft.author} maxlength="255">
                    </label>
                    <label>
                        <span>Original author</span>
                        <input type="text" bind:value={metaDraft.originalAuthor} maxlength="255">
                    </label>
                    <label>
                        <span>Description</span>
                        <textarea rows="3" bind:value={metaDraft.description} maxlength="1000"></textarea>
                    </label>
                    <div class="flex justify-end gap-2 mt-1">
                        <button type="button" class="meta-button" on:click={() => metaOpen = false}>Cancel</button>
                        <button type="submit" class="meta-button primary">Save</button>
                    </div>
                </form>
            {/if}
        </div>
    </div>

    <div class="flex flex-col flex-1 min-h-0 w-full max-w-6xl mx-auto px-2 sm:px-6">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="relative flex-1 overflow-hidden"
            class:editable={canEdit}
            class:adding={canEdit && adding}
            bind:clientHeight={fallHeight}
            bind:this={fallArea}
            on:pointerdown={handleAreaPointerDown}
            on:pointerleave={() => hover = null}
            on:wheel|nonpassive={handleWheel}
        >
            {#if canEdit}
                <!-- Lanes for the black keys, lines between the white ones, and a line on every tick -->
                {#each blackKeys as key (key.key)}
                    <div class="absolute inset-y-0 bg-white/[0.025]" style="left: {key.left}%; width: {key.width}%"></div>
                {/each}
                {#each whiteKeys as key (key.key)}
                    <div class="absolute inset-y-0 w-px bg-white/[0.06]" style="left: {key.left}%"></div>
                {/each}
                {#each gridTicks as tick (tick)}
                    <div class="tick-line" class:beat={tick % timeSignature === 0} style="bottom: {(tick / tempo - position) * pixelsPerSecond}px"></div>
                {/each}
            {:else}
                {#each octaveLines as line}
                    <div class="absolute inset-y-0 w-px bg-white/[0.04]" style="left: {line.left}%"></div>
                {/each}
            {/if}

            {#if loading}
                <div class="absolute inset-0 flex justify-center items-center">
                    <div class="h-8 w-8 rounded-full border-2 border-white/10 border-t-cyan-300 animate-spin"></div>
                </div>
            {/if}

            <div class="absolute inset-x-0 bottom-0 will-change-transform" style="transform: translateY({position * pixelsPerSecond}px)">
                {#each drawnNotes as note (note.id)}
                    {@const shown = placement(note, drag, dragIds)}
                    {@const key = keyLookup.get(shown.key)}
                    {#if key}
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class="note"
                            class:selected={canEdit && selectedIds.has(noteId(note))}
                            style="left: calc({key.left}% + 1px); width: calc({key.width}% - 2px); height: {noteHeight}px; bottom: {shown.time * pixelsPerSecond}px; --color: {instruments[note.instrument].color}"
                            on:pointerdown={event => selectNote(event, note)}
                        >
                            <!-- Only the note being held is labelled, so a big selection doesn't fill the screen with text -->
                            {#if drag?.offset && noteId(note) === noteId(drag.anchor)}
                                <span class="note-label">{keyName(shown.key)}</span>
                            {/if}
                        </div>
                    {/if}
                {/each}

                {#if canEdit && adding && hover}
                    {@const key = keyLookup.get(hover.key)}
                    {#if key}
                        <div
                            class="note ghost"
                            style="left: calc({key.left}% + 1px); width: calc({key.width}% - 2px); height: {noteHeight}px; bottom: {hover.tick / tempo * pixelsPerSecond}px; --color: {instruments[hover.instrument].color}"
                        >
                            <span class="note-label">{keyName(hover.key)}</span>
                        </div>
                    {/if}
                {/if}
            </div>

            {#each [...litKeys] as [keyNumber, light] (keyNumber)}
                {@const key = keyLookup.get(keyNumber)}
                {#if key}
                    <div class="flare" style="left: {key.left}%; width: {key.width}%; --color: {light.glow}; opacity: {light.strength * 0.7}"></div>
                {/if}
            {/each}

            {#each particles as particle (particle.id)}
                {@const key = keyLookup.get(particle.key)}
                {#if key}
                    <!-- Each particle drifts a little to one side, picked from its ID so it doesn't change between frames -->
                    <svg
                        class="particle"
                        viewBox="0 0 8.5 8.5"
                        style="left: {key.left + key.width / 2}%; opacity: {1 - particle.progress}; transform: translate(calc(-50% + {(particle.id * 7) % 9 - 4}px), {-particle.progress * 110}px)"
                    >
                        <path d={particlePath} transform="translate(0.5 0.5)" fill="rgba(0, 0, 0, 0.7)"/>
                        <path d={particlePath} fill={particleColors[particle.key]}/>
                    </svg>
                {/if}
            {/each}

            {#if marquee}
                <div
                    class="marquee"
                    style="left: {Math.min(marquee.x0, marquee.x1)}px; top: {Math.min(marquee.y0, marquee.y1)}px; width: {Math.abs(marquee.x1 - marquee.x0)}px; height: {Math.abs(marquee.y1 - marquee.y0)}px"
                ></div>
            {/if}

            {#if tooltip && selected.length}
                <!-- Names the swatch under the pointer, so colours can be matched to instruments before picking one.
                     A mixed selection has no single instrument or note to show, so those are shown as a range instead -->
                {@const count = selected.length}
                {@const mixed = selectedInstruments.size > 1}
                {@const previewing = hoverInstrument !== null && (mixed || !selectedInstruments.has(hoverInstrument))}
                {@const shownInstrument = instruments[previewing && hoverInstrument !== null ? hoverInstrument : selected[0].instrument]}
                {@const sameKey = selectedKeys.low === selectedKeys.high}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    class="note-tooltip"
                    style="left: {tooltip.left}px; bottom: {tooltip.bottom}px; width: {tooltipWidth}px; height: {tooltipHeight}px"
                    on:pointerdown|stopPropagation
                    transition:fade={{duration: 100}}
                >
                    <div class="flex items-center gap-2">
                        {#if mixed && !previewing}
                            <span class="h-2 w-2 shrink-0 rounded-full bg-white/40"></span>
                        {:else}
                            <span class="h-2 w-2 shrink-0 rounded-full" style="background: {shownInstrument.color}; box-shadow: 0 0 6px {shownInstrument.color}"></span>
                        {/if}
                        <span class="legend flex-1 truncate text-xs {previewing ? 'text-white/50' : 'text-white/90'}">
                            {#if previewing}
                                Change {count > 1 ? "all " : ""}to {shownInstrument.name}
                            {:else}
                                {mixed ? "Mixed" : shownInstrument.name}{count > 1 ? ` (${count} notes)` : ""}
                            {/if}
                        </span>
                        <button class="tool h-7 w-7 hover:!text-red-400" aria-label={count > 1 ? "Delete Notes" : "Delete Note"} title={count > 1 ? `Delete ${count} notes` : "Delete note"} on:click={() => dispatch("remove", selected)}>
                            <svg class="h-3" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                    </div>
                    <div class="grid grid-cols-8 gap-1.5 mt-2">
                        {#each instruments as instrument, id}
                            <button
                                class="swatch"
                                class:current={selectedInstruments.has(id)}
                                style="--color: {instrument.color}"
                                aria-label={instrument.name}
                                on:click={() => setInstrument(id)}
                                on:pointerenter={() => hoverInstrument = id}
                                on:pointerleave={() => { if (hoverInstrument === id) hoverInstrument = null }}
                                on:focus={() => hoverInstrument = id}
                                on:blur={() => { if (hoverInstrument === id) hoverInstrument = null }}
                            ></button>
                        {/each}
                    </div>
                    <div class="flex items-center justify-between mt-2.5">
                        <div class="flex items-center gap-1">
                            <button class="tool h-6 w-6" aria-label="Down an Octave" title="Down an octave (Shift ←)" on:click={() => moveSelected(0, -12)} disabled={selectedKeys.low < 12}>
                                <svg class="h-2.5" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                            </button>
                            {#if sameKey}
                                <span class="legend min-w-[2rem] text-center text-xs text-white/90 tabular-nums" title="Note">{keyName(selectedKeys.low)}</span>
                            {:else}
                                <span class="legend min-w-[2rem] text-center text-xs text-white/40 tabular-nums whitespace-nowrap" title="Notes move relative to where they are">
                                    {keyName(selectedKeys.low)}–{keyName(selectedKeys.high)}
                                </span>
                            {/if}
                            <button class="tool h-6 w-6" aria-label="Up an Octave" title="Up an octave (Shift →)" on:click={() => moveSelected(0, 12)} disabled={selectedKeys.high > 75}>
                                <svg class="h-2.5" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                            </button>
                        </div>
                        <label class="legend flex items-center gap-1.5 whitespace-nowrap text-[11px] text-white/60 cursor-pointer select-none" title="Moves the note by octaves when changing instrument, so it sounds at the same pitch">
                            <input type="checkbox" class="accent-cyan-400" bind:checked={keepPitch}>
                            Keep pitch
                        </label>
                    </div>
                </div>
            {/if}
        </div>

        <div class="hit-line"></div>

        <div class="relative shrink-0 h-[clamp(4.5rem,14vh,8rem)] mb-4">
            {#each keyboard as key (key.key)}
                {@const light = litKeys.get(key.key)}
                <div class="key" class:black={key.black} style="left: {key.left}%; width: {key.width}%">
                    {#if light}
                        <div class="key-light" style="background: {light.background}; --color: {light.glow}; opacity: {0.35 + light.strength * 0.65}"></div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .visualiser {
        background:
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.12), transparent),
            radial-gradient(ellipse 60% 40% at 50% 85%, rgba(34, 211, 238, 0.08), transparent),
            linear-gradient(rgba(5, 5, 7, 0.86), rgba(5, 5, 7, 0.95)),
            url("/nbs/deepslate.png") 0 0 / 64px 64px,
            #050507;
        image-rendering: pixelated;
    }

    .legend {
        font-family: "Minecraft", sans-serif;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    }

    .note {
        @apply absolute h-2.5 rounded-[3px];
        background: var(--color);
        box-shadow: 0 0 6px var(--color), 0 0 14px color-mix(in srgb, var(--color) 50%, transparent);
    }

    .editable .note {
        @apply cursor-grab;
        touch-action: none;
    }

    /* A bigger target than the note itself, as fast songs make them quite thin */
    .editable .note::after {
        content: "";
        @apply absolute -inset-1;
    }

    .editable:active .note {
        @apply cursor-grabbing;
    }

    .editable {
        touch-action: none;
    }

    .adding {
        @apply cursor-crosshair;
    }

    .note.selected {
        @apply z-10;
        box-shadow: 0 0 0 2px white, 0 0 12px var(--color), 0 0 24px color-mix(in srgb, var(--color) 60%, transparent);
    }

    .marquee {
        @apply absolute z-20 rounded-sm border border-cyan-300/70 bg-cyan-300/10 pointer-events-none;
    }

    .note.ghost {
        @apply pointer-events-none opacity-50;
    }

    .tick-line {
        @apply absolute inset-x-0 h-px bg-white/[0.05];
    }

    .tick-line.beat {
        @apply bg-white/[0.14];
    }

    .toolbar {
        @apply flex items-center gap-0.5 rounded-xl border border-white/10 bg-[#1c1c1e]/70 p-1 backdrop-blur-xl shadow-lg shadow-black/40;
    }

    .tool {
        @apply flex h-8 w-8 items-center justify-center rounded-lg fill-current text-white/60 transition-colors;
    }

    .tool:hover:not(:disabled) {
        @apply bg-white/10 text-white;
    }

    .tool:disabled {
        @apply opacity-30 cursor-not-allowed;
    }

    .tool.active {
        @apply bg-cyan-400/20 text-cyan-200;
    }

    .note-tooltip {
        @apply absolute z-20 -translate-x-1/2 rounded-xl border border-white/10 bg-[#1c1c1e]/90 p-2.5 backdrop-blur-xl shadow-2xl shadow-black/60 cursor-default;
        image-rendering: auto;
    }

    .swatch {
        @apply h-5 w-5 justify-self-center rounded-full transition-transform hover:scale-110;
        background: var(--color);
    }

    .note-label {
        @apply absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1 text-[10px] leading-4 text-white pointer-events-none;
        font-family: "Minecraft", sans-serif;
    }

    .meta-panel {
        @apply absolute right-0 top-full z-30 mt-2 flex w-72 flex-col gap-2.5 rounded-xl border border-white/10 bg-[#1c1c1e]/95 p-3 backdrop-blur-xl shadow-2xl shadow-black/60;
    }

    .convert-panel {
        @apply absolute right-0 top-full z-30 mt-2 w-[24rem] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-12rem)] overflow-y-auto rounded-xl border border-white/10 bg-[#1c1c1e]/95 p-4 text-left backdrop-blur-xl shadow-2xl shadow-black/60;
    }

    .meta-panel label {
        @apply flex flex-col gap-1 text-[11px] text-white/50;
    }

    .meta-panel input, .meta-panel textarea {
        @apply w-full resize-none rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm text-white outline-none transition-colors focus:border-cyan-400/60;
    }

    .meta-button {
        @apply rounded-lg px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white;
    }

    .meta-button.primary {
        @apply bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30;
    }

    .swatch.current {
        box-shadow: 0 0 0 2px #1c1c1e, 0 0 0 3.5px white, 0 0 8px var(--color);
    }

    .flare {
        @apply absolute bottom-0 h-24 pointer-events-none;
        background: linear-gradient(to top, var(--color), transparent);
        filter: blur(6px);
    }

    .particle {
        @apply absolute bottom-0 h-4 w-4 pointer-events-none;
        shape-rendering: crispEdges;
    }

    .hit-line {
        @apply h-px shrink-0;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
        box-shadow: 0 0 8px rgba(139, 92, 246, 0.8), 0 0 16px rgba(34, 211, 238, 0.4);
    }

    .key {
        @apply absolute top-0 h-full rounded-b-md border border-t-0 border-white/10;
        background: linear-gradient(to bottom, #15151a, #24242b);
    }

    .key.black {
        @apply h-[62%] z-10 border-white/15;
        background: linear-gradient(to bottom, #050506, #111114);
    }

    .key-light {
        @apply absolute inset-0 rounded-b-md;
        box-shadow: 0 0 18px var(--color), inset 0 0 12px rgba(255, 255, 255, 0.35);
    }
</style>
