<script lang="ts">
    import {onDestroy, onMount} from "svelte"
    import {toast} from "@zerodevx/svelte-toast";
    import {incrementTracker} from "$lib/tracker/tracker";
    import {NbsPlayer} from "$lib/nbs-player";
    import NoteBlockPlayer from "$lib/component/nbs/note-block-player.svelte";
    import NoteBlockVisualiser from "$lib/component/nbs/note-block-visualiser.svelte";
    import type {ScheduledNote} from "$lib/nbs-player";
    let searchResults: Song[]

    type Song = {
        fileName: string,
        downloadUrl: string
    }

    let songs: Song[] = []

    async function fetchFilesFromRepo() {
        const owner = 'flytegg';
        const repo = 'nbs-songs';
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`

        const response = await fetch(apiUrl);
        const filesData = await response.json();

        if (!Array.isArray(filesData)) {
            throw new Error('Invalid response. Expected an array of files.')
        }

        songs = filesData
            .filter(file => file.type === 'file')
            .map(file => ({
                fileName: file.name,
                downloadUrl: file.download_url,
            }))
            .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { sensitivity: 'base' }))
    }

    onMount(fetchFilesFromRepo);

    // Runtimes in seconds by file name, generated with `npm run nbs-durations`
    let durations: Record<string, number> = {}

    onMount(async () => {
        try {
            durations = await fetch('/nbs/durations.json').then(response => response.json())
        } catch (error) {
            console.error(error)
        }
    })

    const formatDuration = (seconds: number) => {
        const total = Math.round(seconds)
        return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`
    }

    const updateSearch = async (query: string) => {
        searchResults = songs.filter(song => song.fileName.toLowerCase().includes(query.toLowerCase()))
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSearch(searchValue)
    }

    const handleInput = () => {
        updateSearch(searchValue)
    }

    function downloadSuccess() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        incrementTracker("note-block-songs-served")
    }

    const player = new NbsPlayer()
    const songCache = new Map<string, ArrayBuffer>()

    let currentSong: Song | null = null
    let artist = ""
    let playing = false
    let loading = false
    let position = 0
    let duration = 0
    let volume = 1
    let frame: number | null = null
    let notes: readonly ScheduledNote[] = []
    let expanded = false

    $: player.setVolume(volume)
    $: visibleSongs = searchResults ? searchResults : songs
    $: currentIndex = currentSong ? visibleSongs.indexOf(currentSong) : -1
    $: hasNext = currentIndex < visibleSongs.length - 1

    player.onEnd = () => {
        playing = false
        position = 0
        stopTracking()
    }

    const track = () => {
        position = player.getPosition()
        frame = requestAnimationFrame(track)
    }

    const startTracking = () => {
        stopTracking()
        track()
    }

    const stopTracking = () => {
        if (frame !== null) cancelAnimationFrame(frame)
        frame = null
    }

    async function playSong(song: Song) {
        player.unlock()

        if (song === currentSong) {
            if (!loading) togglePlaying()
            return
        }

        player.stop()
        stopTracking()
        currentSong = song
        loading = true
        playing = false
        artist = ""
        position = 0
        duration = 0
        notes = []

        try {
            let data = songCache.get(song.downloadUrl)
            if (!data) {
                const response = await fetch(song.downloadUrl)
                if (!response.ok) throw new Error(`Failed to fetch ${song.fileName}`)
                data = await response.arrayBuffer()
                songCache.set(song.downloadUrl, data)
            }
            if (currentSong !== song) return

            const info = await player.load(data)
            if (currentSong !== song) return

            artist = info.author || "Note Block Song"
            duration = player.duration
            notes = player.getNotes()
            loading = false

            await player.play()
            playing = player.playing
            if (playing) startTracking()
        } catch (error) {
            if (currentSong !== song) return

            console.error(error)
            closePlayer()
            toast.push('Could not play this song.', {
                theme: {
                    '--toastColor': 'mintcream',
                    '--toastBackground': 'rgba(187,72,72,0.9)',
                    '--toastBarBackground': '#852F2F'
                }
            })
        }
    }

    async function togglePlaying() {
        player.unlock()

        if (player.playing) {
            player.pause()
            playing = false
            stopTracking()
            position = player.getPosition()
            return
        }

        await player.play()
        playing = player.playing
        if (playing) startTracking()
    }

    function playPrevious() {
        // Like most players, go back to the start unless the song has only just begun
        if (position > 3 || currentIndex <= 0) {
            seek(0)
            return
        }

        playSong(visibleSongs[currentIndex - 1])
    }

    function playNext() {
        if (hasNext) playSong(visibleSongs[currentIndex + 1])
    }

    function seek(seconds: number) {
        player.seek(seconds)
        position = player.getPosition()
    }

    function closePlayer() {
        player.stop()
        stopTracking()
        currentSong = null
        playing = false
        loading = false
        expanded = false
    }

    onDestroy(() => {
        stopTracking()
        player.destroy()
    })
