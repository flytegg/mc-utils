<script lang="ts">
    import { onMount } from "svelte"
    import {toast} from "@zerodevx/svelte-toast";

    let currentSearch: string | undefined = undefined
    let currentSkin: string

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        let ign = urlParams.get('ign')
        if (ign) {
            updateSkin(ign)
            link = "https://mcutils.com/cape-stealer#ign=" + ign
        }
    })

    let loading = false
    let noCapes = false
    let data: any[] = []

    const replacements = {
        minecraft: "Minecraft",
        optifine: "Optifine",
        minecraftcapes: "MinecraftCapes",
        labymod: "LabyMod",
        "5zig": "5zig",
        tlauncher: "TLauncher"
    };

    const updateSkin = async (username: string) => {
        if (!username || username.length > 16) return
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return
        if (username == currentSearch) return

        loading = true
        currentSearch = username

        const response = await fetch(`https://api.capes.dev/load/${username}`)
        if (response.ok) {
            const jsonResponse = await response.json();
            data = Array.isArray(jsonResponse) ? jsonResponse : Object.values(jsonResponse);
            noCapes = data.every(cape => cape.exists === false);
        } else {
            noCapes = true
        }
        loading = false
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSkin(searchValue)
    }

    const handleInput = () => {
        link = "https://mcutils.com/cape-stealer#ign=" + searchValue
    };

    let link = "https://mcutils.com/cape-stealer#ign="

    function downloadSkin() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    function copyLink() {
        navigator.clipboard.writeText(link)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    function disallowSpaces(event: KeyboardEvent) {
        if (event.key === " ") {
            event.preventDefault();
        }
    }
</script>

<div class="flex gap-3">
    <input class="search w-[26rem]" maxlength="16" bind:value={searchValue} on:input={handleInput} on:keydown={disallowSpaces} type="text" placeholder="Enter username..." on:keypress={handleKeyPress} on:blur={handleInput}>
    <button class="button text-md py-0" on:click={() => updateSkin(searchValue)}>Search</button>
</div>

{#if loading}
    <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
{:else if noCapes}
    <p class="mt-10 text-[#F55050] text-2xl">There are no capes associated with this account.</p>
{:else}
    <div class="flex flex-wrap gap-10 mt-10">
        {#each data as cape (cape.hash)}
            {#if cape.exists && cape.frontImageUrl}
                <div class="flex flex-col items-center justify-center">
                    <h3 class="font-medium text-white text-[20px] mb-4 text-center">{cape.type.replace(/\b(?:minecraft|optifine|minecraftcapes|labymod|5zig|tlauncher)\b/g, (match) => replacements[match])}</h3>
                    <img class="h-80 aspect-auto" src={cape.frontImageUrl} alt={`${cape.playerName}'s ${cape.type} cape`} />
                    <a href={currentSkin} download="" aria-label='Download Skin' class="mt-4"><button class="button" on:click={downloadSkin}>Download</button></a>
                </div>
            {/if}
        {/each}
    </div>
{/if}

{#if !loading && currentSearch}
    <div class="flex flex-col mt-12 w-fit">
        <h3 class="font-medium text-white text-20px text-center">Shareable Link</h3>
        <div class="flex gap-3 mt-2 w-fit">
            <input disabled bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] md:w-[370px] max-w-[100%] ">
            <button on:click={copyLink} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
        </div>
    </div>
{/if}

<style>
    img {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }
</style>
