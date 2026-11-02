// A small reader for Standard MIDI Files (.mid), just enough to turn them into note block songs

export type MidiNote = {
    // Start and length in MIDI ticks
    tick: number
    duration: number
    // 0 to 127, where 60 is middle C
    pitch: number
    // 1 to 127, already scaled by the channel's volume and expression
    velocity: number
    // -1 for left to 1 for right
    pan: number
    channel: number
    track: number
    // General MIDI program the channel was set to when the note started
    program: number
}

export type MidiFile = {
    ticksPerBeat: number
    // Microseconds per beat, from each tempo change, sorted by tick
    tempos: {tick: number, tempo: number}[]
    // Beats per bar, from the first time signature
    beatsPerBar: number
    trackNames: string[]
    notes: MidiNote[]
}

// General MIDI's drum channel (10, counting from 1)
export const drumChannel = 9

type RawEvent = {
    tick: number
    track: number
    // Program and controller changes are applied before notes on the same tick
    order: number
    apply: (state: ChannelState[]) => void
}

type ChannelState = {
    program: number
    volume: number
    expression: number
    pan: number
}

class Reader {
    position = 0
    private view: DataView

    constructor(view: DataView) {
        this.view = view
    }

    get done() {
        return this.position >= this.view.byteLength
    }

    byte() {
        return this.view.getUint8(this.position++)
    }

    uint16() {
        const value = this.view.getUint16(this.position)
        this.position += 2
        return value
    }

    uint32() {
        const value = this.view.getUint32(this.position)
        this.position += 4
        return value
    }

    // Variable-length quantity: 7 bits per byte, with the top bit set on every byte but the last
    variable() {
        let value = 0
        for (let i = 0; i < 4; i++) {
            const byte = this.byte()
            value = value * 128 + (byte & 0x7f)
            if (!(byte & 0x80)) break
        }
        return value
    }

    text(length: number) {
        let text = ""
        for (let i = 0; i < length; i++) text += String.fromCharCode(this.byte())
        return text
    }
}

export function parseMidi(data: ArrayBuffer): MidiFile {
    const reader = new Reader(new DataView(data))

    if (reader.text(4) !== "MThd") throw new Error("Not a MIDI file")
    const headerLength = reader.uint32()
    reader.uint16() // Format, which doesn't matter once every track is merged
    const trackCount = reader.uint16()
    const division = reader.uint16()
    reader.position = 8 + headerLength

    // Timecode-based files are rare; treating them as 120 BPM keeps their timing right
    const ticksPerBeat = division & 0x8000 ? (256 - (division >> 8)) * (division & 0xff) / 2 : division

    const events: RawEvent[] = []
    const tempos: {tick: number, tempo: number}[] = []
    const trackNames: string[] = []
    let beatsPerBar = 0

    // Notes still sounding, by track, channel and pitch
    const open = new Map<string, {tick: number, velocity: number, state: ChannelState}[]>()
    const notes: MidiNote[] = []

    for (let track = 0; track < trackCount && !reader.done; track++) {
        const id = reader.text(4)
        const length = reader.uint32()
        const end = reader.position + length

        if (id !== "MTrk") {
            reader.position = end
            continue
        }

        let tick = 0
        let status = 0
        trackNames[track] = ""

        while (reader.position < end) {
            tick += reader.variable()
            let byte = reader.byte()

            if (byte === 0xff) {
                const type = reader.byte()
                const size = reader.variable()
                const start = reader.position

                if (type === 0x51 && size >= 3) {
                    tempos.push({tick, tempo: (reader.byte() << 16) | (reader.byte() << 8) | reader.byte()})
                } else if (type === 0x58 && size >= 1 && !beatsPerBar) {
                    beatsPerBar = reader.byte()
                } else if (type === 0x03 && !trackNames[track]) {
                    trackNames[track] = reader.text(size).trim()
                } else if (type === 0x2f) {
                    break
                }

                reader.position = start + size
                continue
            }

            if (byte === 0xf0 || byte === 0xf7) {
                reader.position += reader.variable()
                continue
            }

            // Running status: the previous status byte is reused when a data byte comes first
            if (byte & 0x80) {
                status = byte
                byte = reader.byte()
            }

            const type = status & 0xf0
            const channel = status & 0x0f
            const eventTick = tick

            if (type === 0xc0 || type === 0xd0) {
                if (type === 0xc0) {
                    const program = byte
                    events.push({tick: eventTick, track, order: 0, apply: state => state[channel].program = program})
                }
                continue
            }

            const value = reader.byte()

            if (type === 0xb0) {
                const controller = byte
                events.push({
                    tick: eventTick, track, order: 0, apply: state => {
                        if (controller === 7) state[channel].volume = value
                        else if (controller === 11) state[channel].expression = value
                        else if (controller === 10) state[channel].pan = value
                    },
                })
            } else if (type === 0x90 || type === 0x80) {
                const pitch = byte
                const on = type === 0x90 && value > 0
                events.push({
                    tick: eventTick, track, order: on ? 2 : 1, apply: state => {
                        const key = `${track}:${channel}:${pitch}`
                        if (on) {
                            if (!open.has(key)) open.set(key, [])
                            open.get(key)!.push({tick: eventTick, velocity: value, state: {...state[channel]}})
                            return
                        }

                        // A note off closes the oldest matching note, like most players
                        const started = open.get(key)?.shift()
                        if (started) notes.push(makeNote(started, eventTick, pitch, channel, track))
                    },
                })
            }
        }

        reader.position = end
    }

    const state: ChannelState[] = Array.from({length: 16}, () => ({program: 0, volume: 100, expression: 127, pan: 64}))
    events.sort((a, b) => a.tick - b.tick || a.order - b.order)
    for (const event of events) event.apply(state)

    // Notes never switched off last until the end of the song
    const last = events.length ? events[events.length - 1].tick : 0
    for (const [key, started] of open) {
        const [track, channel, pitch] = key.split(":").map(Number)
        for (const note of started) notes.push(makeNote(note, last, pitch, channel, track))
    }

    notes.sort((a, b) => a.tick - b.tick || b.pitch - a.pitch)
    tempos.sort((a, b) => a.tick - b.tick)

    return {ticksPerBeat, tempos, beatsPerBar: beatsPerBar || 4, trackNames, notes}
}

function makeNote(started: {tick: number, velocity: number, state: ChannelState}, end: number, pitch: number, channel: number, track: number): MidiNote {
    const {state} = started
    const loudness = (state.volume / 127) * (state.expression / 127)

    return {
        tick: started.tick,
        duration: Math.max(0, end - started.tick),
        pitch,
        velocity: Math.max(1, started.velocity * loudness),
        pan: Math.max(-1, Math.min(1, (state.pan - 64) / 63)),
        channel,
        track,
        program: state.program,
    }
}
