<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";
    import {incrementTracker} from "$lib/tracker/tracker";

    let searchValue: string

    let debounceTimer: NodeJS.Timeout | null = null;
    const handleInput = () => {
        link = "https://mcutils.com/server-info#ip=" + searchValue
        if (searchValue === "") return

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            fetchServerStatus();
        }, 500); // Adjust the debounce delay as needed
    };

    let status;

    const fetchServerStatus = async () => {
        const url = 'https://mcapi.us/server/status?ip=' + searchValue;

        try {
            const response = await fetch(url);
            status = await response.json();
            if (status.status != "error") {
                incrementTracker("server-infos-served")

                if (status.motd_json.extra) {
                    let asString = status.motd_json.extra.reduce((acc, item) => {
                        if (item.color) {
                            return acc + `%${item.color}%${item.text}`;
                        }
                        return acc + item.text;
                    }, '');
                    status.motd_json = formatMOTD(asString)
                } else {
                    status.motd_json = formatMOTD(status.motd_json)
                }
            } else {
                toast.push({
                    msg: 'Invalid server!',
                    theme: {
                        '--toastBackground': '#F56565',
                        '--toastBarBackground': '#C53030'
                    }
                })
            }
            // Update the status or perform other actions based on the response
        } catch (error) {
            console.error('Error fetching server status:', error);
        }
    };

    function formatMOTD(text) {
        // Color codes
        text = text.replace(/§0/g, '<span style="color: #000000">'); // Black
        text = text.replace(/§1/g, '<span style="color: #0000AA">'); // Dark Blue
        text = text.replace(/§2/g, '<span style="color: #00AA00">'); // Dark Green
        text = text.replace(/§3/g, '<span style="color: #00AAAA">'); // Dark Aqua
        text = text.replace(/§4/g, '<span style="color: #AA0000">'); // Dark Red
        text = text.replace(/§5/g, '<span style="color: #AA00AA">'); // Dark Purple
        text = text.replace(/§6/g, '<span style="color: #FFAA00">'); // Gold
        text = text.replace(/§7/g, '<span style="color: #AAAAAA">'); // Gray
        text = text.replace(/§8/g, '<span style="color: #555555">'); // Dark Gray
        text = text.replace(/§9/g, '<span style="color: #5555FF">'); // Blue
        text = text.replace(/§a/g, '<span style="color: #55FF55">'); // Green
        text = text.replace(/§b/g, '<span style="color: #55FFFF">'); // Aqua
        text = text.replace(/§c/g, '<span style="color: #FF5555">'); // Red
        text = text.replace(/§d/g, '<span style="color: #FF55FF">'); // Light Purple
        text = text.replace(/§e/g, '<span style="color: #FFFF55">'); // Yellow
        text = text.replace(/§f/g, '<span style="color: #FFFFFF">'); // White

        text = text.replace(/%black%/g, '<span style="color: #000000">'); // Black
        text = text.replace(/%dark_blue%/g, '<span style="color: #0000AA">'); // Dark Blue
        text = text.replace(/%dark_green%/g, '<span style="color: #00AA00">'); // Dark Green
        text = text.replace(/%dark_aqua%/g, '<span style="color: #00AAAA">'); // Dark Aqua
        text = text.replace(/%dark_red%/g, '<span style="color: #AA0000">'); // Dark Red
        text = text.replace(/%dark_purple%/g, '<span style="color: #AA00AA">'); // Dark Purple
        text = text.replace(/%gold%/g, '<span style="color: #FFAA00">'); // Gold
        text = text.replace(/%gray%/g, '<span style="color: #AAAAAA">'); // Gray
        text = text.replace(/%dark_gray%/g, '<span style="color: #555555">'); // Dark Gray
        text = text.replace(/%blue%/g, '<span style="color: #5555FF">'); // Blue
        text = text.replace(/%green%/g, '<span style="color: #55FF55">'); // Green
        text = text.replace(/%aqua%/g, '<span style="color: #55FFFF">'); // Aqua
        text = text.replace(/%red%/g, '<span style="color: #FF5555">'); // Red
        text = text.replace(/%light_purple%/g, '<span style="color: #FF55FF">'); // Light Purple
        text = text.replace(/%yellow%/g, '<span style="color: #FFFF55">'); // Yellow
        text = text.replace(/%white%/g, '<span style="color: #FFFFFF">'); // White

        text = text.replace(/\n/g, '<br>'); // White

        // Hex code
        const regex = /§#([A-Fa-f0-9]{6})/g;
        text = text.replace(regex, (match, color) => `<span style="color: #${color}">`);

        const regex2 = /%#([A-Fa-f0-9]{6})%/g;
        text = text.replace(regex2, (match, color) => `<span style="color: #${color}">`);

        // Formatting codes
        text = text.replace(/§k/g, '<span style="font-weight: bold">'); // Obfuscated
        text = text.replace(/§l/g, '<span style="font-weight: bold">'); // Bold
        text = text.replace(/§m/g, '<span style="text-decoration: line-through">'); // Strikethrough
        text = text.replace(/§n/g, '<span style="text-decoration: underline">'); // Underline
        text = text.replace(/§o/g, '<span style="font-style: italic">'); // Italic
        text = text.replace(/§r/g, '<span style="color: #AAAAAA">'); // Reset

        return '<span style="color: #AAAAAA">' + text;
    }

    function disallowSpaces(event) {
        if (event.key === " ") {
            event.preventDefault();
        }
    }

    let link = "https://mcutils.com/server-info#ip="
    function copyLink() {
        navigator.clipboard.writeText(link)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        let server = urlParams.get('ip')
        if (server) {
            searchValue = server
            link = "https://mcutils.com/server-info#ip=" + server
            fetchServerStatus()
        }
    })
