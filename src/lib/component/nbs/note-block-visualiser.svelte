<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte"
    import {fade} from "svelte/transition"
    import type {ScheduledNote} from "$lib/nbs-player"
    import {NavOverlay} from "$lib/store"

    export let notes: readonly ScheduledNote[]
    export let position: number

    const dispatch = createEventDispatcher<{close: void}>()

    // Seconds of upcoming notes shown above the keyboard
    const fallTime = 2.5
    // The drawn notes move forward in steps, so the list is only rebuilt twice a second
    const windowStep = 0.5
    // Seconds a key stays lit after a note hits it
    const hitFade = 0.3
    // Seconds a note particle takes to float up and fade
    const particleLife = 0.9

    // Indexed by NBS instrument ID, matching the player's sounds
    const instruments = [
        {name: "Harp", color: "#22d3ee"},
        {name: "Bass", color: "#8b5cf6"},
        {name: "Bass Drum", color: "#ef4444"},
        {name: "Snare", color: "#f97316"},
        {name: "Click", color: "#facc15"},
        {name: "Guitar", color: "#a3e635"},
        {name: "Flute", color: "#10b981"},
        {name: "Bell", color: "#f472b6"},
        {name: "Chime", color: "#7dd3fc"},
        {name: "Xylophone", color: "#e2e8f0"},
        {name: "Iron Xylophone", color: "#2dd4bf"},
        {name: "Cow Bell", color: "#d97706"},
        {name: "Didgeridoo", color: "#e879f9"},
        {name: "Bit", color: "#4ade80"},
        {name: "Banjo", color: "#fda4af"},
        {name: "Pling", color: "#60a5fa"},
    ]

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

    // Fit the keyboard to the song's range: at least two octaves, starting and ending on white keys
    const getKeyboard = (notes: readonly ScheduledNote[]) => {
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

    $: keyboard = getKeyboard(notes)
    $: keyLookup = new Map(keyboard.map(key => [key.key, key]))
    $: octaveLines = keyboard.filter(key => (key.key + 9) % 12 === 0)
    $: usedInstruments = [...new Set(notes.map(note => note.instrument))].sort((a, b) => a - b)
    $: pixelsPerSecond = fallHeight / fallTime
    $: windowStart = Math.floor(position / windowStep) * windowStep
    $: drawnNotes = notes && getDrawnNotes(windowStart)
    $: litKeys = notes && getLitKeys(position)
    $: particles = notes && getParticles(position)

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") dispatch("close")
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

<svelte:window on:keydown={handleKeydown}/>

<!-- Above the layout's z-50 menu button; the player shares z-60 but comes later in the page, so stays on top -->
<div class="visualiser fixed inset-0 z-[60] flex flex-col" transition:fade={{duration: 200}}>
    <!-- Space for the player, which moves to the top while expanded -->
    <div class="h-[7.5rem] shrink-0"></div>

    <div class="legend flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-4 pb-4 text-xs text-white/70">
        {#each usedInstruments as instrument}
            <div class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full" style="background: {instruments[instrument].color}; box-shadow: 0 0 6px {instruments[instrument].color}"></span>
                {instruments[instrument].name}
            </div>
        {/each}
    </div>

    <div class="flex flex-col flex-1 min-h-0 w-full max-w-6xl mx-auto px-2 sm:px-6">
        <div class="relative flex-1 overflow-hidden" bind:clientHeight={fallHeight}>
            {#each octaveLines as line}
                <div class="absolute inset-y-0 w-px bg-white/[0.04]" style="left: {line.left}%"></div>
            {/each}

            {#if !notes.length}
                <div class="absolute inset-0 flex justify-center items-center">
                    <div class="h-8 w-8 rounded-full border-2 border-white/10 border-t-cyan-300 animate-spin"></div>
                </div>
            {/if}

            <div class="absolute inset-x-0 bottom-0 will-change-transform" style="transform: translateY({position * pixelsPerSecond}px)">
                {#each drawnNotes as note (note.id)}
                    {@const key = keyLookup.get(note.key)}
                    {#if key}
                        <div
                            class="note"
                            style="left: calc({key.left}% + 1px); width: calc({key.width}% - 2px); bottom: {note.time * pixelsPerSecond}px; --color: {instruments[note.instrument].color}"
                        ></div>
                    {/if}
                {/each}
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
