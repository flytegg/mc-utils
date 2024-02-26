<script lang="ts">
    import logo from "$lib/image/logo.svg"
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
    {#await component()}
        <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
    {:then module}
        <h1 class="text-white font-bold text-[32px] lg:text-[40px] mt-20 lg:mt-10">{data.util.name}</h1>
        <h2 class="text-[#3C414B] text-[20px] lg:text-[24px] text-center mb-10">{@html data.util.description}</h2>
        <!-- TODO: how the fuck do i type this shit -->
        <svelte:component this={module.default} />
    {/await}
{:else}
    <div class="flex flex-col items-center m-16 justify-between h-full">
        <div class="flex flex-col items-center gap-y-12">
            <img src={logo} alt="MC Utils Logo" class="h-20">
            <h1 class="text-white/60 text-xl">Erm we don't know about that one...</h1>
        </div>
        <div class="flex flex-col items-center gap-y-1">
            <h1 class="text-white font-extrabold text-7xl">404</h1>
            <p class="text-white/40 text-lg">/{data.path}</p>
        </div>
        <button class="button">Go back home</button>
    </div>
{/if}
