<script lang="ts">
    let activeTab = 0;
    const tabData = [
        {
            name: "Base",
            pattern: "N/A",
            color: "FFFFFF"
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

    const patterns = [
        "bs", "bl", "gru", "bts", "br", "drs", "dls", "bo", "cbo", "bt", "ts", "tl",
        "tr", "tts", "cre", "sc", "ms", "bri", "flo", "glb", "gra", "tt", "mr", "cs",
        "ls", "rs", "ss", "rud", "lud", "ld", "rd", "hh", "hhb", "vh", "vhr", "mc",
        "cr", "sku", "pig", "moj"
    ];


    const colors = [
        {
            name: "white",
            code: "0",
            hex: "FFFFFF",
            filter: "filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(1%) hue-rotate(186deg) brightness(104%) contrast(101%);"
        },
        {
            name: "orange",
            code: "1",
            hex: "F9801D",
            filter: "filter: brightness(0) saturate(100%) invert(59%) sepia(61%) saturate(2896%) hue-rotate(348deg) brightness(101%) contrast(95%);"
        },
        {
            name: "magenta",
            code: "2",
            hex: "C74EBD",
            filter: "filter: brightness(0) saturate(100%) invert(49%) sepia(22%) saturate(3334%) hue-rotate(275deg) brightness(82%) contrast(86%);"
        },
        {
            name: "light_blue",
            code: "3",
            hex: "3AB3DA",
            filter: "filter: brightness(0) saturate(100%) invert(70%) sepia(10%) saturate(3501%) hue-rotate(159deg) brightness(91%) contrast(86%);"
        },
        {
            name: "yellow",
            code: "4",
            hex: "FED83D",
            filter: "filter: brightness(0) saturate(100%) invert(100%) sepia(45%) saturate(3901%) hue-rotate(324deg) brightness(103%) contrast(99%);"
        },
        {
            name: "lime",
            code: "5",
            hex: "80C71F",
            filter: "filter: brightness(0) saturate(100%) invert(67%) sepia(91%) saturate(403%) hue-rotate(37deg) brightness(89%) contrast(94%);"
        },
        {
            name: "pink",
            code: "6",
            hex: "F38BAA",
            filter: "filter: brightness(0) saturate(100%) invert(84%) sepia(19%) saturate(3821%) hue-rotate(292deg) brightness(99%) contrast(92%);"
        },
        {
            name: "gray",
            code: "7",
            hex: "474F52",
            filter: "filter: brightness(0) saturate(100%) invert(29%) sepia(9%) saturate(427%) hue-rotate(151deg) brightness(94%) contrast(90%);"
        },
        {
            name: "light_gray",
            code: "8",
            hex: "9D9D97",
            filter: "filter: brightness(0) saturate(100%) invert(66%) sepia(0%) saturate(0%) hue-rotate(107deg) brightness(92%) contrast(98%);"
        },
        {
            name: "cyan",
            code: "9",
            hex: "169C9C",
            filter: "filter: brightness(0) saturate(100%) invert(47%) sepia(98%) saturate(363%) hue-rotate(131deg) brightness(88%) contrast(94%);"
        },
        {
            name: "purple",
            code: "10",
            hex: "8932B8",
            filter: "filter: brightness(0) saturate(100%) invert(26%) sepia(73%) saturate(2155%) hue-rotate(263deg) brightness(83%) contrast(95%);"
        },
        {
            name: "blue",
            code: "11",
            hex: "3C44AA",
            filter: "filter: brightness(0) saturate(100%) invert(22%) sepia(83%) saturate(1389%) hue-rotate(218deg) brightness(97%) contrast(93%);"
        },
        {
            name: "brown",
            code: "12",
            hex: "835432",
            filter: "filter: brightness(0) saturate(100%) invert(31%) sepia(17%) saturate(1524%) hue-rotate(342deg) brightness(103%) contrast(85%);"
        },
        {
            name: "green",
            code: "13",
            hex: "5E7C16",
            filter: "filter: brightness(0) saturate(100%) invert(35%) sepia(94%) saturate(554%) hue-rotate(38deg) brightness(96%) contrast(83%);"
        },
        {
            name: "red",
            code: "14",
            hex: "B02E26",
            filter: "filter: brightness(0) saturate(100%) invert(21%) sepia(73%) saturate(2356%) hue-rotate(347deg) brightness(89%) contrast(85%);"
        },
        {
            name: "black",
            code: "15",
            hex: "1E1B1B",
            filter: "filter: brightness(0) saturate(100%) invert(7%) sepia(9%) saturate(346%) hue-rotate(337deg) brightness(100%) contrast(92%);"
        },
    ]

    let bannerGive = ""
    let shieldGive = ""
    let spigot = ""
    let link = ""

    function setPattern(pattern) {
        tabData[activeTab].pattern = pattern
        if (tabData[activeTab].color === "") {
            tabData[activeTab].color = "FFFFFF"
        }
        updateOutput()
    }

    function setColor(color) {
        tabData[activeTab].color = color
        updateOutput()
    }

    updateOutput()

    function updateOutput() {
        let baseName = colors.find(item => item.hex === tabData[0].color)?.name
        let baseColor = colors.find(item => item.hex === tabData[0].color)?.code
        bannerGive = `/give @p minecraft:${baseName}_banner`
        shieldGive = "/give @p minecraft:shield"

        link = "https://mcutils.com/banner-creator#base=" + tabData[0].color

        let patternPresent = false
        let patterns = ""
        let spigotPatterns = ""
        for (let i = 1; i < tabData.length; i++) {
            if (tabData[i].pattern === "") { continue }
            if (tabData[i].color === "") { continue }
            patternPresent = true
            let color = colors.find(item => item.hex === tabData[i].color)?.code
            let pattern = tabData[i].pattern
            patterns += `,{Color:${color},Pattern:"${pattern}"}`
            spigotPatterns += `meta.addPattern(new Pattern(DyeColor.${colors.find(item => item.hex === tabData[i].color)?.name.toUpperCase()}, PatternType.getByIdentifier("${tabData[i].pattern}")));\n`
            link += `&l${i}p=${pattern}` + `&l${i}c=${colors.find(item => item.hex === tabData[i].color)?.hex}`
        }

        spigot = "ItemStack is = new ItemStack(Material." + (baseName?.toUpperCase()) + "_BANNER);\n"

        if (patternPresent) {
            bannerGive += `{BlockEntityTag:{Patterns:[${patterns.substring(1)}]}}`
            shieldGive += `{BlockEntityTag:{Base:${baseColor},Patterns:[${patterns.substring(1)}]}}`

            spigot +=
                "BannerMeta meta = (BannerMeta) is.getItemMeta();\n" +
                spigotPatterns +
                "is.setItemMeta(meta);"

        }
    }

    import { toast } from '@zerodevx/svelte-toast'

    function copyValue(text) {
        navigator.clipboard.writeText(text)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    import { onMount } from 'svelte';

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));

        let base = urlParams.get('base')
        if (base && isColor(base)) {
            tabData[0].color = base

            let l1p = urlParams.get('l1p'), l1c = urlParams.get('l1c')
            let l2p = urlParams.get('l2p'), l2c = urlParams.get('l2c')
            let l3p = urlParams.get('l3p'), l3c = urlParams.get('l3c')
            let l4p = urlParams.get('l4p'), l4c = urlParams.get('l4c')
            let l5p = urlParams.get('l5p'), l5c = urlParams.get('l5c')
            let l6p = urlParams.get('l6p'), l6c = urlParams.get('l6c')

            if (l1p && patterns.includes(l1p)) {
                tabData[1].pattern = l1p
                if (l1c && isColor(l1c)) {
                    tabData[1].color = l1c
                }
            }

            if (l2p && patterns.includes(l2p)) {
                tabData[2].pattern = l2p
                if (l2c && isColor(l2c)) {
                    tabData[2].color = l2c
                }
            }

            if (l3p && patterns.includes(l3p)) {
                tabData[3].pattern = l3p
                if (l3c && isColor(l3c)) {
                    tabData[3].color = l3c
                }
            }

            if (l4p && patterns.includes(l4p)) {
                tabData[4].pattern = l4p
                if (l4c && isColor(l4c)) {
                    tabData[4].color = l4c
                }
            }

            if (l5p && patterns.includes(l5p)) {
                tabData[5].pattern = l5p
                if (l5c && isColor(l5c)) {
                    tabData[5].color = l5c
                }
            }

            if (l6p && patterns.includes(l6p)) {
                tabData[6].pattern = l6p
                if (l6c && isColor(l6c)) {
                    tabData[6].color = l6c
                }
            }
        }

        updateOutput()
    });

    function isColor(colorName) {
        return colors.some(obj => obj.hex === colorName);
    }
