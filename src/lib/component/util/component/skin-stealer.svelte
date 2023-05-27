<script lang="ts">
    import Button from "$lib/component/element/Button.svelte"
    import Search from "$lib/component/element/Search.svelte"
    import * as SkinViewer from "skinview3d"
    import { onMount } from "svelte"

    const name = "Skin Stealer"
    const description = `Yoink someone's skin`
    const shortDescription = "addwaw"

    const defaultSkin = "https://crafatar.com/skins/d556fff2-8f3c-43b3-9111-c288204f16e2?default=MHF_Steve"

    let searchElement
    let currentSearch: string
    let currentSkin: string
    let skinViewer: SkinViewer.SkinViewer

    onMount(async () => {
        skinViewer = new SkinViewer.SkinViewer({
            canvas: document.getElementById("skin_container") as HTMLCanvasElement,
            height: 500,
            width: 500
        })

        skinViewer.autoRotate = false
        skinViewer.fov = 70
        skinViewer.zoom = 0.6

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
</script>

<Search bind:this={searchElement} placeholder="Enter someone's username" search={(query) => updateSkin(query)} />
<canvas id="skin_container"></canvas>
<div class="flex gap-6 mt-[-30px]">
    <a href={currentSkin} download=""><Button text="Download Skin"/></a>
    <a href="https://www.minecraft.net/profile/skin/remote?url=undefined" target="_blank"><Button text="Apply Skin"/></a> <!-- Mojang broke passing the image through the URL. NameMC removed it & other sites don't work either. So just sending a template link -->
</div>
