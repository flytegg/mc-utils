<script lang="ts">
    import "../app.css"

    import { SvelteToast } from '@zerodevx/svelte-toast'

    import type { LayoutData } from "./$types"
    export let data: LayoutData

    import { Favourites, UtilList } from "$lib/store"
    import { onMount } from "svelte";

    import logo from "$lib/image/logo.svg"
    import Search from "$lib/image/Search.svelte"

    UtilList.set(data.utils)

    let currentUrl = "";

    // Load favourites from cookies on page load
    onMount(() => {
        currentUrl = window.location.pathname.substring(1);

        const cookies = document.cookie.split(";")
        let favourites: string[] = []
        for (const i in cookies) {
            if (cookies[i].includes("mcu-favourites=")) favourites = cookies[i].split("=")[1].split("//")
        }
        Favourites.set(favouriteUtilsFromArray(favourites))
        UtilList.set(data.utils.filter((util: { path: string }) => !favourites.includes(util.path)))
    })

    const updateFavourites = (path: string) => {
        const cookies = document.cookie.split(";")
        let favourites: string[] = []
        for (const i in cookies) {
            if (cookies[i].includes("mcu-favourites=")) favourites = cookies[i].split("=")[1].split("//")
        }

        if (favourites.includes(path)) {
            const index = favourites.indexOf(path)
            favourites.splice(index, 1) // Remove from array 
        } else {
            favourites.push(path)
        }

        Favourites.set(favouriteUtilsFromArray(favourites))
        UtilList.set(data.utils.filter((util: { path: string }) => !favourites.includes(util.path)))

        const date = new Date()
        date.setTime(date.getTime() + 360 * 24 * 60 * 60 * 1000) // Add 360 days
        document.cookie = `mcu-favourites=${favourites.join("//")};Expires=${date.toUTCString()};Secure;SameSite=Lax;Path=/`
    }

    const favouriteUtilsFromArray = (favourites: string[]) => {
        return data.utils.filter((util: { path: string }) => favourites.includes(util.path))
    }

    const filterUtils = (query: string) => {
        UtilList.set(data.utils.filter((util: { name: string }) => util.name.toLowerCase().includes(query.toLowerCase())))
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") filterUtils(searchValue)
    }

    const handleInput = () => {
        filterUtils(searchValue)
    }

    let navShown = false
</script>

<button on:click={() => navShown = !navShown} class="lg:hidden absolute top-8 left-8 {navShown ? '' : ''}">
    <img src="/icon/{navShown ? 'x.svg' : 'hamburger.svg'}" alt="Hamburger" class="h-7">
</button>

