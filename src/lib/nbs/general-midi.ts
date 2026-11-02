// General MIDI program names, and the note block instrument each one sounds most like

// NBS instrument IDs, named for readability
const harp = 0, bass = 1, bassDrum = 2, snare = 3, click = 4, guitar = 5, flute = 6, bell = 7, chime = 8
const xylophone = 9, ironXylophone = 10, cowBell = 11, didgeridoo = 12, bit = 13, banjo = 14, pling = 15

// [name, instrument], in program order
const programs: [string, number][] = [
    // Piano
    ["Acoustic Grand Piano", harp], ["Bright Acoustic Piano", harp], ["Electric Grand Piano", harp], ["Honky-tonk Piano", harp],
    ["Electric Piano 1", pling], ["Electric Piano 2", pling], ["Harpsichord", harp], ["Clavinet", harp],
    // Chromatic percussion
    ["Celesta", bell], ["Glockenspiel", bell], ["Music Box", bell], ["Vibraphone", ironXylophone],
    ["Marimba", xylophone], ["Xylophone", xylophone], ["Tubular Bells", chime], ["Dulcimer", harp],
    // Organ
    ["Drawbar Organ", harp], ["Percussive Organ", harp], ["Rock Organ", harp], ["Church Organ", harp],
    ["Reed Organ", flute], ["Accordion", flute], ["Harmonica", flute], ["Tango Accordion", flute],
    // Guitar
    ["Nylon Guitar", guitar], ["Steel Guitar", guitar], ["Jazz Guitar", guitar], ["Clean Guitar", guitar],
    ["Muted Guitar", guitar], ["Overdriven Guitar", guitar], ["Distortion Guitar", guitar], ["Guitar Harmonics", guitar],
    // Bass
    ["Acoustic Bass", bass], ["Fingered Bass", bass], ["Picked Bass", bass], ["Fretless Bass", bass],
    ["Slap Bass 1", bass], ["Slap Bass 2", bass], ["Synth Bass 1", bass], ["Synth Bass 2", bass],
    // Strings
    ["Violin", flute], ["Viola", flute], ["Cello", guitar], ["Contrabass", bass],
    ["Tremolo Strings", flute], ["Pizzicato Strings", harp], ["Orchestral Harp", harp], ["Timpani", bassDrum],
    // Ensemble
    ["String Ensemble 1", harp], ["String Ensemble 2", harp], ["Synth Strings 1", pling], ["Synth Strings 2", pling],
    ["Choir Aahs", flute], ["Voice Oohs", flute], ["Synth Voice", flute], ["Orchestra Hit", harp],
    // Brass
    ["Trumpet", bit], ["Trombone", didgeridoo], ["Tuba", didgeridoo], ["Muted Trumpet", bit],
    ["French Horn", didgeridoo], ["Brass Section", bit], ["Synth Brass 1", bit], ["Synth Brass 2", bit],
    // Reed
    ["Soprano Sax", flute], ["Alto Sax", flute], ["Tenor Sax", flute], ["Baritone Sax", didgeridoo],
    ["Oboe", flute], ["English Horn", flute], ["Bassoon", didgeridoo], ["Clarinet", flute],
    // Pipe
    ["Piccolo", flute], ["Flute", flute], ["Recorder", flute], ["Pan Flute", flute],
    ["Blown Bottle", flute], ["Shakuhachi", flute], ["Whistle", flute], ["Ocarina", flute],
    // Synth lead
    ["Square Lead", bit], ["Saw Lead", bit], ["Calliope Lead", flute], ["Chiff Lead", flute],
    ["Charang Lead", guitar], ["Voice Lead", flute], ["Fifths Lead", bit], ["Bass + Lead", bit],
    // Synth pad
    ["New Age Pad", pling], ["Warm Pad", pling], ["Polysynth Pad", pling], ["Choir Pad", pling],
    ["Bowed Pad", pling], ["Metallic Pad", pling], ["Halo Pad", pling], ["Sweep Pad", pling],
    // Synth effects
    ["Rain", pling], ["Soundtrack", pling], ["Crystal", chime], ["Atmosphere", pling],
    ["Brightness", pling], ["Goblins", pling], ["Echoes", pling], ["Sci-fi", pling],
    // Ethnic
    ["Sitar", banjo], ["Banjo", banjo], ["Shamisen", banjo], ["Koto", banjo],
    ["Kalimba", bell], ["Bagpipe", flute], ["Fiddle", flute], ["Shanai", flute],
    // Percussive
    ["Tinkle Bell", bell], ["Agogo", cowBell], ["Steel Drums", ironXylophone], ["Woodblock", click],
    ["Taiko Drum", bassDrum], ["Melodic Tom", bassDrum], ["Synth Drum", bassDrum], ["Reverse Cymbal", snare],
    // Sound effects
    ["Guitar Fret Noise", click], ["Breath Noise", snare], ["Seashore", snare], ["Bird Tweet", flute],
    ["Telephone Ring", bell], ["Helicopter", snare], ["Applause", snare], ["Gunshot", snare],
]

export const programName = (program: number) => programs[program]?.[0] ?? "Unknown Instrument"

export const programInstrument = (program: number) => programs[program]?.[1] ?? harp

// Pianos are what the melody, harmony and bass split works best on
export const isPiano = (program: number) => program < 8

// General MIDI drum sounds (by note number) as a note block instrument and key
export function drumSound(pitch: number): {instrument: number, key: number} {
    if (pitch === 35 || pitch === 36) return {instrument: bassDrum, key: 33}
    if (pitch === 38 || pitch === 40) return {instrument: snare, key: 45}
    if (pitch === 39) return {instrument: snare, key: 50}
    if (pitch === 37) return {instrument: click, key: 45}
    // Toms, from floor to high, step up in pitch
    if ([41, 43, 45, 47, 48, 50].includes(pitch)) return {instrument: bassDrum, key: 36 + (pitch - 41) * 2}
    if (pitch === 42 || pitch === 44) return {instrument: click, key: 55}
    if (pitch === 46) return {instrument: click, key: 50}
    // Crashes, rides and other cymbals
    if ([49, 51, 52, 53, 55, 57, 59].includes(pitch)) return {instrument: snare, key: 57}
    if (pitch === 56) return {instrument: cowBell, key: 45}
    return {instrument: click, key: 45}
}
