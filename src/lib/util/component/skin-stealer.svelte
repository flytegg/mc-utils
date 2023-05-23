<script>
    import Button from "$lib/element/Button.svelte";
    import Search from "$lib/element/Search.svelte";
    import * as skinview3d from "skinview3d";
    import {onMount} from "svelte";

    const name = "Skin Stealer";
    const description = `Yoink someone's skin`;

    let currentSearch = "Notch"

    let skinViewer;
    onMount(async () => {
        skinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById("skin_container"),
            height: 500,
            width: 500
        });
        skinViewer.autoRotate = false;
        skinViewer.fov = 70;
        skinViewer.zoom = 0.6
        await updateSkin("stxphen")
    });

    let test = "hey"

    const updateSkin = async (username) => {
        if (username.length > 16) return
        // if (username.equals(currentSearch)) return
        currentSearch = username
        const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
        const data = await response.json();
        skinViewer.loadSkin("https://crafatar.com/skins/" + data.uuid)
        skinViewer.nameTag = "stxphen"
    };
</script>

<svelte:head>
    <title>{name} | MC Utils</title>
</svelte:head>
{test}
<Search placeholder="" text="Notch" onSearch={(query) => updateSkin(query)} />
<canvas id="skin_container"></canvas>
<Button text="hallo" onClick={() => updateSkin("69e8f7d511f94818a3bb7f237df32949")}/>
