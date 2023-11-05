<svelte:head>
    <title>MC Utils</title>
    <meta content="MC Utils" property="og:title" />
    <meta content="MC Utils" property="og:site_name" />
    <meta content="The community powered one stop shop for Minecraft utilities supporting developers, builders & players." property="og:description" />
    <meta content="https://mcutils.com" property="og:url" />
    <meta content="https://mcutils.com/favicon.png" property="og:image" />
    <meta content="#2b2d31" data-react-helmet="true" name="theme-color" />
    <meta name="description" content="The community powered one stop shop for Minecraft utilities supporting developers, builders & players.">
    <meta name="keywords" content="mcutils, mc, utils, minecraft, server, spigot, paper, api, unicode, banner, colors, chat, gradient, inventory, slots, noteblock, skin">
    <link rel="icon" href="/favicon.png">
    <link rel="sitemap" href="/sitemap.xml" />
</svelte:head>

<script lang="ts">
    import type { LayoutData } from "./$types"
    import {onMount} from "svelte";

    export let data: LayoutData
    let selectedUtils = []

    function selectUtilities() {
        const currentDay = new Date().toLocaleDateString();
        const storedDay = localStorage.getItem('selectedDay');

        if (currentDay !== storedDay) {
            const numUtils = data.utils.length;
            const selectedIndices = [];

            while (selectedIndices.length < 6) {
                const randomIndex = Math.floor(Math.random() * numUtils);
                if (!selectedIndices.includes(randomIndex)) {
                    selectedIndices.push(randomIndex);
                }
            }

            selectedUtils = selectedIndices.map(index => data.utils[index]);

            localStorage.setItem('selectedDay', currentDay);
            localStorage.setItem('selectedUtils', JSON.stringify(selectedUtils));
        } else {
            selectedUtils = JSON.parse(localStorage.getItem('selectedUtils'));
        }
    }

    // Function to reset stored utilities at the start of each day
    function resetStoredUtilities() {
        const currentDay = new Date().toLocaleDateString();
        const storedDay = localStorage.getItem('selectedDay');

        if (currentDay !== storedDay) {
            localStorage.removeItem('selectedDay');
            localStorage.removeItem('selectedUtils');
        }
    }

    onMount(() => {
        // Call the function to reset stored utilities at the start of each day
        resetStoredUtilities();

        // Call the function to select utilities when the component is first rendered
        selectUtilities();
    })
</script>

<div class="flex flex-col w-full">
    <a href="https://github.com/flytegg/mcu-website/issues" aria-label='GitHub' target="_blank" class="bg-[#50282a] text-[#F55050] py-2 w-full text-center text-lg justify-center gap-1.5 hidden lg:flex">
        <p class="self-center">MC Utils is currently in beta! Please report <span class="underline decoration-dotted">issues or suggestions</span> on GitHub</p>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#F55050" class="self-center h-4 fill-[#F55050]"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
        <p class="ml-8">(Psst, bookmark this site)</p>
    </a>
    <div class="w-[85%] lg:w-[60%] m-auto">
        <div class="flex flex-col gap-3 mt-20 lg:mt-10">
            <img src="/img/logo.svg" alt="MC Utils Logo" class="h-20 self-center">
            <h1 class="text-[#3C414B] text-[27px] text-center leading-tight lg:w-[70%] w-[90%] mx-auto">
                The community powered one stop shop for Minecraft
                utilities supporting developers, builders & players.
            </h1>
        </div>
        <p class="font-medium text-white text-[20px] text-center mt-11">Popular Utils</p>
        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-center gap-5 mt-[3%]">
            {#each selectedUtils as util}
                <a href="/{util.path}" aria-label='{util.path}' class="bg-[#212227] rounded-2xl flex w-full py-3 px-7 gap-4 ">
                    <img src="/component/icon/{util.path}.svg" alt="" class="h-10 self-center">
                    <div class="flex flex-col">
                        <h2 class="text-[#AEB2BC] text-lg font-semibold">{util.name}</h2>
                        <p class="text-[#555D66] text-md">{@html util.shortDescription}</p>
                    </div>
                </a>
            {/each}
        </div>
        <div class="flex flex-col mt-11 gap-3">
            <p class="text-[#666C78] text-lg text-center">Join our community...</p>
            <a href="https://discord.gg/CGmMQwfXXN" target="_blank" aria-label='Discord' class="m-auto"><button class="bg-[#5865F2] hover:bg-[#7984F5] transition-colors rounded-2xl py-6 px-10 flex items-center">
                <img class="h-10" src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0b5493894cf60b300587_full_logo_white_RGB.svg" alt="">
            </a>
        </div>
        <div class="flex flex-col text-[#3C414B] text-[18px] mt-11 lg:w-[55%] w-[90%] mx-auto">
            <p class="text-center">This service is provided free by the passionate team at <a href="https://flyte.gg" aria-label='Flyte' target="_blank" class="underline decoration-dotted">Flyte</a>— and through our wonderful <a class="underline decoration-dotted" target="_blank" aria-label='GitHub' href="https://github.com/flytegg/mcu-website/issues">contributor community</a>.</p>
        </div>
    </div>
</div>
