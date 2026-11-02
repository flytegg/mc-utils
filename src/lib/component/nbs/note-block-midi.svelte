<script lang="ts">
    import {createEventDispatcher} from "svelte"
    import type {MidiFile} from "$lib/nbs/midi-file"
    import {defaultSettings, getParts, type ConvertResult, type ConvertSettings} from "$lib/nbs/midi-to-nbs"
    import NoteBlockMidiSettings from "$lib/component/nbs/note-block-midi-settings.svelte"

    export let midi: MidiFile
    export let name: string

    // The settings go along with the song, so they can be changed again from the visualiser while it plays
    const dispatch = createEventDispatcher<{
        convert: {name: string, data: ArrayBuffer, settings: ConvertSettings}
        back: void
    }>()

    let settings: ConvertSettings = defaultSettings(getParts(midi))
    let result = null as ConvertResult | null

    const convert = () => {
        if (result) dispatch("convert", {name: `${name}.nbs`, data: result.data, settings})
    }
</script>

<div class="flex items-center gap-2 pr-8">
    <button class="flex shrink-0 justify-center items-center h-8 w-8 -ml-2 rounded-full fill-white/60 transition-colors hover:bg-white/10 hover:fill-white" aria-label="Back" on:click={() => dispatch("back")}>
        <svg class="h-3.5" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
    </button>
    <div class="min-w-0">
        <h2 id="upload-title" class="text-lg font-semibold">Convert MIDI</h2>
        <p class="truncate text-sm text-white/50" title={name}>{name}</p>
    </div>
</div>

<div class="mt-5">
    <NoteBlockMidiSettings {midi} {name} bind:settings bind:result/>
</div>

<p class="mt-4 text-xs text-white/40">You can change these again while the song plays, from the settings button in the visualiser.</p>

<button class="button w-full mt-3 py-2" disabled={!result} on:click={convert}>
    Convert and play
</button>

<style>
    .button:disabled {
        @apply opacity-40 cursor-not-allowed;
    }
</style>
