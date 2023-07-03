<script lang="ts">
    import {updated} from "$app/stores";

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

    const patterns = ["border.png","bricks.png","circle.png","creeper.png","cross.png","curly_border.png","diagonal_left.png","diagonal_right.png","diagonal_up_left.png","diagonal_up_right.png","flower.png","globe.png","gradient.png","gradient_up.png","half_horizontal.png","half_horizontal_bottom.png","half_vertical.png","half_vertical_right.png","mojang.png","piglin.png","rhombus.png","skull.png","small_stripes.png","square_bottom_left.png","square_bottom_right.png","square_top_left.png","square_top_right.png","straight_cross.png","stripe_bottom.png","stripe_center.png","stripe_downleft.png","stripe_downright.png","stripe_left.png","stripe_middle.png","stripe_right.png","stripe_top.png","triangle_bottom.png","triangle_top.png","triangles_bottom.png","triangles_top.png"]
    const colors = ["FFFFFF","F9801D","C74EBD","3AB3DA","FED83D","80C71F","F38BAA","474F52","9D9D97","169C9C","8932B8","3C44AA","835432","5E7C16","B02E26","1E1B1B"]

    let bannerGive = ""
    let shieldGive = ""
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

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div class="w-full">
            <div class="">
                <img id={tabData[0].color} src="/banner/base.png" alt="Base" class="h-[400px] absolute">
                {#each tabData as layer, index}
                    {#if index !== 0 && layer.pattern}
                        <img id={layer.color} src="/banner/{layer.pattern}" alt="Layer" class="h-[400px] absolute">
                    {/if}
                {/each}
            </div>
        </div>
        <div>
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
    #FFFFFF { filter: brightness(0) saturate(100%) invert(99%) sepia(100%) saturate(0%) hue-rotate(169deg) brightness(106%) contrast(101%); }
    #F9801D { filter: brightness(0) saturate(100%) invert(52%) sepia(22%) saturate(2105%) hue-rotate(347deg) brightness(106%) contrast(95%); }
    #C74EBD { filter: brightness(0) saturate(100%) invert(50%) sepia(74%) saturate(1042%) hue-rotate(275deg) brightness(79%) contrast(95%); }
    #3AB3DA { filter: brightness(0) saturate(100%) invert(85%) sepia(28%) saturate(6415%) hue-rotate(161deg) brightness(89%) contrast(91%); }
    #FED83D { filter: brightness(0) saturate(100%) invert(95%) sepia(39%) saturate(6439%) hue-rotate(324deg) brightness(103%) contrast(99%); }
    #80C71F { filter: brightness(0) saturate(100%) invert(64%) sepia(79%) saturate(439%) hue-rotate(40deg) brightness(93%) contrast(94%); }
    #F38BAA { filter: brightness(0) saturate(100%) invert(64%) sepia(13%) saturate(1468%) hue-rotate(293deg) brightness(100%) contrast(91%); }
    #474F52 { filter: brightness(0) saturate(100%) invert(31%) sepia(3%) saturate(1274%) hue-rotate(151deg) brightness(90%) contrast(89%); }
    #9D9D97 { filter: brightness(0) saturate(100%) invert(81%) sepia(0%) saturate(6663%) hue-rotate(143deg) brightness(77%) contrast(90%); }
    #169C9C { filter: brightness(0) saturate(100%) invert(50%) sepia(54%) saturate(2764%) hue-rotate(145deg) brightness(87%) contrast(83%); }
    #8932B8 { filter: brightness(0) saturate(100%) invert(22%) sepia(62%) saturate(4222%) hue-rotate(272deg) brightness(78%) contrast(82%); }
    #3C44AA { filter: brightness(0) saturate(100%) invert(26%) sepia(14%) saturate(5949%) hue-rotate(212deg) brightness(99%) contrast(93%); }
    #835432 { filter: brightness(0) saturate(100%) invert(42%) sepia(7%) saturate(4810%) hue-rotate(342deg) brightness(71%) contrast(73%); }
    #5E7C16 { filter: brightness(0) saturate(100%) invert(40%) sepia(97%) saturate(369%) hue-rotate(36deg) brightness(88%) contrast(90%); }
    #B02E26 { filter: brightness(0) saturate(100%) invert(20%) sepia(89%) saturate(1439%) hue-rotate(337deg) brightness(103%) contrast(119%); }
    #1E1B1B { filter: brightness(0) saturate(100%) invert(6%) sepia(10%) saturate(454%) hue-rotate(314deg) brightness(92%) contrast(87%); }

    img {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }
</style>
