
<script lang="ts">
    import MultiSelect from 'svelte-multiselect'

    let selectedPrimaryColors: string[] = [];
    let selectedFadingColors: string[] = [];
    let selectedExplosionShape: string = '';
    let selectedEffect: string = '';
    let selectedFlightPower: string = '';


    function selectShape(shape: string) {
        selectedExplosionShape = shape;
    }

    function selectEffect(effect: string) {
        selectedEffect = effect;
    }

    function selectPower(power: string) {
        selectedFlightPower = power;
    }

    function handleDone(){
        if (!selectedPrimaryColors.length || selectedPrimaryColors.length > 6){
            alert("Please select upto 6 Primary colors!")
            return;
        }
        if (!selectedFlightPower){
            alert("Please select the Flight Power!")
            return
        }
        if (!selectedExplosionShape){
            selectedExplosionShape="Default"
        }

    }

    const dyes = [
        {
            color: "Black Dye",
            img: "black"
        },
        {
            color: "Blue Dye",
            img: "blue"
        },
        {
            color: "Brown Dye",
            img: "brown"
        },
        {
            color: "Cyan Dye",
            img: "cyan"
        },
        {
            color: "Gray Dye",
            img: "gray"
        },
        {
            color: "Green Dye",
            img: "green"
        },
        {
            color: "Light Blue Dye",
            img: "light-blue"
        },
        {
            color: "Light Gray Dye",
            img: "light-gray"
        },
        {
            color: "Lime Dye",
            img: "lime"
        },
        {
            color: "Magenta Dye",
            img: "magenta"
        },
        {
            color: "Orange Dye",
            img: "orange"
        },
        {
            color: "Pink Dye",
            img: "pink"
        },
        {
            color: "Purple Dye",
            img: "purple"
        },
        {
            color: "Red Dye",
            img: "red"
        },
        {
            color: "White Dye",
            img: "white"
        },
        {
            color: "Yellow Dye",
            img: "yellow"
        },
    ]


    const fireworkShape = [
        {
            shape: "Default",
            img: "default"
        },
        {
            shape: "Large Ball",
            img: "large-ball"
        },
        {
            shape: "Star",
            img: "star"
        },
        {
            shape: "Creeper",
            img: "creeper"
        },
        {
            shape: "Burst",
            img: "burst"
        }
    ]

    const fireworkEffect = [
        {
            name: "Twinkle",
            img: "twinkle"
        },
        {
            name: "Trail",
            img: "trail"
        }
    ]

    const powerValues = [
        {
            name: "Low",
            img: "flight-1"
        },
        {
            name: "Medium",
            img: "flight-2"
        },
        {
            name: "High",
            img: "flight-3"
        },
    ]

</script>


<main class="flex justify-center items-center">
    <div class="text-center space-y-9">

        <!-- Primary Colors Multiselect -->
        <div class="flex justify-center">
            <div class="text-indigo-500 font-semibold text-center p-3 m-2 rounded">
                <label for="Primary Colors">
                    <strong>Select your desired Primary colors (up to 6)</strong>
                </label>
                <MultiSelect
                        id='Primary Colors'
                        options={dyes.map(dye => dye.color)}
                        placeholder="Colors for Firework Particles"
                        bind:selectedPrimaryColors
                        let:option
                >
                    <img
                            src="/fireworks/dyes/{dyes.find(dye => dye.color === option).img}.png"
                            alt={option}
                            class="mg-flex w-[100%] lg:w-[40px]"
                    /> {option}
                </MultiSelect>
            </div>
        </div>

        <!-- Fading Colors Multiselect -->
        <div class="flex justify-center">
            <div class="text-indigo-500 font-semibold text-center p-3 m-2 rounded">
                <label for="Fading Colors">
                    <strong>Select your desired Fading colors (up to 6)</strong>
                </label>
                <MultiSelect
                        id='Fading Colors'
                        options={dyes.map(dye => dye.color)}
                        placeholder="Colors for fading Particles"
                        bind:selectedFadingColors
                        let:option
                >
                    <img
                            src="/fireworks/dyes/{dyes.find(dye => dye.color === option).img}.png"
                            alt={option}
                            class="mg-flex w-[100%] lg:w-[40px]"
                    /> {option}
                </MultiSelect>
            </div>
        </div>

        <!-- Firework Shape Buttons -->
        <h3 class="font-medium text-white text-[30px] text-center">Choose the Explosion shape</h3>
        <div class="flex justify-center space-x-4">
            {#each fireworkShape as shape}
                <button
                        class={`shape-button ${shape.shape === selectedExplosionShape ? 'active' : ''}`}
                        on:click={() => selectShape(shape.shape)}
                >
                    <img
                            src="/fireworks/{shape.img}.png"
                            alt={shape.shape}
                            class="w-[100%] lg:w-[120px]"
                    />
                    {shape.shape}
                </button>
            {/each}
        </div>

        <!-- Firework Effect Buttons -->
        <h3 class="font-medium text-white text-[30px] text-center">Choose the Firework effect</h3>
        <div class="flex justify-center space-x-4">
            {#each fireworkEffect as effect}
                <button
                        class={`effect-button ${effect.name === selectedEffect ? 'active' : ''}`}
                        on:click={() => selectEffect(effect.name)}
                >
                    <img
                            src="/fireworks/{effect.img}.png"
                            alt={effect.name}
                            class="w-[100%] lg:w-[120px]"
                    />
                    {effect.name}
                </button>
            {/each}
        </div>

        <!-- Flight Power Button -->
        <h3 class="font-medium text-white text-[30px] text-center">Choose the Flight duration</h3>
        <div class="flex justify-center space-x-4">
            {#each powerValues as power}
                <button
                        class={`power-button ${power.name === selectedFlightPower ? 'active' : ''}`}
                        on:click={() => selectPower(power.name)}
                >
                    <img
                            src="/fireworks/{power.img}.png"
                            alt={power.name}
                            class="w-[100%] lg:w-[80px]"
                    />
                    {power.name}
                </button>
            {/each}
        </div>

        <button
                class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                on:click={handleDone}
        >
        Done
        </button>
    </div>
</main>



<style>
    .shape-button {
        @apply text-white w-[49%] self-center font-bold p-2 ;
    }

    .effect-button {
        @apply text-white w-[20%] self-center font-bold p-2 ;
    }

    .power-button {
        @apply text-white w-[15%] self-center font-bold p-2 ;
    }

    .shape-button.active {
        @apply bg-sky-600;
    }

    .power-button.active {
        @apply bg-sky-600;
    }

    .effect-button.active {
        @apply bg-sky-600;
    }

    .shape-grid {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }



</style>