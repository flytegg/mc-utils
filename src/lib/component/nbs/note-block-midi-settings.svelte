<script lang="ts">
    import {createEventDispatcher} from "svelte"
    import type {MidiFile} from "$lib/nbs/midi-file"
    import {createConverter, getParts, type ConvertResult, type ConvertSettings} from "$lib/nbs/midi-to-nbs"
    import {instruments} from "$lib/nbs/nbs-instruments"

    // The conversion settings form, used when a MIDI is first uploaded and again from the visualiser to tweak it while it plays
    export let midi: MidiFile
    export let name: string
    export let settings: ConvertSettings
    // The song as converted with the current settings, for whoever shows the form to use
    export let result: ConvertResult | null = null

    // Fired for every change after the form first appears, with the newly converted song
    const dispatch = createEventDispatcher<{change: ConvertResult}>()

    const parts = getParts(midi)
    const convert = createConverter(midi, parts)

    const pitchedInstruments = instruments.map((instrument, id) => ({...instrument, id})).filter(instrument => instrument.octave !== undefined)

    const grids = [
        {value: "auto", label: "Auto"},
        {value: 4, label: "16th notes"},
        {value: 8, label: "32nd notes (fast runs)"},
        {value: 3, label: "Triplet 8ths"},
        {value: 6, label: "Triplet 16ths"},
    ] as const

    const gridNames: Record<number, string> = {3: "triplet 8ths", 4: "16ths", 6: "triplet 16ths", 8: "32nds"}

    // Converting takes a few milliseconds, so the summary is kept up to date as settings change
    $: result = convert(settings, name)

    // The song is converted again whenever the settings come back from whoever shows the form,
    // so a change is only passed on when the settings themselves are different from the last ones used
    let appliedSettings = JSON.stringify(settings)
    $: if (result) changed(result, settings)

    const changed = (result: ConvertResult, settings: ConvertSettings) => {
        const current = JSON.stringify(settings)
        if (current === appliedSettings) return

        appliedSettings = current
        dispatch("change", result)
    }
    $: stats = result?.stats
    $: moved = stats ? stats.folded + stats.shifted : 0
    // Rounding the tempo for vanilla Minecraft can speed a song up or slow it down, so it's called out
    $: speedChange = stats ? Math.round((stats.speed - 1) * 100) : 0

    const format = (value: number) => value.toLocaleString()
</script>

