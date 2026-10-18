<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { toast } from '@zerodevx/svelte-toast'
    import { incrementTracker } from "$lib/tracker/tracker";

    let activeTab = 0;
    let text = "";
    let color = "#FFFFFF";
    let previewRoot: HTMLElement;

    const tabData = [
        { name: 'Text' },
        { name: 'Sign' },
        { name: 'Book' },
        { name: 'Chat' },
        { name: 'MOTD' },
        { name: 'Name' },
        { name: 'Lore' },
        { name: 'Kick' }
    ];

    // ---------------------------------------------------------------------
    // Input helpers
    // ---------------------------------------------------------------------

    function autoSize(target: HTMLTextAreaElement) {
        if (!target.value.includes("\n")) {
            // removes all inline styles from this element
            target.setAttribute("style", '')
        } else {
            target.setAttribute("style", "height:auto")
            target.setAttribute("style", "height:" + target.scrollHeight + "px")
        }
    }

    function autoSizeTextArea(event: Event) {
        autoSize(event.target as HTMLTextAreaElement)
    }

    function insertTextAtCursor(value: string) {
        const inputBox = document.getElementById("textinput") as HTMLTextAreaElement;
        const startPos = inputBox.selectionStart;
        const endPos = inputBox.selectionEnd;
        const currentValue = inputBox.value;

        text = currentValue.substring(0, startPos) + value + currentValue.substring(endPos);

        const updatedCursorPosition = startPos + value.length;

        inputBox.focus();
        // wait for the DOM to update before restoring the cursor / resizing
        tick().then(() => {
            inputBox.setSelectionRange(updatedCursorPosition, updatedCursorPosition);
            autoSize(inputBox);
        });
    }

    function setActiveTab(index: number) {
        activeTab = index;
    }

    function copyValue() {
        navigator.clipboard.writeText(text)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        incrementTracker("color-text-copied")
    }

    // ---------------------------------------------------------------------
    // Minecraft formatting
    // ---------------------------------------------------------------------

    const COLOR_MAP: Record<string, string> = {
        "0": "#000000",  // Black
        "1": "#0000AA",  // Dark Blue
        "2": "#00AA00",  // Dark Green
        "3": "#00AAAA",  // Dark Aqua
        "4": "#AA0000",  // Dark Red
        "5": "#AA00AA",  // Dark Purple
        "6": "#FFAA00",  // Gold
        "7": "#AAAAAA",  // Gray
        "8": "#555555",  // Dark Gray
        "9": "#5555FF",  // Blue
        "a": "#55FF55",  // Green
        "b": "#55FFFF",  // Aqua
        "c": "#FF5555",  // Red
        "d": "#FF55FF",  // Light Purple
        "e": "#FFFF55",  // Yellow
        "f": "#FFFFFF",  // White
    };

    const HEX_REGEX = /^&#[0-9a-fA-F]{6}$/;

    function escapeHtml(value: string): string {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // Default text colour of each preview
    function getBaseColor(tab: number): string {
        if (tab === 1 || tab === 2) return "#000000";   // Sign, Book
        if (tab === 4) return "#AAAAAA";                 // MOTD
        return "#FFFFFF";
    }

    function applyMinecraftFormatting(input: string, tab: number): string {
        const baseColor = getBaseColor(tab);

        let color: string | null = null;
        let bold = false;
        let italic = false;
        let underline = false;
        let strike = false;
        let magic = false;

        let buffer = "";
        let html = "";

        function flush() {
            if (!buffer) return;

            const lines = [`color: ${color ?? baseColor};`];
            if (bold) lines.push("font-weight: bold;");
            if (italic) lines.push("font-style: italic;");
            const decorations = [underline ? "underline" : "", strike ? "line-through" : ""].filter(Boolean);
            if (decorations.length) lines.push(`text-decoration: ${decorations.join(" ")};`);

            const escaped = escapeHtml(buffer);
            if (magic) {
                html += `<span class="mc-magic" data-text="${escaped}" style="${lines.join(" ")}">${escaped}</span>`;
            } else {
                html += `<span style="${lines.join(" ")}">${escaped}</span>`;
            }
            buffer = "";
        }

        // Colour codes (and hex codes) wipe every active decoration, like in-game
        function setColor(value: string) {
            flush();
            color = value;
            bold = italic = underline = strike = magic = false;
        }

        // &r resets EVERYTHING: colour and all decorations
        function resetAll() {
            flush();
            color = null;
            bold = italic = underline = strike = magic = false;
        }

        for (let i = 0; i < input.length; i++) {
            const c = input[i];

            if (c === "&") {
                // &#RRGGBB
                const hexSlice = input.slice(i, i + 8);
                if (HEX_REGEX.test(hexSlice)) {
                    setColor("#" + hexSlice.slice(2));
                    i += 7;
                    continue;
                }

                const code = input.charAt(i + 1).toLowerCase();

                if (code && COLOR_MAP[code]) {
                    setColor(COLOR_MAP[code]);
                    i += 1;
                    continue;
                }

                if (code === "r") {
                    resetAll();
                    i += 1;
                    continue;
                }

                if (code === "k" || code === "l" || code === "m" || code === "n" || code === "o") {
                    flush();
                    if (code === "k") magic = true;
                    if (code === "l") bold = true;
                    if (code === "m") strike = true;
                    if (code === "n") underline = true;
                    if (code === "o") italic = true;
                    i += 1;
                    continue;
                }
            }

            buffer += c;
        }

        flush();

        return html;
    }

    $: previewText = applyMinecraftFormatting(text, activeTab);

    // ---------------------------------------------------------------------
    // Magic (obfuscated) text: keep scrambling characters
    // ---------------------------------------------------------------------

    const NARROW_CHARS = "!.,:;'|i";
    const WIDE_CHARS = "abcdeghjmnopqrsuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789#$%&?@";

    function scramble(original: string): string {
        let out = "";
        for (const ch of original) {
            if (ch === " " || ch === "\n" || ch === "\t") {
                out += ch;
            } else {
                const pool = NARROW_CHARS.includes(ch) ? NARROW_CHARS : WIDE_CHARS;
                out += pool[Math.floor(Math.random() * pool.length)];
            }
        }
        return out;
    }

    onMount(() => {
        const interval = setInterval(() => {
            if (!previewRoot) return;
            previewRoot.querySelectorAll<HTMLElement>(".mc-magic").forEach((el) => {
                el.textContent = scramble(el.dataset.text ?? "");
            });
        }, 60);

        return () => clearInterval(interval);
    });
</script>

<main class="w-full lg:w-[60%] min-w-0">
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
            <!-- Tabs sit above every preview so nothing can ever cover them -->
            <div class="tab-bar self-center flex flex-wrap justify-center gap-2">
                {#each tabData as tab, index}
                    <button class="button px-4 py-2 rounded focus:outline-none"
                            class:bg-gray-200={index === activeTab}
                            class:text-black={index === activeTab}
                            on:click={() => setActiveTab(index)}>
                        {tab.name}
                    </button>
                {/each}
            </div>
            <div class="preview-area mt-8 w-full" bind:this={previewRoot}>
                {#if activeTab === 0} <!-- Text -->
                    <p class="font-['Minecraft'] [overflow-wrap:anywhere] text-2xl text-center" style="white-space: pre-wrap">{@html previewText}</p>
                {:else if activeTab === 1} <!-- Sign -->
                    <div class="preview-box" style="max-width: 500px;">
                        <img src="/display/sign.png" alt="Sign" class="w-[100%] block">
                        <div class="sign-content overflow-y-hidden">
                            <p class="sign-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 2} <!-- Book -->
                    <div class="preview-box" style="max-width: 250px;">
                        <img src="/display/book.svg" alt="Book" class="w-[100%] block">
                        <div class="book-content overflow-y-hidden">
                            <p class="book-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 3} <!-- Chat -->
                    <div class="preview-box" style="max-width: 650px;">
                        <img src="/display/chat.svg" alt="Chat" class="w-[100%] block">
                        <div class="chat-content overflow-y-hidden bg-black bg-opacity-40">
                            <p class="chat-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 4} <!-- MOTD -->
                    <div class="preview-box" style="max-width: 650px;">
                        <img src="/display/motd.svg" alt="MOTD" class="w-[100%] block">
                        <div class="motd-content overflow-y-hidden">
                            <p class="minecraft-server text-white">Minecraft Server</p>
                            <p class="motd-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 5} <!-- Name -->
                    <div class="preview-box" style="max-width: 500px;">
                        <img src="/display/name.svg" alt="Name" class="w-[100%] block">
                        <div class="name-content overflow-y-hidden">
                            <p class="name-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 6} <!-- Lore -->
                    <div class="preview-box" style="max-width: 500px;">
                        <img src="/display/lore.svg" alt="Lore" class="w-[100%] block">
                        <div class="lore-content overflow-y-hidden">
                            <p class="lore-text">{@html previewText}</p>
                        </div>
                    </div>
                {:else if activeTab === 7} <!-- Kick -->
                    <div class="preview-box" style="max-width: 550px;">
                        <img src="/display/kick.svg" alt="Kick" class="w-[100%] block">
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
    /*
     * Every preview is a scalable box: it is as wide as its parent (up to the
     * max-width set inline) and all inner sizes use cqw units (1cqw = 1% of the
     * box width), so text and offsets scale together with the image.
     * Sizes below were converted from the original pixel values:
     *   cqw = px / base-width * 100
     */
    .preview-box {
        position: relative;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        container-type: inline-size;
    }

    .tab-bar {
        position: relative;
        z-index: 50;
    }

    /* Sign (base 500px) */
    .sign-content {
        position: absolute;
        top: 2cqw;
        left: 2cqw;
        right: 2cqw;
        bottom: 2cqw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sign-text {
        font-family: 'Minecraft', monospace;
        font-size: 8cqw;
        line-height: 1.3;
        text-align: center;
        max-height: calc(100% - 4cqw);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    /* Kick (base 550px) */
    .kick-content {
        padding-left: 5.5cqw;
        padding-right: 5.5cqw;
        position: absolute;
        top: 10cqw;
        left: 1.8cqw;
        right: 1.8cqw;
        bottom: 1.8cqw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .kick-text {
        font-family: 'Minecraft', monospace;
        font-size: 3.1cqw;
        line-height: 1.3;
        text-align: center;
        max-height: calc(100% - 3.6cqw);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
        height: 100%;
    }

    /* Lore (base 500px) */
    .lore-content {
        position: absolute;
        top: 12cqw;
        left: 4.8cqw;
        right: 4.8cqw;
        bottom: 5cqw;
        display: flex;
    }

    .lore-text {
        font-family: 'Minecraft', monospace;
        font-size: 6cqw;
        line-height: 1.3;
        text-align: left;
        max-height: calc(100% - 4cqw);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    /* Name (base 500px) */
    .name-content {
        position: absolute;
        top: 3.2cqw;
        right: 0;
        bottom: 0;
        overflow: hidden;
        left: 4.8cqw;
        display: flex;
    }

    .name-text {
        font-family: 'Minecraft', monospace;
        font-size: 6cqw;
        line-height: 1.3;
        text-align: left;
        max-height: calc(100% - 4cqw);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    /* Book (base 250px) - text is aligned to the TOP */
    .book-content {
        position: absolute;
        top: 6cqw;
        left: 12cqw;
        right: 12cqw;
        bottom: 4cqw;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .book-text {
        width: 100%;
        font-family: 'Minecraft', monospace;
        font-size: 6cqw;
        line-height: 1.3;
        text-align: start;
        max-height: 100%;
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    /*
     * MOTD (base 650px). The title and the MOTD now live in ONE in-flow
     * container (no more negative offsets), so the overlay can no longer
     * spill over the tab buttons.
     */
    .motd-content {
        position: absolute;
        top: 2.6cqw;
        left: 19.2cqw;
        right: 4.6cqw;
        bottom: 1.5cqw;
        display: flex;
        flex-direction: column;
        text-align: left;
        pointer-events: none;
    }

    .minecraft-server {
        font-family: 'Minecraft', monospace;
        font-size: 3.4cqw;
        line-height: 1.3;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .motd-text {
        font-family: 'Minecraft', monospace;
        font-size: 3.4cqw;
        line-height: 1.3;
        text-align: left;
        max-height: 100%;
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    /* Chat (base 650px) */
    .chat-content {
        position: absolute;
        top: 1.5cqw;
        left: 1.5cqw;
        bottom: 1.5cqw;
        width: 73.8cqw;
        display: flex;
        flex-direction: column-reverse;
    }

    .chat-text {
        font-family: 'Minecraft', monospace;
        font-size: 2.3cqw;
        margin: 0.9cqw;
        line-height: 1.3;
        text-align: left;
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }

    input::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
        height: 120%
    }
</style>
