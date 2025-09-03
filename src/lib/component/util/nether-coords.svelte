<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {incrementTracker} from "$lib/tracker/tracker";

    let netherX = 0;
    let netherY = 0;
    let netherZ = 0;
    let overworldX = 0;
    let overworldY = 0;
    let overworldZ = 0;
    let isNetherInput = true;

    $: {
        if (isNetherInput) {
            overworldX = netherX * 8;
            overworldY = netherY;
            overworldZ = netherZ * 8;
        } else {
            netherX = Math.round(overworldX / 8);
            netherY = overworldY;
            netherZ = Math.round(overworldZ / 8);
        }
    }

    function copyNetherCoords() {
        const coords = `${netherX} ${netherY} ${netherZ}`;
        navigator.clipboard.writeText(coords);
        toast.push('Nether coordinates copied!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        });
        incrementTracker("nether-coords-copied");
    }

    function copyOverworldCoords() {
        const coords = `${overworldX} ${overworldY} ${overworldZ}`;
        navigator.clipboard.writeText(coords);
        toast.push('Overworld coordinates copied!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        });
        incrementTracker("nether-coords-copied");
    }
</script>

<main class="w-full flex justify-center items-center">
    <div class="w-[600px] flex flex-col gap-8">
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-center">Overworld Coordinates</h3>
            <div class="flex justify-center gap-4 mt-2">
                <div class="flex flex-col">
                    <label for="overworld-x" class="text-sm text-gray-400 mb-1">X</label>
                    <input 
                        id="overworld-x"
                        type="number"
                        bind:value={overworldX} 
                        on:input={() => isNetherInput = false}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
                <div class="flex flex-col">
                    <label for="overworld-y" class="text-sm text-gray-400 mb-1">Y</label>
                    <input 
                        id="overworld-y"
                        type="number"
                        bind:value={overworldY} 
                        on:input={() => isNetherInput = false}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
                <div class="flex flex-col">
                    <label for="overworld-z" class="text-sm text-gray-400 mb-1">Z</label>
                    <input 
                        id="overworld-z"
                        type="number"
                        bind:value={overworldZ} 
                        on:input={() => isNetherInput = false}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
            </div>
            <div class="flex justify-center mt-5">
                <button class="w-fit text-sm px-20 py-1.5 button h-fit" on:click={copyOverworldCoords}>Copy</button>
            </div>
        </div>

        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-center">Nether Coordinates</h3>
            <div class="flex justify-center gap-4 mt-2">
                <div class="flex flex-col">
                    <label for="nether-x" class="text-sm text-gray-400 mb-1">X</label>
                    <input 
                        id="nether-x"
                        type="number"
                        bind:value={netherX} 
                        on:input={() => isNetherInput = true}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
                <div class="flex flex-col">
                    <label for="nether-y" class="text-sm text-gray-400 mb-1">Y</label>
                    <input 
                        id="nether-y"
                        type="number"
                        bind:value={netherY} 
                        on:input={() => isNetherInput = true}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
                <div class="flex flex-col">
                    <label for="nether-z" class="text-sm text-gray-400 mb-1">Z</label>
                    <input 
                        id="nether-z"
                        type="number"
                        bind:value={netherZ} 
                        on:input={() => isNetherInput = true}
                        class="w-[120px] py-2 px-3 text-sm bg-[#141517] border border-gray-700 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                </div>
            </div>
            <div class="flex justify-center mt-5">
                <button class="w-fit text-sm px-20 py-1.5 button h-fit" on:click={copyNetherCoords}>Copy</button>
            </div>
        </div>
    </div>
</main>