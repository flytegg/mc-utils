<script>
    export let placeholder = "";
    export let text = "";
    export let onSearch;
    let query = "";

    const handleSearch = () => {
        if (query) {
            onSearch(query);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
</script>

<div class="flex text-xl font-d border-[2px] rounded-3xl py-2 px-4 border-[#626875] text-[#626875] items-center gap-3 px-6 py-2">
    <img src="/icon/search.svg" alt="Search" class="h-5">
    <input type="text" placeholder={placeholder} value={query} class="bg-transparent placeholder-[#626875] focus:outline-none" on:keydown={handleKeyPress} on:blur={handleSearch}>
</div>