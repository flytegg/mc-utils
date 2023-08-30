<script lang="ts">
    import MultiSelect from 'svelte-multiselect'
    import items from "$lib/items.json"

    let selectedPrimary: string[]= ["Blue Dye"];
    let selectedFades: string[] = [];
    let selectedExplosionShape: string = '';
    let selectedEffects: string[] = [];
    let selectedFlightPower: number;

    let isFlicker: boolean = false;
    let isTrail: boolean = false;

    let activeResult = true;

    let giveCmd= '';
    let summonCmd = '';

    const positionValues = [
        { left: 1020, top: 1890 },
        { left: 1063, top: 1912 },
        { left: 1098, top: 1912 },
        { left: 1028, top: 1950 },
        { left: 1063, top: 1950 },
        { left: 1098, top: 1950 }
    ];


    function setGiveCommand(){
        let type: number = 0;
        let flicker = '';
        let trail= '';
        let primary: number[] = [];
        let fading: number[] = [];

        switch(selectedExplosionShape){
            case "Default":{
                type = 0;
                break;
            }
            case "Large Ball":{
                type= 1;
                break;
            }
            case "Star":{
                type= 2;
                break;
            }
            case "Creeper":{
                type= 3;
                break;
            }
            case "Burst":{
                type= 4;
            }
        }

        for (let effect of selectedEffects){
            if (effect === "Flicker"){
                flicker= ",Flicker:1";
            } else if (effect === "Trail"){
                trail = ",Trail:1"
            }
        }

        for (let color of selectedPrimary){
            const dyeInfo = dyes.find(dye => dye.color === color);
            if (dyeInfo) {
                primary.push(dyeInfo.deci);
            }
        }

        for (let color of selectedFades){
            const dyeInfo = dyes.find(dye => dye.color === color);
            if (dyeInfo) {
                fading.push(dyeInfo.deci);
            }
        }

        giveCmd = `/give @s firework_rocket{Fireworks:{Flight:${selectedFlightPower},Explosions:[{Type:${type}${flicker}${trail},Colors:[I;${primary.join(',')}]${fading.length > 0 ? `,FadeColors:[I;${fading.join(',')}]` : ''}}]}} 1`;
    }

    function setSummonCommand(){
        let type: number = 0;
        let flicker = '';
        let trail= '';
        let primary: number[] = [];
        let fading: number[] = [];

        switch(selectedExplosionShape){
            case "Default":{
                type = 0;
                break;
            }
            case "Large Ball":{
                type= 1;
                break;
            }
            case "Star":{
                type= 2;
                break;
            }
            case "Creeper":{
                type= 3;
                break;
            }
            case "Burst":{
                type= 4;
            }
        }

        for (let effect of selectedEffects){
            if (effect === "Flicker"){
                flicker= ",Flicker:1";
            } else if (effect === "Trail"){
                trail = ",Trail:1"
            }
        }

        for (let color of selectedPrimary){
            const dyeInfo = dyes.find(dye => dye.color === color);
            if (dyeInfo) {
                primary.push(dyeInfo.deci);
            }
        }

        for (let color of selectedFades){
            const dyeInfo = dyes.find(dye => dye.color === color);
            if (dyeInfo) {
                fading.push(dyeInfo.deci);
            }
        }

        summonCmd = `/summon firework_rocket ~ ~ ~ {FireworksItem:{id:firework_rocket,Count:1,tag:{Fireworks:{Flight:${selectedFlightPower},Explosions:[{Type:${type}${flicker}${trail},Colors:[I;${primary.join(',')}]${fading.length > 0 ? `,FadeColors:[I;${fading.join(',')}]` : ''}}]}}}}`;
    }

    import { toast } from '@zerodevx/svelte-toast'

    function copyValue(text) {
        navigator.clipboard.writeText(text)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    function selectShape(shape: string) {
        selectedExplosionShape = shape;
    }



    function selectEffect(effect: string) {
        const index = selectedEffects.indexOf(effect);
        if (index === -1) {
            selectedEffects.push(effect);
            if (effect === "Flicker"){
                isFlicker = true
            } else { isTrail = true}
        } else {
            selectedEffects.splice(index, 1);
            if (effect === "Flicker"){
                isFlicker = false
            } else { isTrail = false}
        }
    }

    function selectPower(power: string) {
        switch(power){
            case "Low":{
                selectedFlightPower= 25
                break;
            }
            case "Medium":{
                selectedFlightPower= 40
                break;
            }
            case "High":{
                selectedFlightPower= 50
            }
        }    }

    function handleDone(){
        if (!selectedPrimary.length){
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
        activeResult = true;
        setGiveCommand()
        setSummonCommand()
    }

    const dyes = [
        {
            color: "Black Dye",
            img: "black",
            deci: 0
        },
        {
            color: "Blue Dye",
            img: "blue",
            deci: 255
        },
        {
            color: "Brown Dye",
            img: "brown",
            deci:10824234
        },
        {
            color: "Cyan Dye",
            img: "cyan",
            deci:65535
        },
        {
            color: "Gray Dye",
            img: "gray",
            deci:8421504
        },
        {
            color: "Green Dye",
            img: "green",
            deci:32768
        },
        {
            color: "Light Blue Dye",
            img: "light-blue",
            deci:11393254
        },
        {
            color: "Light Gray Dye",
            img: "light-gray",
            deci:13882323
        },
        {
            color: "Lime Dye",
            img: "lime",
            deci:3329330
        },
        {
            color: "Magenta Dye",
            img: "magenta",
            deci:16711935
        },
        {
            color: "Orange Dye",
            img: "orange",
            deci:16753920
        },
        {
            color: "Pink Dye",
            img: "pink",
            deci:16761035
        },
        {
            color: "Purple Dye",
            img: "purple",
            deci:8073150
        },
        {
            color: "Red Dye",
            img: "red",
            deci:16711680
        },
        {
            color: "White Dye",
            img: "white",
            deci:16777215
        },
        {
            color: "Yellow Dye",
            img: "yellow",
            deci:16776960
        }
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
            name: "Flicker",
            img: "flicker"
        },
        {
            name: "Trail",
            img: "trail"
        }
    ]

    const powerValues = [
        {
            name: "Low",
            img: "flight-1",
            duration: 25
        },
        {
            name: "Medium",
            img: "flight-2",
            duration: 40
        },
        {
            name: "High",
            img: "flight-3",
            duration: 50
        },
    ]

</script>


<main class="w-[90%] lg:w-[60%] mt-5">
    <div class="space-y-9">

        <!-- Primary Colors Multiselect -->
        <div class="flex justify-center">
            <div class="text-white font-semibold text-center p-3 m-2 h-[50px] rounded">
                <label for="Primary Colors">
                    <strong>Select your desired Primary colors</strong>
                </label>
                <MultiSelect
                        id='Primary Colors'
                        options={dyes.map(dye => dye.color)}
                        bind:selected={selectedPrimary}
                        placeholder="Colors for Firework Particles"
                        maxSelect = {6}
                        --sms-options-bg="black"
                        --sms-min-height="30px"
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
            <div class="text-white font-semibold text-center p-3 m-2 rounded">
                <label for="Fading Colors">
                    <strong>Select your desired Fading colors</strong>
                </label>
                <MultiSelect
                        id='Fading Colors'
                        options={dyes.map(dye => dye.color)}
                        placeholder="Colors for fading Particles"
                        bind:selected={selectedFades}
                        maxSelect = {6}
                        --sms-options-bg="black"
                        --sms-min-height="30px"
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
        <h3 class="flex justify-center font-medium text-white text-[30px]">Choose the Explosion shape</h3>
        <div class="w-[100%] flex flex-col ">
            <div class="self-center grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-5 gap-2">
            {#each fireworkShape as shape}
                <button
                        class={`custom-button ${shape.shape === selectedExplosionShape ? 'active' : ''}`}
                        on:click={() => selectShape(shape.shape)}
                >
                    <img
                            src="/fireworks/{shape.img}.png"
                            alt={shape.shape}
                            class="w-full"
                    />
                    {shape.shape}
                </button>
            {/each}
            </div>
        </div>

        <!-- Firework Effect Buttons -->
        <h3 class="flex justify-center font-medium text-white text-[30px]">Choose the Firework effect</h3>
        <div class="w-[100%] flex flex-col">
            <div class="self-center grid grid-cols-2 md:grid-cols-2 2xl:grid-cols-2 gap-2">
                {#each fireworkEffect as effect}
                    <button
                            class={`custom-button ${effect.name === "Flicker" && isFlicker ? 'active' : ''} ${effect.name === "Trail" && isTrail ? 'active' : ''}`}
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
        </div>

        <!-- Flight Power Button -->
        <h3 class="flex justify-center font-medium text-white text-[30px]">Choose the Flight duration</h3>
        <div class="w-[100%] flex flex-col ">
            <div class="self-center grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-2">
            {#each powerValues as power}
                <button
                        class={`custom-button ${power.duration === selectedFlightPower ? 'active' : ''}`}
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
        </div>


        <div class="flex items-center flex-col">
        <button
                class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                on:click={handleDone}
        >
        Done
        </button>
        </div>


        {#if activeResult === true}
            <div class="w-full min-w-[10px] flex-1">
                <div class="flex flex-col">
                    <h3 class="font-medium text-white text-20px text-left">Firework Give Command</h3>
                    <div class="flex gap-3 mt-2">
                        <input disabled bind:value={giveCmd} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                        <button on:click={() => copyValue(giveCmd)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                    </div>
                </div>
            </div>

            <div class="w-full min-w-[10px] flex-1">
                <div class="flex flex-col">
                    <h3 class="font-medium text-white text-20px text-left">Firework Summon Command</h3>
                    <div class="flex gap-3 mt-2">
                        <input disabled bind:value={summonCmd} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                        <button on:click={() => copyValue(summonCmd)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                    </div>
                </div>
            </div>

            <h3 class="flex justify-center font-medium text-white text-[40px]">Crafting Recipe</h3>
            <h2 class="flex justify-center font-medium text-white text-[20px]">Step 1: Firework Star</h2>

            <div class="grid grid-cols-1 xl:flex xl:flex-wrap w-full gap-12">
                <div class="w-[350px] h-[170px] mx-auto">
                <img src="/fireworks/crafting-table.png" alt="crafting table" class="w-[350px] h-[170px] absolute">
                <img src={items.find(item => item.name === "Firework Star").texture} alt="firework star" class="w-[40px] h-[40px] left-[1175px] top-[1938px] absolute">
                {#each selectedPrimary as color, index}
                        <img src={items.find(item => item.name=== color).texture} alt={color} class="w-[33px] h-[35px] left-[{positionValues[index].left}px] top-[{positionValues[index].top}px] absolute">
                {/each}

                </div>

<!--                <div class="w-[280px] h-[100px] mx-auto">-->
<!--                {#if selectedFades.length}-->
<!--                    <h2 class="flex justify-center font-medium text-white text-[20px]">Step 2: Fading colors</h2>-->
<!--                    <img src="/fireworks/crafting-table.png" alt="crafting table" class="self-center w-[300px] h-[150px] p-2 py-3">-->
<!--                {/if}-->
<!--                </div>-->
<!--                <h2 class="flex justify-center font-medium text-white text-[20px]">Step {!selectedFades.length ? 2 : 3}: Crafting the Rocket</h2>-->
<!--                <img src="/fireworks/crafting-table.png" alt="crafting table" class="self-center w-[300px] h-[150px] p-2 py-3">-->
            </div>
        {/if}
        
    </div>
</main>



<style>
    .custom-button {
        @apply gap-2 p-4 text-white font-bold items-center;
    }

    .custom-button.active {
        @apply bg-sky-600;
    }

</style>