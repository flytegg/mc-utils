import {Song, toArrayBuffer} from "@nbsjs/core"
import {instruments, minecraftHigh, minecraftLow} from "./nbs-instruments"
import {drumChannel, type MidiFile, type MidiNote} from "./midi-file"
import {drumSound, isPiano, programInstrument, programName} from "./general-midi"

// A group of notes from the MIDI that share a track and instrument
export type MidiPart = {
    id: string
    name: string
    drums: boolean
    notes: MidiNote[]
}

export type ConvertSettings = {
    // Split everything into melody, harmony and bass, or give each part its own instrument
    arrangement: "split" | "tracks"
    // Which parts are used, and the instrument each one plays when keeping tracks
    parts: Record<string, {include: boolean, instrument: number}>
    melody: number
    harmony: number
    bass: number
    // Most notes kept under the melody at once when splitting
    harmonyNotes: number
    // Notes outside the two octaves a note block can play move to a higher or lower instrument at the same pitch
    swap: boolean
    // Songs are made for Note Block Studio and resource packs, so keep every note's real pitch and the exact tempo.
    // Vanilla Minecraft instead needs notes no instrument can play moved by octaves, and a tempo that divides into 20 ticks a second
    vanilla: boolean
    // NBS ticks per beat: 4 for 16ths, 8 for 32nds, 3 or 6 for triplets
    grid: "auto" | 3 | 4 | 6 | 8
}

export type ConvertStats = {
    noteBlocks: number
    layers: number
    ticksPerSecond: number
    bpm: number
    // How much faster (above 1) or slower the song plays, when its tempo is rounded for vanilla Minecraft
    speed: number
    grid: number
    timingFixed: boolean
    // Notes left out when thinning chords or merging duplicates
    dropped: number
    // Notes played on another instrument to keep their pitch, phrases moved by octaves,
    // single notes folded into range, and notes left outside it
    swapped: number
    shifted: number
    folded: number
    outOfRange: number
}

// A converted song's MIDI and settings, kept so the song can be converted again with other settings
export type MidiSource = {
    midi: MidiFile
    name: string
    settings: ConvertSettings
}

export type ConvertResult = {
    data: ArrayBuffer
    stats: ConvertStats
}

// Melody notes from middle C up, and bass from D3 down, which is about where the Bass instrument runs out.
// Anything between is harmony, so the bass doesn't wander up onto other instruments
const melodyLowest = 60
const bassHighest = 50
// Harmony is chosen from around E4, which sits nicely between the melody and bass
const harmonyCentre = 64
const harmonyVolume = 0.5
const bassVolume = 0.8

// Grids tried by auto, coarsest first, and how many notes may miss one before a finer grid is used
const autoGrids = [4, 3, 6, 8] as const
const offGridAllowance = 0.005

// Tempos (ticks per second) Minecraft can play exactly
const minecraftTempos = [20, 10, 20 / 3, 5, 4, 20 / 6, 20 / 7, 2.5]

// The instruments a note can move to when it sits too low or high for its own, keeping its pitch
const neighbours: Record<number, {low?: number, high?: number}> = {
    0: {low: 1, high: 7},
    1: {high: 0},
    5: {low: 1, high: 0},
    6: {low: 0, high: 8},
    7: {low: 0},
    8: {low: 6},
    9: {low: 10},
    10: {low: 1, high: 9},
    11: {low: 0, high: 7},
    12: {high: 0},
    13: {low: 1, high: 7},
    14: {low: 5, high: 7},
    15: {low: 1, high: 7},
}

export function getParts(midi: MidiFile): MidiPart[] {
    const parts = new Map<string, MidiPart>()

    for (const note of midi.notes) {
        const drums = note.channel === drumChannel
        const id = drums ? `drums:${note.track}` : `${note.track}:${note.channel}:${note.program}`

        if (!parts.has(id)) {
            const track = midi.trackNames[note.track]
            const instrument = drums ? "Drums" : programName(note.program)
            // Track names are often just "Track 1", so the instrument is shown too when they differ
            const name = track && track.toLowerCase() !== instrument.toLowerCase() ? `${track} (${instrument})` : instrument
            parts.set(id, {id, name, drums, notes: []})
        }

        parts.get(id)!.notes.push(note)
    }

    return [...parts.values()]
}

