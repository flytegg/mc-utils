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
        },
        {
            name: 'Name',
            content: '',
        },
        {
            name: 'Lore',
            content: '',
        },
        {
            name: 'Kick',
            content: '',
        }
    ];

    function insertTextAtCursor(value) {
        const inputBox = document.getElementById("textinput");
        const startPos = inputBox.selectionStart;
        const endPos = inputBox.selectionEnd;
        const currentValue = inputBox.value;

        const newText = currentValue.substring(0, startPos) + value + currentValue.substring(endPos);
        text = newText;

        // Get the updated cursor position after the text update
        const updatedCursorPosition = startPos + value.length;

        inputBox.focus();
        // Use requestAnimationFrame to ensure setting selection works after the element repaints
        requestAnimationFrame(() => {
            inputBox.setSelectionRange(updatedCursorPosition, updatedCursorPosition);
        });
    }

    function setActiveTab(index) {
        activeTab = index;
        isPreviewingSign = false; // Reset the sign preview flag when changing tabs
    }

    let previewText = '';

    afterUpdate(() => {
        previewText = applyMinecraftFormatting(text);
    });

    function applyMinecraftFormatting(text) {
        let htmlText = ""

        function isValidColorChar(char) {
            return (char >= '0' && char <= '9') || (char >= 'a' && char <= 'f') || (char >= 'A' && char <= 'F');
        }

        function isValidDecorationChar(char) {
            return (char >= 'k' && char <= 'o') || (char >= 'K' && char <= 'O');
        }

        function getColorStyleFromChar(char) {
            const colorMap = {
                "0": "000000",  // Black
                "1": "0000AA",  // Dark Blue
                "2": "00AA00",  // Dark Green
                "3": "00AAAA",  // Dark Aqua
                "4": "AA0000",  // Dark Red
                "5": "AA00AA",  // Dark Purple
                "6": "FFAA00",  // Gold
                "7": "AAAAAA",  // Gray
                "8": "555555",  // Dark Gray
                "9": "5555FF",  // Blue
                "a": "55FF55",  // Green
                "b": "55FFFF",  // Aqua
                "c": "FF5555",  // Red
                "d": "FF55FF",  // Light Purple
                "e": "FFFF55",  // Yellow
                "f": "FFFFFF",  // White
            };
            return colorMap[`${char}`]
        }

        function getDecorationStyleFromChar(char) {
            const decorationMap = {
                "k": "font-weight: bold;",
                "l": "font-weight: bold;",
                "m": "text-decoration: line-through;",
                "n": "text-decoration: underline;",
                "o": "font-style: italic;"
            }
            return decorationMap[`${char}`]
        }

        let coloringMode = false
        let colorType = ""
        let coloredText = ""

        let decorationMode = false
        let decorationStyles = ""
        let decorationColorType = ""
        let decorationText = ""

        function releaseTextOfColorMode() {
            if (!coloringMode) return
            htmlText += `<span style="color: #${colorType};">${coloredText}</span>`

            // reset
            coloringMode = false
            coloredText = ""
            colorType = ""
        }

        function releaseTextOfDecorationMode() {
            if (!decorationMode) return
            htmlText += `<span style="color: #${decorationColorType}; ${decorationStyles}">${decorationText}</span>`

            // reset
            decorationMode = false
            decorationText = ""
            decorationStyles = ""
            decorationColorType = ""
        }

        function isGradient(text) {
            const regex = /&#([A-Fa-f0-9]{6})/g;
            return regex.test(text);
        }

        function getGradientColor(text) {
            const regex = /&#([A-Fa-f0-9]{6})/g;

            let gradientColor = ""
            text.replace(regex, (match, color) => gradientColor = color);
            return gradientColor
        }

        for (let i = 0; i < text.length; i++) {
            const c = text[i]

            const nextC = text.charAt(i + 1)
            let hasFormatSign = c === "&";

            let gradient = false
            let hexSlice = text.slice(i, i + 8);
            if (hasFormatSign && (isValidColorChar(nextC) || (gradient = isGradient(hexSlice)))) {
                // skip to next char
                if (gradient) {
                    i += 7
                } else {
                    i += 1
                }

                // release previous color/decoration
                releaseTextOfColorMode();
                releaseTextOfDecorationMode();

                if (gradient) {
                    colorType = getGradientColor(hexSlice)
                } else {
                    colorType = getColorStyleFromChar(nextC)
                }
                coloringMode = true
                continue
            } else if (hasFormatSign && isValidDecorationChar(nextC)) {
                // skip to next char
                i += 1

                // release and inherit current decoration style and color
                if (decorationMode) {
                    const inheritDecorations = decorationStyles
                    const inheritDecorationsColor = decorationColorType
                    releaseTextOfDecorationMode();
                    decorationStyles += inheritDecorations
                    decorationColorType = inheritDecorationsColor
                }

                // release and inherit current colors
                if (coloringMode) {
                    decorationColorType = colorType
                    releaseTextOfColorMode()
                }

                decorationStyles += getDecorationStyleFromChar(nextC)
                decorationMode = true
                continue
            } else if (hasFormatSign && nextC === "r") {
                // skip to next char
                i += 1

                releaseTextOfColorMode()
                releaseTextOfDecorationMode()
                continue
            }

            if (coloringMode) {
                coloredText += c
            } else if (decorationMode) {
                decorationText += c
            } else {
                htmlText += c
            }
        }

        // release leftovers
        releaseTextOfColorMode()
        releaseTextOfDecorationMode()

        document.getElementById("textinput").focus();

        return getResetStyle() + htmlText;
    }

    function getResetStyle() {
        if (activeTab === 0 || activeTab === 3 || activeTab === 5 || activeTab === 6 || activeTab === 7) {
            return `<span style="color: #FFFFFF;">`;
        } else if (activeTab === 1 || activeTab === 2) {
            return `<span style="color: #000000;">`;
        } else if (activeTab === 4) {
            return `<span style="color: #AAAAAA;">`;
        } else {
            return `<span>`; // Default - No color
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

    function autoSizeTextArea(event) {
        const target = event.target;
        if (!target.value.includes("\n")) {
            // removes all inline styles from this element
            target.setAttribute("style", '')
        } else {
            target.setAttribute("style", "height:auto")
            target.setAttribute("style", "height:" + target.scrollHeight + "px")
        }
    }

    let color = "#FFFFFF";
</script>

<main class="w-[60%]">
    <div class="flex-col flex">
        <div class="place-items-center text-center items-start grid grid-cols-1 xl:flex justify-center gap-6">
            <div class="flex-col flex gap-1">
                <div class="flex gap-1">
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#000000] bg-[#000000] text-white" on:click={() => insertTextAtCursor("&0")}>&0</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#0000AA] bg-[#0000AA] text-white" on:click={() => insertTextAtCursor("&1")}>&1</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#00AA00] bg-[#00AA00] text-white" on:click={() => insertTextAtCursor("&2")}>&2</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#00AAAA] bg-[#00AAAA] text-white" on:click={() => insertTextAtCursor("&3")}>&3</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AA0000] bg-[#AA0000] text-white" on:click={() => insertTextAtCursor("&4")}>&4</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AA00AA] bg-[#AA00AA] text-white" on:click={() => insertTextAtCursor("&5")}>&5</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFAA00] bg-[#FFAA00] text-white" on:click={() => insertTextAtCursor("&6")}>&6</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#AAAAAA] bg-[#AAAAAA] text-white" on:click={() => insertTextAtCursor("&7")}>&7</button>
                </div>
                <div class="flex gap-1">
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#555555] bg-[#555555] text-white" on:click={() => insertTextAtCursor("&8")}>&8</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#5555FF] bg-[#5555FF] text-white" on:click={() => insertTextAtCursor("&9")}>&9</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#55FF55] bg-[#55FF55] text-black" on:click={() => insertTextAtCursor("&a")}>&a</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#55FFFF] bg-[#55FFFF] text-black" on:click={() => insertTextAtCursor("&b")}>&b</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FF5555] bg-[#FF5555] text-black" on:click={() => insertTextAtCursor("&c")}>&c</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FF55FF] bg-[#FF55FF] text-black" on:click={() => insertTextAtCursor("&d")}>&d</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFFF55] bg-[#FFFF55] text-black" on:click={() => insertTextAtCursor("&e")}>&e</button>
                    <button class="h-8 w-8 text-sm rounded-md hover:bg-[#FFFFFF] bg-[#FFFFFF] text-black" on:click={() => insertTextAtCursor("&f")}>&f</button>
                </div>
            </div>
            <div class="flex-col flex gap-1">
                <div class="self-center text-[#626875] font-medium">
                    <input type="color" bind:value={color} class="rounded-full bg-transparent border-none self-center"/>
                </div>
                <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => insertTextAtCursor("&" + color)}>Add Hex Code</button>
            </div>
            <div class="flex gap-1">
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm text-center flex items-center justify-center font-bold" on:click={() => insertTextAtCursor("&l")}>Bold</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center underline" on:click={() => insertTextAtCursor("&n")}>Underline</button>
                </div>
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center italic" on:click={() => insertTextAtCursor("&o")}>Italic</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center line-through" on:click={() => insertTextAtCursor("&m")}>Strikethrough</button>
                </div>
                <div class="flex-col flex gap-1">
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => insertTextAtCursor("&k")}>Magic</button>
                    <button class="button w-[100%] h-8 text-sm flex items-center justify-center" on:click={() => insertTextAtCursor("&r")}>Reset</button>
                </div>
            </div>
        </div>

        <div class="flex gap-3">
            <textarea id="textinput" on:input={autoSizeTextArea} bind:value={text} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-8 h-[35px] w-[100%] max-w-[100%] overflow-y-hidden"></textarea>
            <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block mt-8" on:click={copyValue}>Copy</button>
        </div>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-5">Preview</h3>
        <div class="tab-system w-[100%] flex flex-col">
            <div class="self-center grid xl:grid-cols-8 md:grid-cols-4 grid-cols-2 -mt-2 z-50">
                {#each tabData as tab, index}
                    <button class="button px-4 py-2 mr-2 mt-2 rounded focus:outline-none"
                            class:bg-gray-200={index === activeTab}
                            class:text-black={index === activeTab}
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
                {:else if activeTab === 5} <!-- Name -->
                    <div class="self-center relative w-[500px] mx-auto">
                        <img src="/display/name.svg" alt="Name" class="w-[100%] self-center items-center">
                        <div class="name-content overflow-y-hidden">
                            <p class="name-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 6} <!-- Lore -->
                    <div class="self-center relative w-[500px] mx-auto">
                        <img src="/display/lore.svg" alt="Lore" class="w-[100%] self-center items-center">
                        <div class="lore-content overflow-y-hidden">
                            <p class="lore-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 7} <!-- Kick -->
                    <div class="self-center relative w-[550px] mx-auto">
                        <img src="/display/kick.svg" alt="Kick" class="w-[100%] self-center items-center">
                        <div class="kick-content overflow-y-hidden">
                            <p class="kick-text">{@html previewText}</p>
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

    .kick-content {
        padding-left: 30px;
        padding-right: 30px;
        position: absolute;
        top: 55px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .kick-text {
        font-family: 'Minecraft', monospace;
        font-size: 17px;
        line-height: 1.3;
        text-align: center;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        height: 100%;
    }

    .lore-content {
        position: absolute;
        top: 60px;
        left: 24px;
        right: 24px;
        bottom: 25px;
        display: flex;
    }

    .lore-text {
        font-family: 'Minecraft', monospace;
        font-size: 30px;
        line-height: 1.3;
        text-align: left;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .name-content {
        position: absolute;
        top: 16px;
        right: 0;
        bottom: 0;
        overflow: hidden;
        left: 24px;
        display: flex;
    }

    .name-text {
        font-family: 'Minecraft', monospace;
        font-size: 30px;
        line-height: 1.3;
        text-align: left;
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
