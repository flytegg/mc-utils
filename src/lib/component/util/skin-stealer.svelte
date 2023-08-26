<script lang="ts">
    import * as SkinViewer from "skinview3d"
    import { onMount } from "svelte"
    import {toast} from "@zerodevx/svelte-toast";

    const defaultSkin = "https://crafatar.com/skins/d556fff2-8f3c-43b3-9111-c288204f16e2?default=MHF_Steve"

    let currentSearch: string
    let currentSkin: string
    let skinViewer: SkinViewer.SkinViewer

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        let ign = urlParams.get('ign')

        skinViewer = new SkinViewer.SkinViewer({
            canvas: document.getElementById("skin_container") as HTMLCanvasElement,
            height: 400,
            width: 300
        })

        skinViewer.autoRotate = false
        skinViewer.fov = 10
        skinViewer.zoom = 0.70

        skinViewer.controls.enableZoom = false

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

        currentSearch = username

        const response = await fetch(`/api/profile/${username}`)
        const data = await response.json()

        if (data.status) {
            skinViewer.loadSkin(defaultSkin)
        } else {
            currentSkin = data.skin.png.data
            skinViewer.loadSkin(data.renders.skin)
        }

        skinViewer.nameTag = username
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSkin(searchValue)
    }

    let debounceTimer: NodeJS.Timeout | null = null;
    const handleInput = () => {
        link = "https://mcutils.com/skin-stealer#ign=" + searchValue
        if (searchValue === "") return

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            updateSkin(searchValue)
        }, 500); // Adjust the debounce delay as needed
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

<div class="search w-fit h-10 text-md">
    <img src="/icon/search.svg" alt="Search Icon" class="h-5">
    <input maxlength="16" bind:value={searchValue} on:input={handleInput} on:keydown={disallowSpaces} type="text" placeholder="Enter username..." on:keypress={handleKeyPress} on:blur={handleInput} class="w-full pt-0.5 pr-0.5 justify-center items-center self-center">
</div>

<canvas id="skin_container" class="mt-10 "></canvas>
<div class="flex gap-6">
    <a href={currentSkin} download="" aria-label='Download Skin'><button class="button" on:click={downloadSkin}>Download Skin</button></a>
    <a href="https://www.minecraft.net/en-us/msaprofile/mygames/editskin" aria-label='Apply Skin' target="_blank"><button class="button">Apply Skin</button></a> <!-- Mojang broke passing the image through the URL. NameMC removed it & other sites don't work either. So just sending a template link -->
</div>

<div class="flex flex-col mt-8 w-fit">
    <h3 class="font-medium text-white text-20px text-center">Shareable Link</h3>
    <div class="flex gap-3 mt-2 w-fit">
        <input disabled bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] md:w-[370px] max-w-[100%] ">
        <button on:click={copyLink} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
    </div>
</div>
