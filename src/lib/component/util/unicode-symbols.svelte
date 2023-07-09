<script lang="ts">
    let activeTab = 0;
    const tabData = [
        {
            name: "1.20+",
            symbols: 'Text',
        },
        {
            name: "1.13+",
            symbols: 'Text',
        },
        {
            name: "1.13-",
            symbols: 'Text',
        }
    ];
</script>

<main class="w-[90%] lg:w-[60%] ">
    <div class="tab-system w-[100%] flex flex-col ">
        <div class="self-center grid lg:grid-cols-3 gap-2">
            {#each tabData as tab, index}
                <button class="button px-4 py-2 rounded focus:outline-none"
                        class:bg-gray-200={index === activeTab}
                        on:click={() => activeTab = index}>
                    {tab.name}
                </button>
            {/each}
        </div>
    </div>

    <p class="text-lg text-gray-400 mt-6 rounded-md p-2 bg-[#141517] w-[100%] whitespace-pre-wrap break-all not-emoji">
        {tabData[activeTab].symbols}
    </p>
</main>

<style>
    .not-emoji {
        font-family: "Segoe UI Symbol", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 19px;
        line-height: 1.4; /* Adjust the line height as needed */
    }
</style>