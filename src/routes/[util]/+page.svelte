<script lang="ts">
    import type { PageData } from './$types'
    export let data: PageData

    const components = import.meta.glob(`/src/lib/component/util/*.svelte`)
    const component = components[`/src/lib/component/util/${data.util.path}.svelte`]
</script>

<svelte:head>
    <title>{data.util.name ? data.util.name : "Not Found"} | MC Utils</title>
    <meta content="MC Utils" property="og:site_name" />
    <meta content="{data.util.name ? data.util.name : 'Not Found'} (MC Utils)" property="og:title" />
    <meta content="{data.util.seoDescription ? data.util.seoDescription : ''}" property="og:description" />
    <meta content="https://mcutils.com" property="og:url" />
    <meta content="https://mcutils.com/favicon.png" property="og:image" />
    <meta content="#2b2d31" data-react-helmet="true" name="theme-color" />
    <meta name="description" content="{data.util.seoDescription}">
    <meta name="keywords" content="mcutils, mc, utils, minecraft, server, spigot, paper, api, unicode, banner, colors, chat, gradient, inventory, slots, noteblock, skin">
    <link rel="icon" href="/favicon.png">
    <link rel="sitemap" href="/sitemap.xml" />
</svelte:head>


{#if data.status === 200}
    <a href="https://github.com/flytegg/mcu-website/issues" aria-label='GitHub' target="_blank" class="bg-[#50282a] text-[#F55050] py-2 w-full text-center text-lg justify-center gap-1.5 hidden lg:flex">
        <p class="self-center">MC Utils is currently in beta! Please report <span class="underline decoration-dotted">issues or suggestions</span> on GitHub</p>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#F55050" class="self-center h-4 fill-[#F55050]"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
        <p class="ml-8">(Psst, bookmark this site)</p>
    </a>
    {#await component()}
        <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
    {:then module}
        <h1 class="text-white font-bold text-[32px] lg:text-[40px] mt-20 lg:mt-10">{data.util.name}</h1>
        <h2 class="text-[#3C414B] text-[20px] lg:text-[24px] text-center mb-10">{@html data.util.description}</h2>
        <!-- TODO: how the fuck do i type this shit -->
        <svelte:component this={module.default} />
    {/await}
{:else}
    <div class="flex flex-col w-full">
        <a href="https://github.com/flytegg/mcu-website/issues" aria-label='GitHub' target="_blank" class="bg-[#50282a] text-[#F55050] py-2 w-full text-center text-lg justify-center gap-1.5 hidden lg:flex">
            <p class="self-center">MC Utils is currently in beta! Please report <span class="underline decoration-dotted">issues or suggestions</span> on GitHub</p>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#F55050" class="self-center h-4 fill-[#F55050]"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
            <p class="ml-8">(Psst, bookmark this site)</p>
        </a>
        <div class="lg:w-[60%] w-[85%] m-auto">
            <div class="flex flex-col gap-3 mt-20 lg:mt-10">
                <img src="/img/logo.svg" alt="MC Utils Logo" class="h-20 self-center">
                <h1 class="text-[#666C78] text-[27px] text-center leading-tight">Uhhhh, that one’s on you...</h1>
            </div>
            <div class="text-center mt-11 flex flex-col gap-2">
                <h1 class="text-6xl text-[#474c54] font-black tracking-wider">404</h1>
                <p class="text-[#666C78] text-3xl">There's no such util here.</p>
            </div>
            <div class="flex flex-col mt-11 gap-3">
                <p class="text-[#666C78] text-lg text-center">Think we’re missing out? Join our Discord and let us know!</p>
                <a href="https://discord.gg/CGmMQwfXXN" target="_blank" aria-label='Discord' class="m-auto"><button class="bg-[#5865F2] hover:bg-[#7984F5] transition-colors rounded-2xl py-6 px-10 flex items-center">
                    <img class="h-10" src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0b5493894cf60b300587_full_logo_white_RGB.svg" alt="">
                </a>
            </div>
        </div>
    </div>
{/if}
