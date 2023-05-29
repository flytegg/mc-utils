<script lang="ts">
    import "../app.css"
    
    import type { LayoutData } from "./$types"
    export let data: LayoutData

	import Search from "$lib/component/element/Search.svelte"
    import { UtilList } from "$lib/store"

    UtilList.set(data.utils)

    const filterUtils = (query: string) => {
        UtilList.set(data.utils.filter((util: { name: string }) => util.name.toLowerCase().includes(query.toLowerCase())))
    }
</script>

<div class="flex">
    <div class="bg-[#1D1F24] min-w-[20rem] min-h-screen px-4 flex flex-col space-y-8">
        <div class="flex w-full items-center flex-col space-y-4 mt-10">
            <a href="/"><img src="/img/logo.png" alt="MC Utils Logo" class="h-11"></a>
            <Search placeholder="What are you looking for?" search={(query) => filterUtils(query)} instant={true}/>
        </div>
        <div data-sveltekit-reload class="flex flex-col space-y-1">
            {#each $UtilList as util}
                <a href="{util.path}" class="flex space-x-4">
                    <img src="/src/lib/component/util/icon/{util.path}.png" alt="" class="h-10 self-center">
                    <div class="flex flex-col">
                        <h2 class="text-[#AEB2BC] font-semibold text-[20px]">{util.name}</h2>
                        <p class="text-[#3C414B]">{util.shortDescription}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
    <div class="flex flex-col justify-start items-center w-full">
        <slot/>
    </div>
</div>
