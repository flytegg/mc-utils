<script>
    import Button from "$lib/element/Button.svelte";
    import Search from "$lib/element/Search.svelte";
    import * as skinview3d from "skinview3d";
    import {onMount} from "svelte";

    const name = "Skin Data";
    const description = "Generate a texture and signature value <br>from a skin to be used in plugin development.";

    onMount(async () => {

    });
</script>

<svelte:head>
    <title>{name} | MC Utils</title>
</svelte:head>

- change MC skin of account
- request texture/signature

- changing skin =
- retrieve texture/sig = 1/60 seconds rate limit

<Search placeholder="" text="Notch" onSearch={(query) => updateSkin(query)} />
<canvas id="skin_container"></canvas>
<Button text="hallo"}/>
