<script lang="ts">
    import { Slider } from "svelte-awesome-slider"

    // Default values for the amount of players and mods
    let players = 5
    let mods = 0

    let selectedType = "Mods"
    const options = [
        "Mods",
        "Modpack size"
    ]

    // Switching widths of the select element
    let width: string
    $: {
        if (selectedType === "Mods") {
            width = "80px"
            mods = 0
        } else if (selectedType === "Modpack size") {
            width = "140px"
            mods = 0
        }
    }
    
    let recommendedRam: any

    // This is the calculation for the recommended ram
    $: {
        // These are the values added for each player increase
        const playersToRam:any = {
            5: 2,
            10: 4,
            26: 6,
            51: 8
        }
        // These are the values added for each mod increase
        const modsToRam:any = {
            0: 0,
            1: 2,
            11: 4,
            26: 6
        }
        // These are the values added for each modpack size
        const modpacktoRam:any = {
            0: 2,
            1: 4,
            2: 8
        }

        // This function converts the amount of players to the correlating value in playersToRam
        function getPlayers(): number {
            if (players >= 5 && players < 10) {
                return 5
            } else if (players >= 10 && players <= 25) {
                return 10
            } else if (players >= 26 && players <= 50) {
                return 26
            } else if (players >= 51 && players <= 100) {
                return 51
            }
            return NaN
        }

        // This function converts the amount of mods to the correlating value in modsToRam
        function getMods(): number{
            if (selectedType === "Mods") {
                if (mods >= 5 && mods <= 10) {
                    return 1
                } else if (mods >= 11 && mods <= 25) {
                    return 11
                } else if (mods >= 26 && mods <= 50) {
                    return 26
                } else if (mods <= 5) {
                    return 0
                }
            } else if (selectedType === "Modpack size") {
                return mods
            }
            return NaN
        }
        
        // Adds the values of the players and mods together to get the recommended ram
        if (selectedType === "Mods") {
            recommendedRam = playersToRam[getPlayers()] + modsToRam[getMods()]
        } else if (selectedType === "Modpack size") {
            recommendedRam = playersToRam[getPlayers()] + modpacktoRam[mods]
        }
    }

    // This function redirects the user to the start file generator with the recommended ram
    function StartFile() {
        window.location.href = `/start-file-generator?ram=${recommendedRam}GB`
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
    <!-- Switching between mods and modpack size -->
    <!-- Giving a different slider and text -->
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
    <p class="text-gray-400 text-lg mb-6 text-left">{recommendedRam} GB</p>

    <!-- Button redirecting to the Start File Generator page with the recommended ram -->
    <button class="button w-fit text-sm" on:click={StartFile}>Create start file</button>

</main>
