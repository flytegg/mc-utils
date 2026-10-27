import {fromArrayBuffer} from "@nbsjs/core"

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
}

export class NbsPlayer {
    onEnd: () => void = () => {}

    private context: AudioContext | null = null
    private master: GainNode | null = null
    private buffers: Promise<AudioBuffer[]> | null = null
    private loadedBuffers: AudioBuffer[] = []
    private sources = new Set<AudioBufferSourceNode>()

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
        const tempo = song.getTempo()
        const notes: ScheduledNote[] = []

        for (const layer of song.layers) {
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
                })
            }
        }

        this.notes = notes.sort((a, b) => a.time - b.time)
        this.duration = song.getLength() / tempo

        await this.getBuffers()

        return {author: song.author || song.originalAuthor}
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