<div class="flex flex-col gap-5">
    <section>
        <h3 class="heading">Arrangement</h3>
        <div class="segmented">
            <button class:active={settings.arrangement === "split"} on:click={() => settings.arrangement = "split"}>Melody, harmony & bass</button>
            <button class:active={settings.arrangement === "tracks"} on:click={() => settings.arrangement = "tracks"}>Keep each track</button>
        </div>
        <p class="hint">
            {#if settings.arrangement === "split"}
                Best for piano. The top note becomes the melody, the lowest the bass, and a few softer notes in between fill out the chords.
            {:else}
                Best for songs with separate instruments. Each part plays on the note block instrument you pick.
            {/if}
        </p>

        {#if settings.arrangement === "split"}
            <div class="grid grid-cols-3 gap-2 mt-3">
                <label class="field">
                    <span>Melody</span>
                    <select bind:value={settings.melody}>
                        {#each pitchedInstruments as instrument}<option value={instrument.id}>{instrument.name}</option>{/each}
                    </select>
                </label>
                <label class="field">
                    <span>Harmony</span>
                    <select bind:value={settings.harmony}>
                        {#each pitchedInstruments as instrument}<option value={instrument.id}>{instrument.name}</option>{/each}
                    </select>
                </label>
                <label class="field">
                    <span>Bass</span>
                    <select bind:value={settings.bass}>
                        {#each pitchedInstruments as instrument}<option value={instrument.id}>{instrument.name}</option>{/each}
                    </select>
                </label>
            </div>
        {/if}
    </section>

    <!-- A single part would only ever be ticked, so the list is only shown when there's a choice to make -->
    {#if parts.length > 1}
    <section>
        <h3 class="heading">Parts</h3>
        <div class="flex flex-col divide-y divide-white/5 rounded-xl border border-white/10 bg-black/20">
            {#each parts as part (part.id)}
                <div class="flex items-center gap-3 px-3 py-2">
                    <input type="checkbox" class="accent-cyan-400" aria-label="Include {part.name}" bind:checked={settings.parts[part.id].include}>
                    <div class="flex-1 min-w-0" class:opacity-40={!settings.parts[part.id].include}>
                        <p class="truncate text-sm text-white/90" title={part.name}>{part.name}</p>
                        <p class="text-xs text-white/40">{format(part.notes.length)} notes</p>
                    </div>
                    {#if part.drums}
                        <span class="text-xs text-white/40" class:opacity-40={!settings.parts[part.id].include}>Bass drum, snare & click</span>
                    {:else if settings.arrangement === "tracks"}
                        <select class="w-28 sm:w-36" bind:value={settings.parts[part.id].instrument} disabled={!settings.parts[part.id].include} aria-label="Instrument for {part.name}">
                            {#each pitchedInstruments as instrument}<option value={instrument.id}>{instrument.name}</option>{/each}
                        </select>
                    {/if}
                </div>
            {/each}
        </div>
    </section>
    {/if}

    <!-- Settings the defaults already get right for most songs -->
    <details class="group">
        <summary class="flex items-center gap-1.5 w-fit text-sm text-white/60 cursor-pointer select-none transition-colors hover:text-white">
            <svg class="h-2.5 fill-current transition-transform group-open:rotate-90" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
            More options
        </summary>

        <div class="mt-4 flex flex-col gap-4">
            <div>
                <label class="check">
                    <input type="checkbox" class="accent-cyan-400" bind:checked={settings.swap}>
                    Switch instruments to keep the pitch
                </label>
                <p class="hint">Note blocks only play two octaves, so a high note can move from Harp to Bell, or a low one to Bass, and still sound right.</p>
            </div>

            <div>
                <label class="check">
                    <input type="checkbox" class="accent-cyan-400" bind:checked={settings.vanilla}>
                    Make it playable in vanilla Minecraft
                </label>
                <p class="hint">Note Block Studio and resource packs play any pitch and tempo. Without them, notes no instrument can reach are moved by octaves, and the tempo is rounded to 20, 10, 6.67 or 5 ticks a second.</p>
            </div>

            <div class="grid gap-2" class:grid-cols-2={settings.arrangement === "split"}>
                <label class="field">
                    <span>Timing grid</span>
                    <select bind:value={settings.grid}>
                        {#each grids as grid}
                            <option value={grid.value}>{grid.value === "auto" && stats ? `Auto (${gridNames[stats.grid]})` : grid.label}</option>
                        {/each}
                    </select>
                </label>
                {#if settings.arrangement === "split"}
                    <label class="field">
                        <span>Harmony notes</span>
                        <select bind:value={settings.harmonyNotes}>
                            <option value={0}>None</option>
                            <option value={1}>1 at a time</option>
                            <option value={2}>2 at a time</option>
                            <option value={3}>3 at a time</option>
                        </select>
                    </label>
                {/if}
            </div>
        </div>
    </details>

    <div class="rounded-xl bg-white/5 px-4 py-3 text-sm">
        {#if stats}
            <p class="text-white/90">{format(stats.noteBlocks)} note blocks on {stats.layers} {stats.layers === 1 ? "layer" : "layers"}</p>
            <p class="mt-0.5 text-xs text-white/50">
                {Math.round(stats.bpm)} BPM, {stats.ticksPerSecond} ticks a second on {gridNames[stats.grid]}{stats.timingFixed ? ", timing fixed" : ""}
                {#if speedChange}· plays {Math.abs(speedChange)}% {speedChange > 0 ? "faster" : "slower"}{/if}
                {#if stats.dropped}· {format(stats.dropped)} notes thinned out{/if}
                {#if stats.swapped}· {format(stats.swapped)} on another instrument to keep their pitch{/if}
                {#if moved}· {format(moved)} moved by octaves{/if}
            </p>
        {:else}
            <p class="text-white/60">Pick at least one part to convert.</p>
        {/if}
    </div>
</div>

<style>
    .heading {
        @apply mb-2 text-xs font-medium uppercase tracking-wide text-white/50;
    }

    .hint {
        @apply mt-2 text-xs text-white/40;
    }

    .segmented {
        @apply grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1;
    }

    .segmented button {
        @apply rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:text-white;
    }

    .segmented button.active {
        @apply bg-white/10 text-white;
    }

    .field {
        @apply flex flex-col gap-1 text-xs text-white/50;
    }

    .check {
        @apply flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none;
    }

    select {
        @apply rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white outline-none transition-colors focus:border-cyan-400/60 disabled:opacity-40;
    }
</style>