</script>

<input class="search w-[26rem] mb-12" on:keydown={disallowSpaces} bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter server address..." on:blur={handleInput}>

{#if (status && status.status !== "error")}
    <div class="self-center relative w-[650px] transition-transform transform scale-[55%] sm:scale-[80%] md:scale-[100%] lg:scale-[100%] xl:scale-100">
        <img src="/display/dirt.svg" alt="Sign" class="w-[100%]">
        <div class="text-left mr-auto mc-server-content overflow-y-hidden">
            <p class="minecraft-server text-white">{searchValue ? searchValue : "Minecraft Server"}</p>
        </div>
        <div class="text-left mr-auto players-content overflow-y-hidden">
            <p class="players text-white">{status.players.now}/{status.players.max}</p>
        </div>
        <div class="mr-auto text-start motd-content overflow-y-hidden">
            <p class="motd-text text-start"><br>{@html status.motd_json}</p>
        </div>
        <img src="{status.favicon}" alt="Server Favicon" class="favicon-content h-24">
    </div>
{:else}
    <div class="self-center relative w-[650px] transition-transform transform scale-[55%] sm:scale-[80%] md:scale-[100%] lg:scale-[100%] xl:scale-100">
        <img src="/display/dirt.svg" alt="dirt" class="w-[100%]">
        <div class="text-left mr-auto mc-server-content overflow-y-hidden">
            <p class="minecraft-server text-white">{searchValue ? searchValue : "Minecraft Server"}</p>
        </div>
        <div class="text-left mr-auto players-content overflow-y-hidden">
            <p class="players text-white">0/0</p>
        </div>
        <div class="mr-auto text-start motd-content overflow-y-hidden">
            <p class="motd-text text-start text-[#AA0000]"><br>Can't connect to server</p>
        </div>
        <img src="/display/packpng.svg" alt="Server Favicon" class="favicon-content h-24">
    </div>
{/if}

<div class="flex flex-col mt-8 w-fit">
    <h3 class="font-medium text-white text-20px text-center">Shareable Link</h3>
    <div class="flex gap-3 mt-2 w-fit">
        <input disabled bind:value={link} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] md:w-[370px] max-w-[100%] ">
        <button on:click={copyLink} class="w-fit text-sm px-2 py-1.5 button h-fit inline-block">Copy</button>
    </div>
</div>

<style>
    .motd-content {
        position: absolute;
        top: 4px;
        left: 128px;
        right: 30px;
        bottom: 10px;
        display: flex;
    }

    .motd-text {
        margin-top: 13px;
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: left;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .minecraft-server {
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .mc-server-content {
        position: absolute;
        top: 15px;
        left: 130px;
        right: 0px;
        bottom: 10px;
        display: flex;
    }

    .players {
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: right;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .players-content {
        position: absolute;
        top: 15px;
        left: auto;
        right: 14px;
        text-align: right;
        bottom: 0px;
        display: flex;
    }

    .favicon-content {
        position: absolute;
        top: 11px;
        left: 17px;
        right: 33px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
