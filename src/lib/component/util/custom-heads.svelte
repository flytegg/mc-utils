<script lang="ts">
    import {onMount} from "svelte";
    import {toast} from "@zerodevx/svelte-toast";

    enum Category {
        ALL = "All",
        BLOCKS = "Blocks",
        CHARACTERS = "Characters",
        CHRISTMAS = "Christmas",
        ELECTRONICS = "Electronics",
        FLAGS = "Flags",
        FOOD = "Food",
        HALLOWEEN = "Halloween",
        LETTERS = "Letters",
        YOUTUBERS = "YouTubers"
    }

    type Head = {
        name: string,
        uuid: string,
        headUrl: string,
        category: string,
        command: string
    }

    let totalHeads: Head[] = []
    let heads: Head[] = []

    async function fetchHeads() {
        const apiUrl = `/api/heads/category/all`

        const response = await fetch(apiUrl, {
            mode: "cors"
        })
        const jsonResponse = await response.json();
    
        try {
            totalHeads = jsonResponse.heads
            heads = totalHeads.slice(0, 20)
        } catch(error) {
            console.error(error)
        }
    }

   const loadCategory = async (category: Category) => {
        searchValue = ""
        if (category === Category.ALL) {
            heads = totalHeads.slice(0, 20)
            return
        }
        heads = totalHeads.filter((head) => head.category === category.toLocaleLowerCase()).slice(0, 20)
   }

    onMount(fetchHeads)

    const updateSearch = async (query: string) => {
        heads = totalHeads.filter((head) => head.name.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSearch(searchValue)
    }

    const handleInput = () => {
        updateSearch(searchValue)
    }

    const loadMore = () => {
        if (searchValue !== undefined || searchValue !== "") {
            heads = totalHeads.filter((head) => head.name.toLowerCase().includes(searchValue.toLowerCase())).slice(0, heads.length + 20)
            return
        }

        const category = heads[0].category // seems a little bit cheesy, but is the simplest way to do it, and it works
        heads = totalHeads.filter((head) => head.category === category.toLocaleLowerCase()).slice(0, heads.length + 20)
    }

    async function copyCommand(head: Head) {
        await navigator.clipboard.writeText(head.command)
        toast.push('Command copied to clipboard!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }
</script>

<input class="search w-[26rem] mb-4" bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter head name..." on:keypress={handleKeyPress} on:blur={handleInput}>

<div class="flex list-none text-[#cecece] mb-8">
    {#each Object.values(Category) as category}
        <button on:click={() => loadCategory(category)} class="button px-4 py-2 mr-2 mt-2 rounded focus:outline-none">{category}</button>
    {/each}
</div>

<div class="grid grid-cols-5 gap-16 text-[#cecece]">
    {#each heads as head}
        <div class="flex flex-col space-y-2 justify-center items-center">
            <p class="max-w-32 text-center font-semibold">{head.name}</p>

            <img class="mx-auto" src="https://headdb.org/img/renders/{head.uuid}.png" alt="head">

            <div class="flex">
                <p>Copy Command</p>
                <button on:click={() => copyCommand(head)}>
                    <svg class="fill-[#626875] pl-4 h-5" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                </button>
            </div>
        </div>
    {/each}
</div>

<button class="button mx-auto mt-8" on:click={() => loadMore()}>Load More</button>

<a class="flex gap-2 mt-10" href="https://headdb.com/" aria-label='Website' target="_blank">
    <p class="text-[#cecece] text-md">See the HeadDB Website</p>
    <img src="/icon/new-tab.svg" alt="New Tab Icon" class="justify-center">
</a>