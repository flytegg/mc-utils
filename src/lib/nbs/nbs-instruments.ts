export type NbsInstrument = {
    name: string
    color: string
    // How far the instrument sounds from harp at the same key, in octaves. The drums have no pitch, so have none
    octave?: number
}

// Indexed by NBS instrument ID, matching the player's sounds
export const instruments: NbsInstrument[] = [
    {name: "Harp", color: "#22d3ee", octave: 0},
    {name: "Bass", color: "#8b5cf6", octave: -2},
    {name: "Bass Drum", color: "#ef4444"},
    {name: "Snare", color: "#f97316"},
    {name: "Click", color: "#facc15"},
    {name: "Guitar", color: "#a3e635", octave: -1},
    {name: "Flute", color: "#10b981", octave: 1},
    {name: "Bell", color: "#f472b6", octave: 2},
    {name: "Chime", color: "#7dd3fc", octave: 2},
    {name: "Xylophone", color: "#e2e8f0", octave: 2},
    {name: "Iron Xylophone", color: "#2dd4bf", octave: 0},
    {name: "Cow Bell", color: "#d97706", octave: 1},
    {name: "Didgeridoo", color: "#e879f9", octave: -2},
    {name: "Bit", color: "#4ade80", octave: 0},
    {name: "Banjo", color: "#fda4af", octave: 0},
    {name: "Pling", color: "#60a5fa", octave: 0},
]

// The two octaves (F#3 to F#5) a note block can play without resource packs
export const minecraftLow = 33
export const minecraftHigh = 57

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// NBS key 0 is A0, the same as a piano
export const keyName = (key: number) => `${noteNames[(key + 9) % 12]}${Math.floor((key + 9) / 12)}`
