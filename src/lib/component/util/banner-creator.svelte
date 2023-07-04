<script lang="ts">
    let activeTab = 0;
    const tabData = [
        {
            name: "Base",
            pattern: "N/A",
            color: "#FFFFFF"
        },
        {
            name: "Layer 1",
            pattern: "",
            color: ""
        },
        {
            name: "Layer 2",
            pattern: "",
            color: ""
        },
        {
            name: "Layer 3",
            pattern: "",
            color: ""
        },
        {
            name: "Layer 4",
            pattern: "",
            color: ""
        },
        {
            name: "Layer 5",
            pattern: "",
            color: ""
        },
        {
            name: "Layer 6",
            pattern: "",
            color: ""
        },
    ];

    const patterns = ["border.svg","bricks.svg","circle.svg","creeper.svg","cross.svg","curly_border.svg","diagonal_left.svg","diagonal_right.svg","diagonal_up_left.svg","diagonal_up_right.svg","flower.svg","globe.svg","gradient.svg","gradient_up.svg","half_horizontal.svg","half_horizontal_bottom.svg","half_vertical.svg","half_vertical_right.svg","mojang.svg","piglin.svg","rhombus.svg","skull.svg","small_stripes.svg","square_bottom_left.svg","square_bottom_right.svg","square_top_left.svg","square_top_right.svg","straight_cross.svg","stripe_bottom.svg","stripe_center.svg","stripe_downleft.svg","stripe_downright.svg","stripe_left.svg","stripe_middle.svg","stripe_right.svg","stripe_top.svg","triangle_bottom.svg","triangle_top.svg","triangles_bottom.svg","triangles_top.svg"]
    const colors = ["FFFFFF","F9801D","C74EBD","3AB3DA","FED83D","80C71F","F38BAA","474F52","9D9D97","169C9C","8932B8","3C44AA","835432","5E7C16","B02E26","1E1B1B"]

    let bannerGive = ""
    let shieldGive = ""
    let spigot = ""
    let link = ""

    function setPattern(pattern) {
        tabData[activeTab].pattern = pattern
        updateOutput()
    }

    function setColor(color) {
        tabData[activeTab].color = color
        updateOutput()
    }

    function updateOutput() {
        bannerGive = ""
        shieldGive = ""
        link = ""
    }
</script>

<main class="w-[90%] lg:w-[60%] ">
    <div class="tab-system w-[100%] flex flex-col ">
        <div class="self-center grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-7 gap-2">
            {#each tabData as tab, index}
                <button class="button px-4 py-2 rounded focus:outline-none"
                        class:bg-gray-200={index === activeTab}
                        on:click={() => activeTab = index}>
                    {tab.name}
                </button>
            {/each}
        </div>
    </div>

    {#if activeTab !== 0}
        <div class="flex flex-wrap gap-1 justify-center mt-4">
            {#each patterns as pattern}
                <button on:click={() => setPattern(pattern)}>
                    <img src="/banner/{pattern}" alt={`Pattern`} class="w-8 border-[1px] border-white"/>
                </button>
            {/each}
        </div>
    {/if}
    <div class="flex flex-wrap gap-1 justify-center mt-4">
        {#each colors as color}
            <button on:click={() => setColor(color)}>
                <div class="h-11 w-11 rounded-xl border-[1px] border-white" style="background-color: #{color}"></div>
            </button>
        {/each}
    </div>

    <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-5">Preview</h3>

    <div class="grid grid-cols-1 xl:flex xl:flex-wrap w-full gap-12">
        <div class="w-[223px] h-[418px] mx-auto">
            <div class="">
                <img src="/banner/base.svg" alt="Base" class="w-[223px] h-[418px] absolute fill-[#{tabData[0].color}]">
                {#each tabData as layer, index}
                    {#if index !== 0 && layer.pattern}
                        <img src="/banner/{layer.pattern}" alt="Layer" class="w-[223px] h-[418px] absolute fill-[#{layer.color}]">
                    {/if}
                {/each}
            </div>
        </div>
        <div class="w-full min-w-[10px] flex-1">
            <div class="flex flex-col">
                <h3 class="font-medium text-white text-20px text-left">Banner Give Command</h3>
                <div class="flex gap-3 mt-2">
                    <input bind:value={bannerGive} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Shield Give Command</h3>
                <div class="flex gap-3 mt-2">
                    <input bind:value={shieldGive} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Spigot API Code</h3>
                <div class="flex gap-3 mt-2">
                    <input bind:value={shieldGive} class=" inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[105px] w-[100%] max-w-[100%] overflow-y-scroll">
                    <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Unique Banner Link</h3>
                <div class="flex gap-3 mt-2">
                    <input bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
        </div>
    </div>

</main>

<style>
    img {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }
</style>
