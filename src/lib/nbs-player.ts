import {fromArrayBuffer, toArrayBuffer, Note, type Song} from "@nbsjs/core"

// Indexed by NBS instrument ID; anything else (custom instruments) falls back to harp
const instrumentSounds = [
    "harp", "bass", "bd", "snare", "hat", "guitar", "flute", "bell",
    "icechime", "xylobone", "iron_xylophone", "cow_bell", "didgeridoo", "bit", "banjo", "pling"
]

// Sounds are recorded at F#4, which is key 45 in NBS
const baseKey = 45

// How far ahead (seconds) notes are queued; background tabs throttle timers to ~1s
const lookahead = 0.2
const hiddenLookahead = 1.5
const schedulerInterval = 25

export type ScheduledNote = {
    time: number
    // 0 (A0) to 87 (C8), the same range as a piano
    key: number
    instrument: number
    rate: number
    gain: number
    pan: number
    // Where the note lives in the song, so the editor can find it again
    tick: number
    layer: number
}

export type NoteEdit = {
    tick: number
    key: number
    instrument: number
}

export type SongMeta = {
    name: string
    author: string
    originalAuthor: string
    description: string
}

// Each undo step keeps a copy of the whole song, which is only a few kilobytes for most songs
const historyLimit = 200

export class NbsPlayer {
    onEnd: () => void = () => {}

    private context: AudioContext | null = null
    private master: GainNode | null = null
    private buffers: Promise<AudioBuffer[]> | null = null
    private loadedBuffers: AudioBuffer[] = []
    private sources = new Set<AudioBufferSourceNode>()

    private song: Song | null = null
    private undoStack: ArrayBuffer[] = []
    private redoStack: ArrayBuffer[] = []
    private notes: ScheduledNote[] = []
    private nextNote = 0
    private offset = 0
    private startedAt = 0
    private timer: ReturnType<typeof setInterval> | null = null
    private request = 0
    private volume = 1

    duration = 0
    playing = false

    // Call synchronously inside a click handler; Safari only allows audio to start from a user gesture
    unlock() {
        this.getContext().resume()
    }

    async load(data: ArrayBuffer) {
        this.stop()

        const song = fromArrayBuffer(data)
        this.song = song
        this.undoStack = []
        this.redoStack = []
        this.buildNotes()

        await this.getBuffers()

        return {author: song.author || song.originalAuthor}
    }

    // Ticks per second
    getTempo() {
        return this.song?.getTempo() ?? 10
    }

    // Ticks per beat, as shown by Note Block Studio
    getTimeSignature() {
        return this.song?.timeSignature ?? 4
    }

    // The editing methods change the loaded song in place (never the file it came from) and should only be used while paused.
    // They return the note as it is now, since every edit rebuilds the note list
    addNote(edit: NoteEdit) {
        this.checkpoint()

        const song = this.song!
        const layer = this.findFreeLayer(edit.tick)
        song.layers.all[layer].notes.add(edit.tick, new Note(edit.instrument, {key: edit.key}))

        return this.rebuildAndFind(edit.tick, layer)
    }

    // Changes several notes as one undo step, returning them in the same order
    editNotes(changes: {note: ScheduledNote, edit: NoteEdit}[]) {
        const layers = this.song!.layers.all
        const found = changes
            .map(change => ({...change, original: layers[change.note.layer]?.notes.all[change.note.tick]}))
            .filter(change => change.original)
        if (!found.length) return []

        this.checkpoint()

        // Everything is lifted out first, so notes moving together don't bump into each other's old spots
        for (const {note} of found) layers[note.layer].notes.delete(note.tick)

        const placed = found.map(({note, edit, original}) => {
            // Custom instruments are shown as harp, so they're only replaced when a new instrument is picked
            if (edit.instrument !== note.instrument) original!.instrument = edit.instrument
            original!.key = edit.key

            // Stays on its own layer when it can, so its volume and stereo don't change
            const layer = layers[note.layer].notes.all[edit.tick] ? this.findFreeLayer(edit.tick) : note.layer
            layers[layer].notes.add(edit.tick, original!)
            return `${edit.tick}:${layer}`
        })

        this.buildNotes()
        const lookup = new Map(this.notes.map(note => [`${note.tick}:${note.layer}`, note]))
        return placed.map(id => lookup.get(id)).filter((note): note is ScheduledNote => !!note)
    }

    removeNotes(notes: readonly ScheduledNote[]) {
        if (!notes.length) return

        this.checkpoint()
        for (const note of notes) this.song!.layers.all[note.layer]?.notes.delete(note.tick)
        this.buildNotes()
    }

    getMeta(): SongMeta {
        const song = this.song
        return {
            name: song?.name ?? "",
            author: song?.author ?? "",
            originalAuthor: song?.originalAuthor ?? "",
            description: song?.description ?? "",
        }
    }

    setMeta(meta: SongMeta) {
        this.checkpoint()

        const song = this.song!
        song.name = meta.name || undefined
        song.author = meta.author || undefined
        song.originalAuthor = meta.originalAuthor || undefined
        song.description = meta.description || undefined
    }

    canUndo() {
        return this.undoStack.length > 0
    }

    canRedo() {
        return this.redoStack.length > 0
    }

    undo() {
        const previous = this.undoStack.pop()
        if (!previous) return

        this.redoStack.push(this.export())
        this.restore(previous)
    }

    redo() {
        const next = this.redoStack.pop()
        if (!next) return

        this.undoStack.push(this.export())
        this.restore(next)
    }

    // Plays one note straight away, so the editor can be heard while paused
    preview(note: ScheduledNote) {
        const context = this.context
        if (!context || this.playing || !this.loadedBuffers.length) return

        this.playNote(context, this.loadedBuffers[note.instrument], note, context.currentTime)
    }