</script>

<main class="w-[90%] lg:w-[60%] mt-5">
    <div class="tab-system w-[100%] flex flex-col ">
        <div class="self-center grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-7 gap-2">
            {#each tabData as tab, index}
                <button id={tab.name} class="button px-4 py-2 rounded focus:outline-none"
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
                    <img src="/banner/{pattern}.png" alt={`Pattern`} class="w-8 border-[1px] border-white"/>
                </button>
            {/each}
        </div>
    {/if}
    <div class="flex flex-wrap gap-1 justify-center mt-4">
        {#each colors as color}
            <button on:click={() => setColor(color.hex)}>
                <div class="h-11 w-11 rounded-xl border-[1px] border-white" style="background-color: #{color.hex}"></div>
            </button>
        {/each}
    </div>

    <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-5">Preview</h3>

    <div class="grid grid-cols-1 xl:flex xl:flex-wrap w-full gap-12">
        <div class="w-[223px] h-[418px] mx-auto">
            <div class="">
                <img src="/banner/base.png" alt="Base" class="w-[223px] h-[418px] absolute" style={colors.find(item => item.hex === tabData[0].color)?.filter}>
                {#each tabData as layer, index}
                    {#if index !== 0 && layer.pattern}
                        <img src="/banner/{layer.pattern}.png" alt="Layer" class="w-[223px] h-[418px] absolute " style={colors.find(item => item.hex === layer.color)?.filter}>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="w-full min-w-[10px] flex-1">
            <div class="flex flex-col">
                <h3 class="font-medium text-white text-20px text-left">Banner Give Command</h3>
                <div class="flex gap-3 mt-2">
                    <input disabled bind:value={bannerGive} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button on:click={() => copyValue(bannerGive)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Shield Give Command</h3>
                <div class="flex gap-3 mt-2">
                    <input disabled bind:value={shieldGive} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button on:click={() => copyValue(shieldGive)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Spigot API Code</h3>
                <div class="flex gap-3 mt-2">
                    <textarea style="resize: none;" disabled bind:value={spigot} class=" inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[105px] w-[100%] max-w-[100%] overflow-y-scroll"></textarea>
                    <button on:click={() => copyValue(spigot)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
                </div>
            </div>
            <div class="flex flex-col mt-6">
                <h3 class="font-medium text-white text-20px text-left">Shareable Link</h3>
                <div class="flex gap-3 mt-2">
                    <input disabled bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-[100%] max-w-[100%] ">
                    <button on:click={() => copyValue(link)} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
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
