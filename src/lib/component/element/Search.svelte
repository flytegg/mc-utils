<script lang="ts">
    import searchIcon from "$lib/icon/search.svg"

    export let placeholder = ""
    export let search: (query: string) => void
    export let instant = false

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") handleSearch()
    }

    const handleInput = () => {
        if (instant) handleSearch()
    }

    const handleSearch = () => {
        search(searchValue)
    }
</script>

<div class="flex text-xl font-d border-[2px] rounded-3xl border-[#626875] text-[#626875] items-center gap-3 px-6 py-2">
    <img src={searchIcon} alt="Search" class="h-5">
    <input bind:value={searchValue} on:input={handleInput} id="search" type="text" placeholder={placeholder} class="bg-transparent placeholder-[#626875] focus:outline-none" on:keypress={handleKeyPress} on:blur={handleSearch}>
</div>