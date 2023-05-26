<script lang="ts">
    import "../app.css"
    
    import type { LayoutData } from "./$types"
    export let data: LayoutData

	import Search from "$lib/component/element/Search.svelte"
    import { UtilList } from "$lib/store";

    UtilList.set(data.utils)

    const filterUtils = (query: string) => {
        UtilList.set(data.utils.filter((util: { name: string; }) => util.name.toLowerCase().includes(query.toLowerCase())))
    }
</script>

<div class="flex">
    <div class="bg-[#1D1F24] min-w-[20rem] min-h-screen">
        <div class="flex w-full items-center flex-col space-y-4">
            <h1 class="text-white text-4xl font-bold">MC Utils</h1>
            <Search placeholder="What are you looking for?" search={(query) => filterUtils(query)} instant={true} />
        </div>
        <div>
            {#each $UtilList as util}
                <a href="/{util.path}" class="flex space-x-4">
                    <img src="{util.icon}" alt="">
                    <div class="flex flex-col">
                        <h2 class="text-[#AEB2BC]">{util.name}</h2>
                        <p class="text-[#3C414B]">{util.description}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
    <div class="flex flex-col justify-start items-center w-full">
        <slot/>
    </div>
</div>