    export(): ArrayBuffer {
        // Copied, as the writer's buffer is resizable, which Blob doesn't accept everywhere
        return toArrayBuffer(this.song!).slice(0) as ArrayBuffer
    }

    private checkpoint() {
        this.undoStack.push(this.export())
        if (this.undoStack.length > historyLimit) this.undoStack.shift()
        this.redoStack = []
    }

    private restore(data: ArrayBuffer) {
        this.song = fromArrayBuffer(data)
        this.buildNotes()
    }

    async play() {
        if (this.playing || !this.notes.length) return

        const request = ++this.request
        const context = this.getContext()
        await context.resume()
        await this.getBuffers()

        // Paused, stopped or replaced while waiting
        if (request !== this.request || this.playing) return

        if (this.offset >= this.duration) this.offset = 0

        this.playing = true
        this.startedAt = context.currentTime - this.offset
        this.nextNote = this.findNote(this.offset)
        this.timer = setInterval(() => this.schedule(), schedulerInterval)
        this.schedule()
    }

    pause() {
        this.request++
        if (!this.playing) return

        this.offset = this.getPosition()
        this.playing = false
        this.clearTimer()
        this.stopSources()
    }

    stop() {
        this.pause()
        this.offset = 0
    }

    seek(seconds: number) {
        const wasPlaying = this.playing

        this.pause()
        this.offset = Math.min(Math.max(seconds, 0), this.duration)

        if (wasPlaying) this.play()
    }

    setVolume(volume: number) {
        this.volume = volume
        if (this.master) this.master.gain.value = volume
    }

    // Sorted by time
    getNotes(): readonly ScheduledNote[] {
        return this.notes
    }

    getPosition() {
        if (!this.playing || !this.context) return this.offset
        return Math.min(this.context.currentTime - this.startedAt, this.duration)
    }

    destroy() {
        this.stop()
        this.context?.close()
        this.context = null
    }

    private buildNotes() {
        const song = this.song!
        const tempo = song.getTempo()
        const notes: ScheduledNote[] = []

        song.layers.all.forEach((layer, layerIndex) => {
            const layerVolume = (layer.volume ?? 100) / 100
            const layerPan = layer.stereo ?? 0

            for (const [tick, note] of layer.notes) {
                const key = note.key ?? baseKey
                const semitones = key - baseKey + (note.pitch ?? 0) / 100

                notes.push({
                    time: tick / tempo,
                    key,
                    instrument: note.instrument < instrumentSounds.length ? note.instrument : 0,
                    rate: Math.pow(2, semitones / 12),
                    gain: (note.velocity ?? 100) / 100 * layerVolume,
                    // NBS uses -100 for right, Web Audio uses -1 for left
                    pan: -(layerPan + (note.panning ?? 0)) / 200,
                    tick,
                    layer: layerIndex,
                })
            }
        })

        this.notes = notes.sort((a, b) => a.time - b.time)
        this.duration = song.getLength() / tempo
    }

    private rebuildAndFind(tick: number, layer: number) {
        this.buildNotes()
        return this.notes.find(note => note.tick === tick && note.layer === layer) ?? null
    }

    // An NBS layer holds one note per tick, so a new layer is made when they're all taken
    private findFreeLayer(tick: number) {
        const layers = this.song!.layers
        const free = layers.all.findIndex(layer => !layer.notes.all[tick])
        if (free !== -1) return free

        layers.create()
        return layers.all.length - 1
    }

    private schedule() {
        const context = this.context
        if (!context) return

        const buffers = this.loadedBuffers
        const until = context.currentTime + (document.hidden ? hiddenLookahead : lookahead)

        while (this.nextNote < this.notes.length) {
            const note = this.notes[this.nextNote]
            const when = this.startedAt + note.time
            if (when > until) break

            this.playNote(context, buffers[note.instrument], note, when)
            this.nextNote++
        }

        if (this.nextNote >= this.notes.length && context.currentTime - this.startedAt >= this.duration) {
            this.stop()
            this.onEnd()
        }
    }

    private playNote(context: AudioContext, buffer: AudioBuffer, note: ScheduledNote, when: number) {
        const source = context.createBufferSource()
        const gain = context.createGain()
        const panner = context.createStereoPanner()

        source.buffer = buffer
        source.playbackRate.value = note.rate
        gain.gain.value = note.gain
        panner.pan.value = note.pan

        source.connect(gain).connect(panner).connect(this.master!)
        source.onended = () => this.sources.delete(source)
        source.start(Math.max(when, context.currentTime))

        this.sources.add(source)
    }

    private stopSources() {
        for (const source of this.sources) source.stop()
        this.sources.clear()
    }

    private clearTimer() {
        if (this.timer) clearInterval(this.timer)
        this.timer = null
    }

    // Index of the first note at or after the given time
    private findNote(seconds: number) {
        let low = 0
        let high = this.notes.length

        while (low < high) {
            const mid = (low + high) >> 1
            if (this.notes[mid].time < seconds) low = mid + 1
            else high = mid
        }

        return low
    }

    private getContext() {
        if (!this.context) {
            this.context = new AudioContext()
            this.master = this.context.createGain()
            this.master.gain.value = this.volume
            this.master.connect(this.context.destination)
        }

        return this.context
    }

    private getBuffers() {
        if (!this.buffers) {
            const context = this.getContext()

            this.buffers = Promise.all(instrumentSounds.map(async name => {
                const response = await fetch(`/sounds/sounds/note/${name}.ogg`)
                return context.decodeAudioData(await response.arrayBuffer())
            })).then(buffers => this.loadedBuffers = buffers, error => {
                this.buffers = null
                throw error
            })
        }

        return this.buffers
    }
}