</script>

<div class="flex flex-wrap justify-center items-center gap-3 w-[90%] lg:w-auto">
    <input class="search w-[26rem] max-w-full" bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter song name..." on:keypress={handleKeyPress} on:blur={handleInput}>
    <a aria-label='Download All Songs' href="https://api.github.com/repos/flytegg/nbs-songs/zipball/master" download="https://api.github.com/repos/flytegg/nbs-songs/zipball/master">
        <button class="button flex items-center gap-2 whitespace-nowrap" on:click={downloadSuccess}>
            <svg class="h-4 fill-current" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
            Download All
        </button>
    </a>
</div>

<table class="w-[90%] lg:w-[60%] text-white mt-12">
    <tr class="border-b-[1.5px] border-b-[#232324] text-[#9d9d9e]">
        <th class="rounded-tl-lg rounded-bl-lg p-2 font-medium text-left">
            <p>Title</p>
        </th>
        <th class="p-2 font-medium text-right w-px whitespace-nowrap">
            <p>Duration</p>
        </th>
        <th></th>
    </tr>
    {#each visibleSongs as song}
        <tr class="border-b-[1px] border-b-[#232324] text-[#cecece]">
            <td class="p-2">
                <div class="flex items-center gap-3">
                    <button class="flex shrink-0 justify-center items-center h-6 w-6 rounded-full fill-[#626875] transition-colors hover:fill-white" aria-label={song === currentSong && playing ? 'Pause Song' : 'Play Song'} on:click={() => playSong(song)}>
                        {#if song === currentSong && loading}
                            <div class="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white/90 animate-spin"></div>
                        {:else if song === currentSong && playing}
                            <svg class="h-3.5 fill-white" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
                        {:else}
                            <svg class="h-3.5" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                        {/if}
                    </button>
                    <!-- Some file names have no spaces, so let them wrap anywhere rather than widen the table on phones -->
                    <span class="[overflow-wrap:anywhere]" class:text-white={song === currentSong}>{song.fileName}</span>
                </div>
            </td>
            <td class="p-2 text-center text-sm tabular-nums text-[#9d9d9e] whitespace-nowrap">
                {song.fileName in durations ? formatDuration(durations[song.fileName]) : '—'}
            </td>
            <td class="justify-end">
                <div class="flex justify-end items-center h-full pr-1">
                    <a aria-label='Download Song' download={song.downloadUrl} href="{song.downloadUrl}">
                        <button on:click={downloadSuccess}>
                            <svg class="fill-[#626875] pl-4 h-5" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                        </button>
                    </a>
                </div>
            </td>
        </tr>
    {/each}
</table>

<a class="flex gap-2 mt-10" href="https://github.com/flytegg/nbs-songs" aria-label='GitHub' target="_blank">
    <p class="text-[#cecece] text-md">See the GitHub </p>
    <img src="/icon/new-tab.svg" alt="New Tab Icon" class="justify-center">
</a>

{#if currentSong}
    <!-- Keeps the last rows reachable above the player -->
    <div class="h-32"></div>

    {#if expanded}
        <NoteBlockVisualiser {notes} {position} on:close={() => expanded = false}/>
    {/if}

    <NoteBlockPlayer
        title={currentSong.fileName.replace(/\.nbs$/i, "")}
        {artist}
        {playing}
        {loading}
        {position}
        {duration}
        {hasNext}
        {expanded}
        bind:volume
        on:expand={() => expanded = !expanded}
        on:toggle={togglePlaying}
        on:previous={playPrevious}
        on:next={playNext}
        on:seek={event => seek(event.detail)}
        on:close={closePlayer}
    />
{/if}
