<svelte:head>
    <title>MC Utils</title>
    <meta content="MC Utils" property="og:title" />
    <meta content="MC Utils" property="og:site_name" />
    <meta content="Minecraft tools for server admins, developers, and players. Download server jars, view item IDs, steal skins and capes, view inventory slot IDs, generate banners and fireworks, get color codes and more." property="og:description" />
    <meta content="https://mcutils.com" property="og:url" />
    <meta content="https://mcutils.com/favicon.png" property="og:image" />
    <meta content="#2b2d31" data-react-helmet="true" name="theme-color" />
    <meta name="description" content="Minecraft tools for server admins, developers, and players. Download server jars, view item IDs, steal skins and capes, view inventory slot IDs, generate banners and fireworks, get color codes and more.">
    <meta name="keywords" content="mcutils, mc, utils, minecraft, server, spigot, paper, api, unicode, banner, colors, chat, gradient, inventory, slots, noteblock, skin">
    <link rel="icon" href="/favicon.png">
    <link rel="sitemap" href="/sitemap.xml" />
</svelte:head>

<script lang="ts">
    import type { LayoutData } from "./$types"
    import { onMount } from "svelte";
    import logo from "$lib/image/logo.svg"

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

<div class="flex flex-col items-center mt-16 mx-6 sm:mx-8 md:mx-14">
    <div class="flex flex-col items-center gap-y-10">
        <img src={logo} alt="MC Utils Logo" class="h-20">
        <h1 class="text-white/60 text-xl text-center">Community powered Minecraft utilities for developers, builders and players.</h1>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 justify-center gap-5 mt-[5%]">
        {#each selectedUtils as util}
            <a href="/{util.path}" aria-label='{util.path}' class="border-[#212227] border-2 rounded-2xl flex w-full py-3 px-7 gap-4 ">
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between">
                        <div class="flex gap-4">
                            <img src="/component/icon/{util.path}.svg" alt="" class="h-7 self-center">
                            <h2 class="text-[#AEB2BC] text-lg font-semibold">{util.name}</h2>
                        </div>
                        <!-- heart icons -->
                    </div>
                    <p class="text-[#555D66] text-md">{@html util.shortDescription}</p>
                 </div>
            </a>
        {/each}
    </div>
</div>
