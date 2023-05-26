<script lang="ts">
    export let placeholder = ""
    export let search: (query: string) => void
    export let classes = ""
    export let instant = false
    export let disabled = false

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") handleSearch()
    }

    const handleInput = () => {
        if (instant) handleSearch()
    }

    const handleSearch = () => {
        if (!disabled) search(searchValue)
    }
</script>

<div class="flex text-xl border-[2px] rounded-3xl border-[#626875] text-[#626875] items-center px-6 py-2 {classes}">
    <svg class="w-5 h-5 fill-[#626875]" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"/></svg>
    {#if disabled}
        <input disabled bind:value={searchValue} type="text" placeholder={placeholder} class="bg-transparent -mt-1 placeholder-[#626875] focus:outline-none">
    {:else}
        <input bind:value={searchValue} on:input={handleInput} type="text" placeholder={placeholder} class="bg-transparent -mt-1 placeholder-[#626875] focus:outline-none" on:keypress={handleKeyPress} on:blur={handleSearch}>
    {/if}
</div>