export function defaultSettings(parts: MidiPart[]): ConvertSettings {
    const pitched = parts.filter(part => !part.drums)

    return {
        // Piano-only songs (often one track per hand) are what the split was made for
        arrangement: pitched.every(part => isPiano(part.notes[0].program)) ? "split" : "tracks",
        parts: Object.fromEntries(parts.map(part => [part.id, {
            include: true,
            instrument: part.drums ? 2 : programInstrument(part.notes[0].program),
        }])),
        melody: 0,
        harmony: 0,
        bass: 1,
        harmonyNotes: 3,
        swap: true,
        vanilla: false,
        grid: "auto",
    }
}

type Timing = {
    grid: number
    scale: number
    offset: number
    fixed: boolean
}

type VoiceNote = {
    tick: number
    pitch: number
    // 0 to 1, before the song is scaled so its loudest note is full volume
    volume: number
    pan: number
}

type Voice = {
    name: string
    instrument: number
    notes: VoiceNote[]
}

type PlacedNote = {
    tick: number
    instrument: number
    key: number
    volume: number
    pan: number
}

// Keeps the slower steps (finding the grid and fitting the timing) between changes to the other settings
export function createConverter(midi: MidiFile, parts: MidiPart[]) {
    const timingCache = new Map<string, Timing>()

    const getTiming = (notes: MidiNote[], settings: ConvertSettings) => {
        const key = `${settings.grid}:${notes.length}`
        if (!timingCache.has(key)) timingCache.set(key, findTiming(midi, notes, settings.grid))
        return timingCache.get(key)!
    }

    return (settings: ConvertSettings, name: string): ConvertResult | null => {
        const used = parts.filter(part => settings.parts[part.id]?.include)
        const notes = used.flatMap(part => part.notes)
        if (!notes.length) return null

        const timing = getTiming(notes, settings)
        const step = midi.ticksPerBeat / timing.grid
        const toTick = (tick: number) => Math.max(0, Math.round((tick * timing.scale + timing.offset) / step))

        const stats: ConvertStats = {
            noteBlocks: 0, layers: 0, ticksPerSecond: 0, bpm: 0, grid: timing.grid,
            speed: 1, timingFixed: timing.fixed, dropped: 0, swapped: 0, shifted: 0, folded: 0, outOfRange: 0,
        }

        const pitched = used.filter(part => !part.drums)
        const voices = settings.arrangement === "split"
            ? splitVoices(pitched.flatMap(part => part.notes), toTick, settings, stats)
            : pitched.map(part => ({
                name: part.name,
                instrument: settings.parts[part.id].instrument,
                notes: dedupe(part.notes.map(note => toVoiceNote(note, toTick)), stats),
            }))

        // A phrase ends after a rest of a beat and a half, or after four bars at most
        const phraseGap = timing.grid * 1.5
        const phraseLength = timing.grid * midi.beatsPerBar * 4

        const placedVoices = voices.map(voice => ({
            name: voice.name,
            notes: placeVoice(voice, settings, phraseGap, phraseLength, stats),
        }))

        for (const part of used.filter(part => part.drums)) {
            placedVoices.push(...drumVoices(part, toTick))
        }

        // Scaled so the loudest note is full volume, as many MIDIs are recorded quietly
        let loudest = 0
        for (const voice of placedVoices) for (const note of voice.notes) loudest = Math.max(loudest, note.volume)

        const song = new Song()
        song.name = name
        song.description = "Converted from MIDI"
        song.importName = name
        song.timeSignature = midi.beatsPerBar

        const bpm = getMainBpm(midi, notes) * timing.scale
        const exact = bpm / 60 * timing.grid
        const ticksPerSecond = settings.vanilla
            ? minecraftTempos.reduce((best, tempo) => Math.abs(Math.log(tempo / exact)) < Math.abs(Math.log(best / exact)) ? tempo : best)
            : exact
        song.setTempo(Math.round(ticksPerSecond * 100) / 100)
        stats.ticksPerSecond = song.getTempo()
        stats.bpm = bpm
        stats.speed = ticksPerSecond / exact

        // The same note block twice on one tick would only play once, so later copies are dropped
        const taken = new Set<string>()

        for (const voice of placedVoices) {
            const byTick = new Map<number, PlacedNote[]>()
            for (const note of voice.notes) {
                const id = `${note.tick}:${note.instrument}:${note.key}`
                if (taken.has(id)) {
                    stats.dropped++
                    continue
                }

                taken.add(id)
                if (!byTick.has(note.tick)) byTick.set(note.tick, [])
                byTick.get(note.tick)!.push(note)
            }

            // Highest note on the voice's first layer, so a melody always stays on one layer.
            // Sorted by the pitch it sounds at, as a Bass note sounds two octaves below a Harp note on the same key
            const sounding = (note: PlacedNote) => note.key + (instruments[note.instrument].octave ?? 0) * 12
            const layers: ReturnType<typeof song.layers.create>[] = []
            for (const [tick, chord] of byTick) {
                chord.sort((a, b) => sounding(b) - sounding(a))
                chord.forEach((note, i) => {
                    if (!layers[i]) {
                        layers[i] = song.layers.create()
                        layers[i].name = i ? `${voice.name} ${i + 1}` : voice.name
                    }

                    layers[i].notes.create(tick, note.instrument, {
                        key: note.key,
                        velocity: Math.max(1, Math.round(note.volume / loudest * 100)),
                        // NBS pans the other way to MIDI, with -100 on the right
                        panning: Math.round(-note.pan * 100),
                    })
                    stats.noteBlocks++
                })
            }
        }

        stats.layers = song.layers.getTotal()
        if (!stats.noteBlocks) return null

        return {data: toArrayBuffer(song).slice(0) as ArrayBuffer, stats}
    }
}

