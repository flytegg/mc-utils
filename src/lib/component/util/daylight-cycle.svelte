<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";

    let time = ""
    let convertedTime: number | null = null;

    function convertToMinecraftTicks() {
        const [hours, minutes] = time.split(":").map(Number);
        const minutesSinceMidnight = hours * 60 + minutes;

        const hours2 = minutesSinceMidnight / 60
        let newHour = hours2 - 6
        if (newHour < 0) {
            newHour = 24 + newHour
        }
        convertedTime = Math.floor(newHour * 1000);
    }

    function copyValue() {
        navigator.clipboard.writeText(convertedTime + "")
        copyToast()
    }

    function copyToast() {
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }
</script>

<main class="w-[60%] flex flex-col">
    <div class="flex flex-wrap mx-auto gap-10 mt-[-5px]">
        <div class="flex flex-col self-center mx-auto">
            <h3 class="font-medium text-white text-[20px] text-left">Time (24h Clock)</h3>
            <input bind:value={time} on:input={convertToMinecraftTicks} type="time" id="appt" name="appt" required class="w-full scroll">
        </div>
        <svg class="self-center h-5 hidden md:block mx-auto" fill="#626875" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 96c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320zM262.6 135.1l99.9 107.1c3.5 3.8 5.5 8.7 5.5 13.8s-2 10.1-5.5 13.8L262.6 376.9c-4.2 4.5-10.1 7.1-16.3 7.1C234 384 224 374 224 361.7l0-57.7-96 0c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l96 0 0-57.7c0-12.3 10-22.3 22.3-22.3c6.2 0 12.1 2.6 16.3 7.1z"/></svg>
        <div class="flex gap-4 self-center pt-3 mx-auto">
            <div class="flex flex-col self-center mb-4">
                <h3 class="font-medium text-white text-[20px] text-left">Minecraft Time (Ticks)</h3>
                {#if !isNaN(convertedTime)}
                    <input bind:value={convertedTime} on:copy={copyToast} disabled class="w-full py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                {:else}
                    <input disabled class="w-[160px] py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                {/if}
            </div>
            <button class="w-fit text-sm px-3 text-center py-1.5 button h-fit self-center" on:click={copyValue}>Copy</button>
        </div>
    </div>
    <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-3 ">Full Daylight Cycle</h3>
    <img class="mx-auto object-scale-down w-[600px]" src="/img/daylight-cycle.svg" alt="Daylight Cycle">
</main>

<style>
    label {
        display: block;
    }

    input, label {
        margin: 0.4rem 0;
    }

    /* Style the clock image */
    input[type="time"]::-webkit-calendar-picker-indicator {
        filter: invert(30%) sepia(31%) saturate(100%) hue-rotate(167deg) brightness(92%) contrast(89%);
    }

    @media (max-width: 1220px) {
        svg {
            display: none;
        }
    }
</style>
