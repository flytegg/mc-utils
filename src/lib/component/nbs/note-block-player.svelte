<script lang="ts">
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    export let title: string
    export let artist: string
    export let playing: boolean
    export let loading: boolean
    export let position: number
    export let duration: number
    export let volume: number
    export let hasNext: boolean
    // Sits at the top of the screen while the visualiser is open
    export let expanded = false

    const dispatch = createEventDispatcher<{
        toggle: void
        previous: void
        next: void
        seek: number
        expand: void
        close: void
    }>()

    // Hold the dragged position locally so the song only jumps once the slider is released
    let seeking = false
    let seekValue = 0

    $: shownPosition = seeking ? seekValue : position
    $: progress = duration ? shownPosition / duration * 100 : 0

    const formatTime = (seconds: number) => {
        const total = Math.floor(seconds)
        return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`
    }

    const handleSeekInput = (event: Event) => {
        seeking = true
        seekValue = Number((event.target as HTMLInputElement).value)
    }

    const handleSeekChange = () => {
        dispatch("seek", seekValue)
        seeking = false
    }
</script>

<div class="fixed inset-x-0 z-50 flex justify-center px-4 pointer-events-none {expanded ? 'top-4' : 'bottom-4'}" transition:fly={{y: expanded ? -40 : 40, duration: 250}}>
    <div class="pointer-events-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#1c1c1e]/70 backdrop-blur-xl shadow-2xl shadow-black/60 px-4 pt-3 pb-2.5 text-white">
        <div class="flex items-center gap-3">
            <div class="hidden sm:flex shrink-0 justify-center items-center h-11 w-11 rounded-lg bg-gradient-to-br from-[#3a3a3c] to-[#18181a]">
                <svg class="h-5 fill-white/70" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>
            </div>

            <div class="flex-1 min-w-0">
                <p class="truncate text-sm font-medium text-white/90" title={title}>{title}</p>
                <p class="truncate text-xs text-white/50">{artist}</p>
            </div>

            <div class="flex shrink-0 items-center gap-1">
                <button class="control" aria-label="Previous Song" on:click={() => dispatch("previous")}>
                    <svg class="h-4" viewBox="0 0 320 512"><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/></svg>
                </button>
                <button class="control h-10 w-10" aria-label={playing ? "Pause" : "Play"} on:click={() => dispatch("toggle")} disabled={loading}>
                    {#if loading}
                        <div class="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/90 animate-spin"></div>
                    {:else if playing}
                        <svg class="h-6" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
                    {:else}
                        <svg class="h-6 pl-0.5" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                    {/if}
                </button>
                <button class="control" aria-label="Next Song" on:click={() => dispatch("next")} disabled={!hasNext}>
                    <svg class="h-4" viewBox="0 0 320 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>
                </button>
            </div>

            <div class="hidden sm:flex shrink-0 items-center gap-2 ml-2">
                <svg class="h-3.5 fill-white/50" viewBox="0 0 448 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.4-11.8 33.8-3.5z"/></svg>
                <input class="range w-24" type="range" min="0" max="1" step="0.01" aria-label="Volume" bind:value={volume} style="--fill: {volume * 100}%">
            </div>

            <button class="control shrink-0 ml-1" aria-label={expanded ? "Close Visualiser" : "Open Visualiser"} on:click={() => dispatch("expand")}>
                {#if expanded}
                    <svg class="h-3.5" viewBox="0 0 448 512"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>
                {:else}
                    <svg class="h-3.5" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>
                {/if}
            </button>
            <button class="control shrink-0" aria-label="Close Player" on:click={() => dispatch("close")}>
                <svg class="h-3.5" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </button>
        </div>

        <div class="flex items-center gap-3 mt-2 text-[11px] tabular-nums text-white/50">
            <span class="w-9 text-right">{formatTime(shownPosition)}</span>
            <input class="range flex-1" type="range" min="0" max={duration} step="0.01" aria-label="Seek" value={shownPosition} on:input={handleSeekInput} on:change={handleSeekChange} style="--fill: {progress}%" disabled={loading}>
            <span class="w-9">{formatTime(duration)}</span>
        </div>
    </div>
</div>

<style>
    .control {
        @apply flex justify-center items-center h-8 w-8 rounded-full fill-white/80 transition-colors hover:bg-white/10 hover:fill-white disabled:opacity-30 disabled:hover:bg-transparent;
    }

    .range {
        @apply h-1 rounded-full cursor-pointer appearance-none;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.8) var(--fill), rgba(255, 255, 255, 0.15) var(--fill));
    }

    .range::-webkit-slider-thumb {
        @apply h-3 w-3 rounded-full bg-white appearance-none opacity-0 transition-opacity;
    }

    .range::-moz-range-thumb {
        @apply h-3 w-3 rounded-full bg-white border-0 opacity-0 transition-opacity;
    }

    .range:hover::-webkit-slider-thumb, .range:active::-webkit-slider-thumb {
        @apply opacity-100;
    }

    .range:hover::-moz-range-thumb, .range:active::-moz-range-thumb {
        @apply opacity-100;
    }
</style>