<div class="flex lg:flex-row flex-col">
    <div class="{navShown ? 'block' : 'hidden'} lg:block lg:sticky lg:left-0 lg:top-0 lg:h-screen lg:min-w-[22rem] lg:max-w-[22rem] lg:min-h-screen">
        <div class="flex flex-col h-full pl-6 border-r-white/10 border-r">
            <div class="flex w-full items-center flex-col space-y-6 my-6 pr-6">
                <a href="/" on:click={() => currentUrl = "/"} aria-label='Home'><img src={logo} alt="" class="h-10"></a>
                <div class="search">
                    <span><Search /></span>
                    <input bind:value={searchValue} on:input={handleInput} type="text" placeholder="Search for a utility" on:keypress={handleKeyPress} on:blur={handleInput}>
                </div>
            </div>
            <div data-sveltekit-reload class="overflow-y-scroll flex flex-col gap-y-5 mb-7">
                {#if $Favourites.length > 0}
                    <div class="flex flex-col gap-y-5">
                        {#each $Favourites as util}
                            <div class="flex items-center justify-between ">
                                <a href="{util.path}" aria-label='{util.path}' class="flex items-center gap-x-4 {util.path === currentUrl ? "opacity-100" : "opacity-80"}">
                                    <img src="/component/icon/{util.path}.svg" alt="" class="h-7 w-7">
                                    <h2 class="text-white font-semibold text-base">{util.name}</h2>
                                </a>
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <svg class="w-4 h-4 mr-6 fill-[#FF5B5B] cursor-pointer hover:scale-110 transition-transform duration-200" on:click={() => updateFavourites(util.path)} viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                            </div>
                        {/each}
                    </div>
                {/if}
                <div class="flex flex-col gap-y-5">
                    {#each $UtilList as util}
                        <div class="flex items-center justify-between">
                            <a href="{util.path}" aria-label='{util.path}' class="flex items-center gap-x-4 {util.path === currentUrl ? "opacity-100" : "opacity-80"}">
                                <img src="/component/icon/{util.path}.svg" alt="" class="h-7 w-7">
                                <h2 class="text-white font-semibold text-base">{util.name}</h2>
                            </a>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <svg class="w-4 h-4 mr-6 fill-white/80 hover:fill-[#FF5B5B] cursor-pointer hover:scale-110 transition-transform duration-200" on:click={() => updateFavourites(util.path)} viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col w-full justify-between">
        <div class="flex flex-col w-full items-center">
            <slot/>
        </div>
        <div class="flex w-full justify-center items-center relative my-8">
            <p class="text-white/50">This service is provided free by the passionate team at <a href="https://flyte.gg" aria-label='Flyte' target="_blank" class="underline underline-offset-2">Flyte</a> — and through our wonderful <a class="underline underline-offset-2" target="_blank" aria-label='GitHub' href="https://github.com/flytegg/mcu-website/issues">contributor community</a>.</p>
            <a href="https://discord.gg/flyte" target="_blank" class="absolute right-6 bg-[#767ADE]/20 border-[#767ADE] border-[1.5px] rounded-xl px-4 py-3">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6629 2.61392C19.6565 2.6018 19.6458 2.59246 19.6329 2.58767C18.2043 1.9321 16.6968 1.46445 15.1479 1.19642C15.134 1.19387 15.1196 1.19575 15.1069 1.20181C15.0941 1.20787 15.0835 1.21779 15.0767 1.23017C14.8712 1.60303 14.6848 1.98601 14.5179 2.37767C12.8475 2.12412 11.1484 2.12412 9.47793 2.37767C9.31042 1.98505 9.12138 1.60196 8.91168 1.23017C8.90444 1.21816 8.89382 1.20854 8.88114 1.20254C8.86847 1.19654 8.85431 1.19441 8.84043 1.19642C7.2889 1.46325 5.77871 1.93093 4.34793 2.58767C4.33538 2.59299 4.32486 2.60219 4.31793 2.61392C1.46043 6.88517 0.676676 11.0477 1.05918 15.1614C1.06026 15.1718 1.06349 15.1818 1.06865 15.1908C1.07382 15.1999 1.08081 15.2077 1.08918 15.2139C2.75367 16.4451 4.61512 17.3847 6.59418 17.9927C6.6084 17.9971 6.62364 17.9969 6.63777 17.9922C6.65189 17.9875 6.66419 17.9785 6.67293 17.9664C7.09755 17.3884 7.47382 16.7763 7.79793 16.1364C7.80224 16.1276 7.80469 16.118 7.80513 16.1082C7.80556 16.0984 7.80397 16.0886 7.80045 16.0795C7.79693 16.0703 7.79156 16.062 7.78467 16.055C7.77778 16.048 7.76953 16.0426 7.76043 16.0389C7.16587 15.8111 6.59032 15.5365 6.03918 15.2177C6.02944 15.2117 6.02127 15.2035 6.01537 15.1937C6.00947 15.1839 6.00601 15.1729 6.00528 15.1615C6.00454 15.1501 6.00655 15.1387 6.01115 15.1282C6.01574 15.1178 6.02278 15.1086 6.03168 15.1014C6.14793 15.0152 6.26418 14.9252 6.37293 14.8352C6.38252 14.8267 6.39431 14.8212 6.40692 14.8192C6.41953 14.8172 6.43245 14.8189 6.44418 14.8239C10.0517 16.4702 13.9592 16.4702 17.5254 14.8239C17.5368 14.8184 17.5495 14.8161 17.5621 14.8174C17.5747 14.8188 17.5867 14.8236 17.5967 14.8314C17.7054 14.9214 17.8217 15.0152 17.9379 15.1014C17.9468 15.1086 17.9539 15.1178 17.9585 15.1282C17.963 15.1387 17.9651 15.1501 17.9643 15.1615C17.9636 15.1729 17.9601 15.1839 17.9542 15.1937C17.9483 15.2035 17.9402 15.2117 17.9304 15.2177C17.3807 15.5381 16.8049 15.8116 16.2092 16.0352C16.2001 16.0388 16.1918 16.0443 16.1849 16.0513C16.178 16.0583 16.1727 16.0666 16.1692 16.0757C16.1656 16.0849 16.164 16.0947 16.1645 16.1045C16.1649 16.1143 16.1674 16.1239 16.1717 16.1327C16.5014 16.7693 16.8774 17.381 17.2967 17.9627C17.3054 17.9747 17.3177 17.9837 17.3318 17.9884C17.346 17.9932 17.3612 17.9933 17.3754 17.9889C19.3602 17.3837 21.227 16.4439 22.8954 15.2102C22.904 15.2042 22.9111 15.1963 22.9163 15.1873C22.9215 15.1782 22.9246 15.1681 22.9254 15.1577C23.3829 10.4064 22.1529 6.27767 19.6629 2.61392ZM8.33793 12.6564C7.25043 12.6564 6.35793 11.6589 6.35793 10.4364C6.35793 9.21392 7.23543 8.21267 8.33793 8.21267C9.45168 8.21267 10.3367 9.21767 10.3179 10.4327C10.3179 11.6589 9.44043 12.6564 8.33793 12.6564ZM15.6654 12.6564C14.5779 12.6564 13.6854 11.6589 13.6854 10.4364C13.6854 9.21392 14.5592 8.21267 15.6654 8.21267C16.7792 8.21267 17.6642 9.21767 17.6454 10.4327C17.6454 11.6589 16.7754 12.6564 15.6654 12.6564Z" fill="#767ADE"/>
                </svg>
            </a>
        </div>
    </div>
</div>

<style>
    ::-webkit-scrollbar{
        width: 7px;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #0B0B0C;
    }
</style>

<SvelteToast />
