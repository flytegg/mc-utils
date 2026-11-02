<script lang="ts">
    import {createEventDispatcher} from "svelte"
    import {fade, scale} from "svelte/transition"
    import {fromArrayBuffer} from "@nbsjs/core"
    import {parseMidi, type MidiFile} from "$lib/nbs/midi-file"
    import type {ConvertSettings, MidiSource} from "$lib/nbs/midi-to-nbs"
    import NoteBlockMidi from "$lib/component/nbs/note-block-midi.svelte"

    const dispatch = createEventDispatcher<{
        // Converted songs come with their MIDI, so they can be downloaded straight away and converted again
        upload: {name: string, data: ArrayBuffer, source: MidiSource | null}
        close: void
    }>()

    // The largest song in the repo is about 130 KB, so this leaves plenty of room while stopping huge files freezing the page
    const maxSize = 10 * 1024 * 1024

    let input: HTMLInputElement
    let dragging = false
    let dragTimer: ReturnType<typeof setTimeout>
    let checking = false
    let error = ""
    // Set once a MIDI file is read, which swaps the drop zone for the conversion settings
    let midi: {file: MidiFile, name: string} | null = null

    // Files are only ever read here in the browser; nothing is sent to the server
    async function handleFile(file: File | undefined) {
        if (!file || checking) return
        error = ""

        const lowerName = file.name.toLowerCase()
        const isMidi = lowerName.endsWith(".mid") || lowerName.endsWith(".midi")

        if (!lowerName.endsWith(".nbs") && !isMidi) {
            error = "Only .nbs and .mid files can be played."
            return
        }

        if (file.size === 0 || file.size > maxSize) {
            error = file.size === 0 ? "That file is empty." : "That file is too big. Songs are usually under 1 MB."
            return
        }

        checking = true

        try {
            const data = await file.arrayBuffer()

            if (isMidi) {
                const parsed = parseMidi(data)
                if (!parsed.notes.length) throw new Error("MIDI has no notes")
                midi = {file: parsed, name: file.name.replace(/\.midi?$/i, "").trim()}
                return
            }

            // Check it parses and has notes before replacing whatever is playing
            const song = fromArrayBuffer(data)
            let notes = 0
            for (const layer of song.layers) notes += layer.notes.getTotal()
            if (!notes) throw new Error("Song has no notes")

            dispatch("upload", {name: file.name, data, source: null})
        } catch (err) {
            console.error(err)
            error = isMidi ? "That file couldn't be read as a MIDI with notes in it." : "That file couldn't be read as a note block song."
        } finally {
            checking = false
        }
    }

    const handleConverted = (converted: {name: string, data: ArrayBuffer, settings: ConvertSettings}) => {
        if (!midi) return
        dispatch("upload", {
            name: converted.name,
            data: converted.data,
            source: {midi: midi.file, name: midi.name, settings: converted.settings},
        })
    }

    // Moves the popup to <body>, so the layout's stacking (like the z-60 player bar) can't sit on top of it
    const portal = (node: HTMLElement) => {
        document.body.appendChild(node)
        return {destroy: () => node.remove()}
    }

    // dragover fires continuously while a file is held over the popup, so the highlight clears shortly after it stops
    const handleDragOver = (event: DragEvent) => {
        event.preventDefault()
        dragging = true
        clearTimeout(dragTimer)
        dragTimer = setTimeout(() => dragging = false, 150)
    }

    // Dropping anywhere on the popup counts, and stops the browser opening the file itself
    const handleDrop = (event: DragEvent) => {
        event.preventDefault()
        dragging = false
        handleFile(event.dataTransfer?.files[0])
    }
</script>

<svelte:window on:keydown={event => event.key === "Escape" && dispatch("close")}/>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="fixed inset-0 z-[80] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm"
    use:portal
    on:click|self={() => dispatch("close")}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    transition:fade={{duration: 150}}
>
    <!-- Long MIDI settings scroll inside the popup rather than off the screen -->
    <div class="relative w-full max-h-full overflow-y-auto rounded-2xl border border-white/10 bg-[#1c1c1e]/90 backdrop-blur-xl shadow-2xl shadow-black/60 p-6 text-white {midi ? 'max-w-lg' : 'max-w-md'}" role="dialog" aria-modal="true" aria-labelledby="upload-title" transition:scale={{start: 0.95, duration: 150}}>
        <button class="absolute top-4 right-4 flex justify-center items-center h-8 w-8 rounded-full fill-white/60 transition-colors hover:bg-white/10 hover:fill-white" aria-label="Close" on:click={() => dispatch("close")}>
            <svg class="h-3.5" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </button>

        {#if midi}
            <!-- Rebuilt for each file, as the settings are worked out from the song when they first appear -->
            {#key midi}
                <NoteBlockMidi
                    midi={midi.file}
                    name={midi.name}
                    on:back={() => midi = null}
                    on:convert={event => handleConverted(event.detail)}
                />
            {/key}
        {:else}
            <h2 id="upload-title" class="text-lg font-semibold">Play your own song</h2>
            <p class="mt-1 text-sm text-white/60">Got a song from Note Block Studio, or a MIDI to turn into one? Drop it in to hear it here with the visualiser.</p>

            <div class="mt-5 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors {dragging ? 'border-cyan-300 bg-cyan-300/5' : 'border-white/15'}">
                <img class="h-12 w-12 rounded-md [image-rendering:pixelated]" src="/nbs/note_block.png" alt="">
                {#if checking}
                    <p class="text-sm text-white/70">Reading song...</p>
                {:else}
                    <p class="text-sm text-white/80">Drag and drop a <span class="font-semibold">.nbs</span> or <span class="font-semibold">.mid</span> file here</p>
                    <p class="text-xs text-white/40">or</p>
                    <button class="button text-sm py-1.5" on:click={() => input.click()}>Browse files</button>
                {/if}
            </div>

            {#if error}
                <p class="mt-3 text-sm text-[#FF5B5B]" role="alert">{error}</p>
            {/if}

            <p class="mt-4 text-xs text-white/40">Your song is played and converted in your browser and never leaves your device. It isn't saved, so it's gone once you play another song or close the player.</p>
        {/if}

        <input class="hidden" type="file" accept=".nbs,.mid,.midi" bind:this={input} on:change={() => { handleFile(input.files?.[0]); input.value = "" }}>
    </div>
</div>