const toVoiceNote = (note: MidiNote, toTick: (tick: number) => number): VoiceNote =>
    ({tick: toTick(note.tick), pitch: note.pitch, volume: note.velocity / 127, pan: note.pan})

// Notes that land on the same tick and pitch merge into the loudest of them
function dedupe(notes: VoiceNote[], stats: ConvertStats) {
    const merged = new Map<string, VoiceNote>()

    for (const note of notes) {
        const id = `${note.tick}:${note.pitch}`
        const existing = merged.get(id)
        if (existing) stats.dropped++
        if (!existing || note.volume > existing.volume) merged.set(id, note)
    }

    return [...merged.values()].sort((a, b) => a.tick - b.tick)
}

// Each moment becomes a melody (its top note), a bass (its lowest) and a few softer harmony notes in between
function splitVoices(notes: MidiNote[], toTick: (tick: number) => number, settings: ConvertSettings, stats: ConvertStats): Voice[] {
    const melody: Voice = {name: "Melody", instrument: settings.melody, notes: []}
    const harmony: Voice = {name: "Harmony", instrument: settings.harmony, notes: []}
    const bass: Voice = {name: "Bass", instrument: settings.bass, notes: []}

    const moments = new Map<number, VoiceNote[]>()
    for (const note of dedupe(notes.map(note => toVoiceNote(note, toTick)), stats)) {
        if (!moments.has(note.tick)) moments.set(note.tick, [])
        moments.get(note.tick)!.push(note)
    }

    for (const chord of moments.values()) {
        chord.sort((a, b) => a.pitch - b.pitch)
        const rest = [...chord]

        const top = rest[rest.length - 1]
        const lead = top.pitch >= melodyLowest ? rest.pop()! : null
        if (lead) melody.notes.push(lead)

        if (rest.length && rest[0].pitch <= bassHighest) {
            const low = rest.shift()!
            bass.notes.push({...low, volume: low.volume * bassVolume})
        }

        // Octave copies of the melody and repeated pitch classes add little, so the most central of the rest are kept
        const seen = new Set(lead ? [lead.pitch % 12] : [])
        const kept = rest
            .sort((a, b) => Math.abs(a.pitch - harmonyCentre) - Math.abs(b.pitch - harmonyCentre))
            .filter(note => !seen.has(note.pitch % 12) && seen.add(note.pitch % 12))
            .slice(0, settings.harmonyNotes)

        stats.dropped += rest.length - kept.length
        for (const note of kept) harmony.notes.push({...note, volume: note.volume * harmonyVolume})
    }

    return [melody, harmony, bass].filter(voice => voice.notes.length)
}

