<script lang="ts">
    import items from "$lib/items.json"

    let searchResults: Item[] = items

    type Item = {
        newID: string,
        legacyID: string,
        name: string,
        stackSize: number,
        texture: string
    }

    const updateSearch = async (query: string) => {
        const lowercase = query.toLowerCase()
        searchResults = items.filter(item => { return item.name.toLowerCase().replace(" ", "").includes(lowercase) })
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSearch(searchValue)
    }

    const handleInput = () => {
        updateSearch(searchValue)
    }
</script>

<div class="search w-fit h-10 text-md">
    <img src="/icon/search.svg" alt="Search Icon" class="h-5">
    <input on:keypress={handleKeyPress} on:blur={handleInput} bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter item name..." class="w-full pt-0.5 pr-0.5 justify-center items-center self-center">
</div>
<table class="w-[90%] md:w-[80%] lg:w-[60%] mt-12 table-fixed">
    <tr class="text-[#9d9d9e] font-medium">
        <th class="p-2 pl-6 w-0 pr-2"></th>
        <td class="p-2 pr-4 border-b-[1.5px] border-b-[#232324]">Display Name</td>
        <td class="text-left pr-4 border-b-[1.5px] border-b-[#232324]">ID (1.13+)</td>
        <td class="text-left pr-4 w-[24%] border-b-[1.5px] border-b-[#232324]">Legacy ID (1.12-)</td>
        <td class="text-left pr-3 w-[15%] border-b-[1.5px] border-b-[#232324]">Stack Size</td>
    </tr>

    {#each searchResults as item}
        <tr class="text-[#cecece]">
            <td class="lg:ml-6 p-1.5 ">
                {#if item.texture}
                    <img src={item.texture} alt="{item.name} Icon" class="h-5 w-5">
                {/if}
            </td>
            <td class="p-2 border-b-[1px] border-b-[#232324]">{item.name}</td>
            <td class="break-all border-b-[1px] border-b-[#232324]">{item.newID}</td>
            <td class="border-b-[1px] border-b-[#232324]">
                {#if item.legacyID}
                    {item.legacyID}
                {/if}
            </td>
            <td class="border-b-[1px] border-b-[#232324]">{item.stackSize}</td>
        </tr>
    {/each}
</table>

