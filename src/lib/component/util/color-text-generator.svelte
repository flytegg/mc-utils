<script lang="ts">
    import { afterUpdate } from 'svelte';

    let activeTab = 0;
    let text = "";
    let isPreviewingSign = false;

    const tabData = [
        {
            name: 'Text',
            content: '',
        },
        {
            name: 'Sign',
            content: '',
        },
        {
            name: 'Book',
            content: '',
        },
        {
            name: 'Chat',
            content: '',
        },
        {
            name: 'MOTD',
            content: '',
        }
    ];

    function setActiveTab(index) {
        activeTab = index;
        isPreviewingSign = false; // Reset the sign preview flag when changing tabs
    }

    let previewText = '';

    afterUpdate(() => {
        previewText = applyMinecraftFormatting(text);
    });

    function applyMinecraftFormatting(text) {
        // Color codes
        text = text.replace(/&0/g, '<span style="color: #000000">'); // Black
        text = text.replace(/&1/g, '<span style="color: #0000AA">'); // Dark Blue
        text = text.replace(/&2/g, '<span style="color: #00AA00">'); // Dark Green
        text = text.replace(/&3/g, '<span style="color: #00AAAA">'); // Dark Aqua
        text = text.replace(/&4/g, '<span style="color: #AA0000">'); // Dark Red
        text = text.replace(/&5/g, '<span style="color: #AA00AA">'); // Dark Purple
        text = text.replace(/&6/g, '<span style="color: #FFAA00">'); // Gold
        text = text.replace(/&7/g, '<span style="color: #AAAAAA">'); // Gray
        text = text.replace(/&8/g, '<span style="color: #555555">'); // Dark Gray
        text = text.replace(/&9/g, '<span style="color: #5555FF">'); // Blue
        text = text.replace(/&a/g, '<span style="color: #55FF55">'); // Green
        text = text.replace(/&b/g, '<span style="color: #55FFFF">'); // Aqua
        text = text.replace(/&c/g, '<span style="color: #FF5555">'); // Red
        text = text.replace(/&d/g, '<span style="color: #FF55FF">'); // Light Purple
        text = text.replace(/&e/g, '<span style="color: #FFFF55">'); // Yellow
        text = text.replace(/&f/g, '<span style="color: #FFFFFF">'); // White

        // Hex code
        const regex = /&#([A-Fa-f0-9]{6})/g;
        text = text.replace(regex, (match, color) => `<span style="color: #${color}">`);

        // Formatting codes
        text = text.replace(/&k/g, '<span style="font-weight: bold">'); // Obfuscated
        text = text.replace(/&l/g, '<span style="font-weight: bold">'); // Bold
        text = text.replace(/&m/g, '<span style="text-decoration: line-through">'); // Strikethrough
        text = text.replace(/&n/g, '<span style="text-decoration: underline">'); // Underline
        text = text.replace(/&o/g, '<span style="font-style: italic">'); // Italic
        text = text.replace(/&r/g, getResetStyle()); // Reset

        return getResetStyle() + text;
    }

    function getResetStyle() {
        if (activeTab === 0 || activeTab === 3) {
            return '<span style="color: #FFFFFF">';
        } else if (activeTab === 1|| activeTab === 2) {
            return '<span style="color: #000000">';
        } else if (activeTab === 4) {
            return '<span style="color: #AAAAAA">';
        } else {
            return '<span>'; // Default - No color
        }
    }

    import { toast } from '@zerodevx/svelte-toast'

    function copyValue() {
        navigator.clipboard.writeText(text)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    import ColorPicker from 'svelte-awesome-color-picker';

    let color; // or hsv or hex
</script>

<main class="w-[60%]">
    <div class="flex-col flex">
        <div class="place-items-center text-center items-start grid grid-cols-1 xl:flex justify-center gap-6">
            <div class="flex-col flex gap-1">
                <div class="flex gap-1">
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#000000] bg-[#000000] text-white" on:click={() => {text += "&a"}}>&0</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#0000AA] bg-[#0000AA] text-white" on:click={() => {text += "&1"}}>&1</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#00AA00] bg-[#00AA00] text-white" on:click={() => {text += "&2"}}>&2</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#00AAAA] bg-[#00AAAA] text-white" on:click={() => {text += "&3"}}>&3</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AA0000] bg-[#AA0000] text-white" on:click={() => {text += "&4"}}>&4</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AA00AA] bg-[#AA00AA] text-white" on:click={() => {text += "&5"}}>&5</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFAA00] bg-[#FFAA00] text-white" on:click={() => {text += "&6"}}>&6</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AAAAAA] bg-[#AAAAAA] text-white" on:click={() => {text += "&7"}}>&7</button>
                </div>
                <div class="flex gap-1">
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#555555] bg-[#555555] text-white" on:click={() => {text += "&8"}}>&8</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#5555FF] bg-[#5555FF] text-white" on:click={() => {text += "&9"}}>&9</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#55FF55] bg-[#55FF55] text-black" on:click={() => {text += "&a"}}>&a</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#55FFFF] bg-[#55FFFF] text-black" on:click={() => {text += "&b"}}>&b</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FF5555] bg-[#FF5555] text-black" on:click={() => {text += "&c"}}>&c</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FF55FF] bg-[#FF55FF] text-black" on:click={() => {text += "&d"}}>&d</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFFF55] bg-[#FFFF55] text-black" on:click={() => {text += "&e"}}>&e</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFFFFF] bg-[#FFFFFF] text-black" on:click={() => {text += "&f"}}>&f</button>
                </div>
            </div>
            <div class="flex-col flex gap-1">
                <div class="self-center text-[#626875] font-medium">
                    <input type="color" bind:value={color} class="rounded-full bg-transparent border-none self-center"/>
                </div>
                <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => {text += "&" + color}}>Add Hex Code</button>
            </div>
            <div class="flex gap-1">
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm text-center flex items-center justify-center font-bold" on:click={() => {text += "&b"}}>Bold</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center underline" on:click={() => {text += "&n"}}>Underline</button>
                </div>
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center italic" on:click={() => {text += "&o"}}>Italic</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center line-through" on:click={() => {text += "&m"}}>Strikethrough</button>
                </div>
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => {text += "&k"}}>Magic</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => {text += "&r"}}>Reset</button>
                </div>
            </div>
        </div>

        <div class="flex gap-3">
            <input bind:value={text} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-8 h-[35px] w-[100%] max-w-[100%] ">
            <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block mt-8" on:click={copyValue}>Copy</button>
        </div>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-5">Preview</h3>
        <div class="tab-system w-[100%] flex flex-col">
            <div class="self-center grid lg:grid-cols-6 grid-cols-2">
                {#each tabData as tab, index}
                    <button class="button px-4 py-2 mr-2 rounded focus:outline-none"
                            class:bg-gray-200={index === activeTab}
                            on:click={() => setActiveTab(index)}>
                        {tab.name}
                    </button>
                {/each}
            </div>
            <div class="mt-8 self-center">
                {#if activeTab === 0} <!-- Text -->
                    <p class="font-['Minecraft'] break-all text-2xl text-center" style="white-space: pre-wrap">{@html previewText}</p>
                {:else if activeTab === 1} <!-- Sign -->
                    <div class="self-center relative w-[500px] mx-auto">
                        <img src="/display/sign.png" alt="Sign" class="w-[100%] self-center items-center">
                        <div class="sign-content overflow-y-hidden">
                            <p class="sign-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 2} <!-- Book -->
                    <div class="self-center relative w-[250px] mx-auto">
                        <img src="/display/book.svg" alt="Sign" class="w-[100%] self-center items-center">
                        <div class="book-content overflow-y-hidden ">
                            <p class="book-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 3} <!-- Chat -->
                    <div class="self-center relative w-[650px] mx-auto">
                        <img src="/display/chat.svg" alt="Sign" class="w-[100%] self-center items-center ">
                        <div class="chat-content overflow-y-hidden bg-black bg-opacity-40">
                            <p class="chat-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 4} <!-- MOTD -->
                    <div class="self-center relative w-[650px] mx-auto">
                        <img src="/display/motd.svg" alt="Sign" class="w-[100%]">
                        <div class="text-left mr-auto mc-server-content overflow-y-hidden">
                            <p class="minecraft-server text-white">Minecraft Server</p>
                        </div>
                        <div class="mr-auto text-start motd-content overflow-y-hidden">
                            <p class="motd-text text-start"><br>{@html previewText}</p>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    .tab-system .tab {
        display: none;
    }

    .tab-system .tab.active {
        display: block;
    }

    .sign-content {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sign-text {
        font-family: 'Minecraft', monospace;
        font-size: 40px;
        line-height: 1.3;
        text-align: center;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .book-content {
        position: absolute;
        top: 10px;
        left: 30px;
        right: 30px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .book-text {
        font-family: 'Minecraft', monospace;
        font-size: 15px;
        line-height: 1.3;
        text-align: start;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .motd-content {
        position: absolute;
        top: 5px;
        left: 125px;
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
        top: -50px;
        left: -132px;
        right: 30px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chat-content {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 30px;
        bottom: 10px;
        display: flex;
        width: 480px;
        flex-direction: column-reverse;
    }

    .chat-text {
        font-family: 'Minecraft', monospace;
        font-size: 15px;
        margin: 6px;
        line-height: 1.3;
        text-align: left;
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    input::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
        height: 120%
    }
</style>