// Fits a voice into note block range. Notes keep their real pitch on a neighbouring instrument where they can,
// and anything left is moved a phrase at a time, so a run of notes moves together rather than jumping about
function placeVoice(voice: Voice, settings: ConvertSettings, phraseGap: number, phraseLength: number, stats: ConvertStats): PlacedNote[] {
    const notes = [...voice.notes].sort((a, b) => a.tick - b.tick)
    const own = voice.instrument
    const ownOctave = instruments[own].octave ?? 0
    const fold = settings.vanilla
    // NBS keys count from A0, which is MIDI note 21
    const written = (note: VoiceNote, instrument: number, shift: number) => note.pitch - 21 + shift * 12 - (instruments[instrument].octave ?? 0) * 12
    const inRange = (key: number) => key >= minecraftLow && key <= minecraftHigh
    // How far a key is outside the range, for picking the closest instrument when none fit
    const distance = (key: number) => Math.max(0, minecraftLow - key, key - minecraftHigh)

    // Bright instruments a note moves up to (like harp to bell) cut through more, so are played a little softer
    const place = (note: VoiceNote, instrument: number, key: number): PlacedNote => ({
        tick: note.tick,
        instrument,
        key: Math.min(87, Math.max(0, key)),
        volume: note.volume * ((instruments[instrument].octave ?? 0) > ownOctave ? 0.8 : 1),
        pan: note.pan,
    })

    if (instruments[own].octave === undefined || (!settings.swap && !fold)) {
        for (const note of notes) if (!inRange(written(note, own, 0))) stats.outOfRange++
        return notes.map(note => place(note, own, written(note, own, 0)))
    }

    // The voice's own instrument and the ones either side of it, own first so it's kept whenever it fits
    const family = settings.swap
        ? [own, neighbours[own]?.low, neighbours[own]?.high].filter((option): option is number => option !== undefined)
        : [own]
    const fitsFamily = (note: VoiceNote, shift: number) => family.some(instrument => inRange(written(note, instrument, shift)))

    const phrases: VoiceNote[][] = []
    let phrase: VoiceNote[] = []
    for (const note of notes) {
        const previous = phrase[phrase.length - 1]
        if (previous && (note.tick - previous.tick > phraseGap || note.tick - phrase[0].tick > phraseLength) && note.tick !== previous.tick) {
            phrases.push(phrase)
            phrase = []
        }
        phrase.push(note)
    }
    if (phrase.length) phrases.push(phrase)

    const placed: PlacedNote[] = []

    for (const phrase of phrases) {
        // When folding, a phrase that mostly can't be played at its real pitch moves by whole octaves together.
        // Scored by the share of notes that fit, with a cost per octave, so it only moves when most of it is out of range
        let shift = 0
        if (fold) {
            let best = -Infinity
            for (let option = -3; option <= 3; option++) {
                const score = phrase.filter(note => fitsFamily(note, option)).length / phrase.length - Math.abs(option) * 0.3
                if (score > best) {
                    best = score
                    shift = option
                }
            }
            if (shift) stats.shifted++
        }

        for (const note of phrase) {
            // Own instrument if it fits, otherwise whichever neighbour plays it at this pitch
            const fitting = family.find(instrument => inRange(written(note, instrument, shift)))
            if (fitting !== undefined) {
                if (fitting !== own) stats.swapped++
                placed.push(place(note, fitting, written(note, fitting, shift)))
                continue
            }

            // Nothing plays it, so it's folded in by octaves on its own, or left on the closest instrument
            const closest = family.reduce((best, instrument) =>
                distance(written(note, instrument, shift)) < distance(written(note, best, shift)) ? instrument : best)
            let key = written(note, closest, shift)

            if (fold) {
                stats.folded++
                while (key < minecraftLow) key += 12
                while (key > minecraftHigh) key -= 12
            } else {
                stats.outOfRange++
            }

            if (closest !== own) stats.swapped++
            placed.push(place(note, closest, key))
        }
    }

    return placed
}

