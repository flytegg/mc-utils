<script lang="ts">
    import { Slider } from "svelte-awesome-slider"

    let players = 5
    let mods = 0

    let selectedType = "Mods"
    const options = [
        "Mods",
        "Modpack size"
    ]
    let width:any;
            $: {
                if (selectedType === "Mods") {
                    width = "80px";
                } else if (selectedType === "Modpack size") {
                    width = "140px";
                }
            }
    
    let recommendedRam: any
    $: {
        if (players == 5 && mods >= 0 && mods <= 10 && selectedType === "Mods") {
            recommendedRam = 2
        }
        if (players == 5 && mods >= 11 && mods <= 25 && selectedType === "Mods") {
            recommendedRam = 4
        }
        if (players == 5 && mods >= 26 && mods <= 50 && selectedType === "Mods") {
            recommendedRam = 6
        }
        if (players >= 10 && players <= 25 && mods >= 0 && mods <= 10 && selectedType === "Mods") {
            recommendedRam = 4
        }
        if (players >= 10 && players <= 25 && mods >= 11 && mods <= 25 && selectedType === "Mods") {
            recommendedRam = 6
        }
        if (players >= 10 && players <= 25 && mods >= 26 && mods <= 50 && selectedType === "Mods") {
            recommendedRam = 8
        }
        if (players >= 26 && players <= 50 && mods >= 0 && mods <= 10 && selectedType === "Mods") {
            recommendedRam = 6
        }
        if (players >= 26 && players <= 50 && mods >= 11 && mods <= 25 && selectedType === "Mods") {
            recommendedRam = 8
        }
        if (players >= 26 && players <= 50 && mods >= 26 && mods <= 50 && selectedType === "Mods") {
            recommendedRam = 10
        }
        if (players >= 51 && players <= 100 && mods >= 0 && mods <= 10 && selectedType === "Mods") {
            recommendedRam = 8
        }
        if (players >= 51 && players <= 100 && mods >= 11 && mods <= 25 && selectedType === "Mods") {
            recommendedRam = 10
        }
        if (players >= 51 && players <= 100 && mods >= 26 && mods <= 50 && selectedType === "Mods") {
            recommendedRam = 12
        }
        if (players == 5 && mods === 0 && selectedType === "Modpack size") {
            recommendedRam = 2
        }
        if (players == 5 && mods === 1 && selectedType === "Modpack size") {
            recommendedRam = 4
        }
        if (players == 5 && mods === 2 && selectedType === "Modpack size") {
            recommendedRam = 6
        }
        if (players >= 10 && players <= 25 && mods === 0 && selectedType === "Modpack size") {
            recommendedRam = 4
        }
        if (players >= 10 && players <= 25 && mods === 1 && selectedType === "Modpack size") {
            recommendedRam = 6
        }
        if (players >= 10 && players <= 25 && mods === 2 && selectedType === "Modpack size") {
            recommendedRam = 8
        }
        if (players >= 26 && players <= 50 && mods === 0 && selectedType === "Modpack size") {
            recommendedRam = 6
        }
        if (players >= 26 && players <= 50 && mods === 1 && selectedType === "Modpack size") {
            recommendedRam = 8
        }
        if (players >= 26 && players <= 50 && mods === 2 && selectedType === "Modpack size") {
            recommendedRam = 10
        }
        if (players >= 51 && players <= 100 && mods === 0 && selectedType === "Modpack size") {
            recommendedRam = 8
        }
        if (players >= 51 && players <= 100 && mods === 1 && selectedType === "Modpack size") {
            recommendedRam = 10
        }
        if (players >= 51 && players <= 100 && mods === 2 && selectedType === "Modpack size") {
            recommendedRam = 12
        }
    }
</script>

<main class="w-[90%] lg:w-[60%] mt-5 flex-col flex justify-center">
    <h3 class="font-medium text-white text-20px text-left mb-2.5">
        Amount of players
    </h3>
    <p class="text-gray-400 text-lg mb-1 text-left">{players === 100 ? '100+' : players}</p>
    <Slider min={5} max={100} bind:value={players} step={5} name="Players" --track-background="rgba(255,255,255,0.6)" --thumb-background="#FFF"/>
    <br>

    <h3 class="text-left">
        <select bind:value={selectedType} id="type" class="scroll self-center font-medium text-white text-20px" style="border-color: transparent; font-weight= 500; color: #FFF; font-size: 16px; width: {width}">
            {#each options as option}
                <option value="{option}" class="scroll-option">{option}</option>
            {/each}
        </select>
    </h3>
    {#if selectedType === "Mods"}
        <p class="text-gray-400 text-lg mb-1 text-left">{mods === 50 ? '50+' : mods}</p>
        <Slider min={0} max={50} bind:value={mods} step={1} name="Mods" --track-background="rgba(255,255,255,0.6)" --thumb-background="#FFF"/>
    {:else if selectedType === "Modpack size"}
        <p class="text-gray-400 text-lg mb-1 text-left">{['Small', 'Medium', 'Large'][mods]}</p>
        <Slider min={0} max={2} bind:value={mods} step={1} name="Modpack size" --track-background="rgba(255,255,255,0.6)" --thumb-background="#FFF"/>
    {/if}

    <h3 class="font-medium text-white text-20px text-left mb-2.5 mt-6">
        Amount of ram
    </h3>
    <p class="text-gray-400 text-lg mb-3 text-left">{recommendedRam} GB</p>

</main>
