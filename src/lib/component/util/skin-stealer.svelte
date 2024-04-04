<script lang="ts">
    import * as SkinViewer from "skinview3d"
    import { onMount } from "svelte"
    import {toast} from "@zerodevx/svelte-toast";

    let currentSearch: string
    let currentSkin: string
    let skinContainer: HTMLCanvasElement
    let skinViewer: SkinViewer.SkinViewer

    let loading = false
    let noAccountFound = false

    async function loadSkinViewer() {
        skinViewer = new SkinViewer.SkinViewer({
            canvas: skinContainer as HTMLCanvasElement,
            height: 400,
            width: 300,
            skin: "https://crafatar.com/skins/d556fff2-8f3c-43b3-9111-c288204f16e2?default=MHF_Steve" // Steve skin
        });

        skinViewer.autoRotate = false;
        skinViewer.fov = 10;
        skinViewer.zoom = 0.70;

        skinViewer.controls.enableZoom = false;
    }

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        let ign = urlParams.get('ign')

        if (ign) {
            searchValue = ign
            link = "https://mcutils.com/skin-stealer#ign=" + ign
            await updateSkin(ign)
        } else {
            await updateSkin("Notch")
        }
    })

    const updateSkin = async (username: string) => {
        if (username.length > 16) return
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return
        if (username == currentSearch) return

        loading = true
        currentSearch = username

        const response = await fetch(`/api/profile/${username}`)
        const data = await response.json()

        loading = false
        setTimeout(() => { // This is needed since otherwise it can't find the canvas for the skinViewer
            loadSkinViewer()
            if (data.status) {
                noAccountFound = true
            } else {
                noAccountFound = false
                currentSkin = data.skin.png.data
                skinViewer.loadSkin(data.renders.skin)
            }

            skinViewer.nameTag = username
        }, 1)
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSkin(searchValue)
    }

    const handleInput = () => {
        link = "https://mcutils.com/cape-stealer#ign=" + searchValue
    };

    let link = "https://mcutils.com/skin-stealer#ign="

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
    <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><!-- Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
{:else if noAccountFound}
    <p class="mt-10 text-[#F55050] text-2xl">There are no capes associated with this account.</p>
{:else}
    <canvas bind:this={skinContainer} class="mt-10 "></canvas>
    <div class="flex gap-6">
        <a href={currentSkin} download="" aria-label='Download Skin'><button class="button" on:click={downloadSkin}>Download Skin</button></a>
        <a href="https://www.minecraft.net/en-us/msaprofile/mygames/editskin" aria-label='Apply Skin' target="_blank"><button class="button">Apply Skin</button></a> <!-- Mojang broke passing the image through the URL. NameMC removed it & other sites don't work either. So just sending a template link -->
    </div>
{/if}

{#if !loading && currentSearch}
    <div class="flex flex-col mt-8 w-fit">
        <h3 class="font-medium text-white text-20px text-center">Shareable Link</h3>
        <div class="flex gap-3 mt-2 w-fit">
            <input disabled bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] md:w-[370px] max-w-[100%] ">
            <button on:click={copyLink} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
        </div>
    </div>
{/if}
