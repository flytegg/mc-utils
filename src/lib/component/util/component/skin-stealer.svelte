<script lang="ts">
    import Button from "$lib/component/element/Button.svelte"
    import Search from "$lib/component/element/Search.svelte"
    import * as SkinViewer from "skinview3d"
    import { onMount } from "svelte"

    const name = "Skin Stealer"
    const description = `Yoink someone's skin`

    let currentSearch: string

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
        if (username == currentSearch) return

        currentSearch = username

        const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)
        const data = await response.json();

        skinViewer.loadSkin("https://crafatar.com/skins/" + data.uuid)
        skinViewer.nameTag = username
    }

    let searchElement;
</script>

<Search bind:this={searchElement} placeholder="Enter someone's username" search={(query) => updateSkin(query)} />
<canvas id="skin_container"></canvas>
<Button text="hallo" click={() => console.log("hallo")} />
