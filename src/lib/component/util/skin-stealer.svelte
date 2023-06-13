<script lang="ts">
    import SearchIcon from "$lib/component/icon/SearchIcon.svelte";
    import * as SkinViewer from "skinview3d"
    import { onMount } from "svelte"

    const defaultSkin = "https://crafatar.com/skins/d556fff2-8f3c-43b3-9111-c288204f16e2?default=MHF_Steve"

    let currentSearch: string
    let currentSkin: string
    let skinViewer: SkinViewer.SkinViewer

    onMount(async () => {
        skinViewer = new SkinViewer.SkinViewer({
            canvas: document.getElementById("skin_container") as HTMLCanvasElement,
            height: 400,
            width: 500
        })

        skinViewer.autoRotate = false
        skinViewer.fov = 10
        skinViewer.zoom = 0.70

        await updateSkin("Notch")
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
            currentSkin = data.skin.data
            skinViewer.loadSkin(data.renders.skin)
        }

        skinViewer.nameTag = username
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSkin(searchValue)
    }

    const handleInput = () => {
        updateSkin(searchValue)
    }
</script>

<div class="search">
    <SearchIcon />
    <input bind:value={searchValue} type="text" placeholder="Enter someone's username" on:keypress={handleKeyPress} on:blur={handleInput}>
</div>
<canvas id="skin_container" class="mt-10 mb-10"></canvas>
<div class="flex gap-6">
    <a href={currentSkin} download=""><button>Download Skin</button></a>
    <a href="https://www.minecraft.net/profile/skin/remote?url=undefined" target="_blank"><button>Apply Skin</button></a> <!-- Mojang broke passing the image through the URL. NameMC removed it & other sites don't work either. So just sending a template link -->
</div>