// One voice per drum sound, so kicks, snares and hi-hats each get their own layers
function drumVoices(part: MidiPart, toTick: (tick: number) => number) {
    const names = new Map([[2, "Kick"], [3, "Snare"], [4, "Hi-hat"], [11, "Cow Bell"]])
    const voices = new Map<number, {name: string, notes: PlacedNote[]}>()

    for (const note of part.notes) {
        const {instrument, key} = drumSound(note.pitch)
        if (!voices.has(instrument)) voices.set(instrument, {name: names.get(instrument) ?? "Drums", notes: []})
        voices.get(instrument)!.notes.push({tick: toTick(note.tick), instrument, key, volume: note.velocity / 127, pan: note.pan})
    }

    return [...voices.values()]
}

// The tempo used for the longest stretch of the song, as NBS songs only have one
function getMainBpm(midi: MidiFile, notes: MidiNote[]) {
    const end = notes.reduce((end, note) => Math.max(end, note.tick + note.duration), 0)
    const tempos = midi.tempos.length ? midi.tempos : [{tick: 0, tempo: 500000}]
    const lengths = new Map<number, number>()

    tempos.forEach((tempo, i) => {
        const start = i === 0 ? 0 : tempo.tick
        const stop = Math.min(end, tempos[i + 1]?.tick ?? end)
        if (stop > start) lengths.set(tempo.tempo, (lengths.get(tempo.tempo) ?? 0) + stop - start)
    })

    const main = [...lengths].sort((a, b) => b[1] - a[1])[0]?.[0] ?? tempos[0].tempo
    return 60e6 / main
}

// How far onsets sit from a grid, in grid steps from 0 to 0.5
function gridError(onsets: number[], step: number, scale = 1, offset = 0) {
    let total = 0
    for (const tick of onsets) {
        const position = (tick * scale + offset) / step
        total += Math.abs(position - Math.round(position))
    }
    return total / onsets.length
}

// Finds the grid, then lines up loosely played (live recorded) songs with it.
// The fix is only kept when it clearly helps, so it's always tried rather than being a setting
function findTiming(midi: MidiFile, notes: MidiNote[], chosenGrid: ConvertSettings["grid"]): Timing {
    // Every note's start counts once, sampled evenly on long songs to keep this quick
    const unique = [...new Set(notes.map(note => note.tick))].sort((a, b) => a - b)
    const every = Math.max(1, Math.floor(unique.length / 3000))
    const onsets = unique.filter((_, i) => i % every === 0)

    const offGrid = (grid: number) => {
        const step = midi.ticksPerBeat / grid
        return onsets.filter(tick => {
            const position = tick / step
            return Math.abs(position - Math.round(position)) > 0.1
        }).length / onsets.length
    }

    let grid: number
    if (chosenGrid !== "auto") {
        grid = chosenGrid
    } else {
        // The coarsest grid nearly everything fits. Live-played songs fit none well,
        // and are better lined up on 16ths than squeezed onto 32nds
        grid = autoGrids.find(grid => offGrid(grid) <= offGridAllowance) ?? 4
    }

    const step = midi.ticksPerBeat / grid
    const unfixed = {grid, scale: 1, offset: 0, fixed: false}

    // A tiny stretch and shift that pulls the notes onto the grid, for songs recorded without a click track.
    // Searched coarse to fine, as the error has many small dips
    const original = gridError(onsets, step)
    let best = {scale: 1, offset: 0, error: original}

    const search = (scales: number[]) => {
        const centre = best
        for (const scale of scales) {
            for (let i = -10; i <= 10; i++) {
                const offset = centre.offset + i * step / 20
                const error = gridError(onsets, step, scale, offset)
                if (error < best.error) best = {scale, offset, error}
            }
        }
    }

    search(Array.from({length: 81}, (_, i) => 1 + (i - 40) * 0.0001))
    search(Array.from({length: 21}, (_, i) => best.scale + (i - 10) * 0.00001))

    // Only used when it clearly helps, so songs that are already on the grid are left alone
    return best.error < original * 0.75 ? {grid, scale: best.scale, offset: best.offset, fixed: true} : unfixed
}
