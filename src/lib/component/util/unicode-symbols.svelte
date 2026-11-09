<script lang="ts">
    import { onMount } from "svelte"
    import { toast } from "@zerodevx/svelte-toast"
    import { incrementTracker } from "$lib/tracker/tracker"
    import { fetchMinecraftSymbols, toCodePoint, type UnicodeGroup } from "$lib/unicode"

    let groups: UnicodeGroup[] = []
    let loading = true
    let error = ""
    let search = ""

    onMount(load)

    async function load() {
        loading = true
        error = ""
        try {
            groups = await fetchMinecraftSymbols()
        } catch (e) {
            error = "Could not load the symbols. Please try again."
        }
        loading = false
    }

    $: query = search.trim().toLowerCase()
    $: filtered = groups
        .map((group) => ({
            ...group,
            chars: query ? group.chars.filter((c) => c.toLowerCase().includes(query) || toCodePoint(c).toLowerCase().includes(query)) : group.chars,
        }))
        .filter((group) => group.chars.length)
    $: total = groups.reduce((sum, group) => sum + group.chars.length, 0)

    function copy(char: string) {
        navigator.clipboard.writeText(char)
        toast.push(`Copied ${char} successfully!`, {
            theme: {
                "--toastColor": "mintcream",
                "--toastBackground": "rgba(72,187,120,0.9)",
                "--toastBarBackground": "#2F855A",
            },
        })
        incrementTracker("unicode-symbol-copied")
    }
</script>

<main class="w-[90%] lg:w-[60%] text-white">
    {#if loading}
        <p class="text-center text-gray-400">Loading symbols...</p>
    {:else if error}
        <div class="flex flex-col items-center gap-4">
            <p class="text-gray-400">{error}</p>
            <button class="button" on:click={load}>Retry</button>
        </div>
    {:else}
        <input class="w-full text-lg text-gray-400 rounded-md p-2 bg-[#141517]" placeholder="Search a symbol or code point (e.g. ★ or U+2605)" bind:value={search} />
        <p class="text-center text-gray-500 text-sm mt-2">{total} symbols - click one to copy</p>

        {#each filtered as group}
            <h3 class="font-medium text-white text-[20px] text-center mt-8">{group.name}</h3>
            <div class="mt-4 rounded-md p-2 bg-[#141517] flex flex-wrap gap-1">
                {#each group.chars as char}
                    <button class="symbol" title={toCodePoint(char)} on:click={() => copy(char)}>{char}</button>
                {/each}
            </div>
        {:else}
            <p class="text-center text-gray-400 mt-8">No symbols found.</p>
        {/each}
    {/if}
</main>

<style>
    .symbol {
        font-family: "Segoe UI Symbol", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 19px;
        width: 2rem;
        height: 2rem;
        color: rgb(156 163 175);
        border-radius: 0.25rem;
        transition: background-color 0.15s, color 0.15s;
    }
    .symbol:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }
</style>
