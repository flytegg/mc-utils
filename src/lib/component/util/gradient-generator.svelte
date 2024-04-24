<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import Gradient from "javascript-color-gradient";
    import {incrementTracker} from "$lib/tracker/tracker";

    let text = "MC Utils"

    let outputText = ""
    let outputMinimessage = ""
    let previewText = ""

    let color1 = "#0040FF"
    let color2 = "#00FBFF"

    function calculateResult() {
        const colors = new Gradient()
            .setColorGradient(color1, color2)
            .setMidpoint(text.replace(/\s/g, "").length)
            .getColors()

        let hexIndex = 0;
        let output = ""
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char.match(/[a-z]/i)) {
                output += "&" + colors[hexIndex % colors.length];
                hexIndex++;
            }

            output += char;
        }
        outputText = output
        outputMinimessage = `<gradient:${color1}:${color2}>${text}</gradient>`

        const regex = /&#([A-Fa-f0-9]{6})/g;
        previewText = outputText.replace(regex, (match, color) => `<span style="color: #${color}">`);
    }

    calculateResult()

    function copyValue() {
        navigator.clipboard.writeText(outputText)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        incrementTracker("gradients-copied")
    }

    function copyMinimessageValue() {
        navigator.clipboard.writeText(outputMinimessage)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        incrementTracker("gradients-copied")
    }
</script>

<main class="w-[60%]">
    <div class="place-items-center text-center items-start grid grid-cols-1 xl:flex justify-center gap-6">
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-20px text-left">Message</h3>
            <input bind:value={text} on:input={calculateResult} id="serverJarName" class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
        </div>
        <div class="flex gap-6">
            <div class="flex flex-col">
                <h3 class="font-medium text-white text-20px text-left">Color #1</h3>
                <input type="color" bind:value={color1} on:input={calculateResult} class="rounded-full bg-transparent border-none self-center" />
            </div>
            <div class="flex flex-col h-full">
                <h3 class="font-medium text-white text-20px text-left">Color #2</h3>
                <input type="color" bind:value={color2} on:input={calculateResult} class="rounded-full bg-transparent border-none self-center" />
            </div>
        </div>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center">Chat Colors</h3>
        <div class="flex gap-3">
            <input bind:value={outputText} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-5 h-[35px] w-[100%] max-w-[100%] " disabled>
            <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block mt-5" on:click={copyValue}>Copy</button>
        </div>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center">MiniMessage</h3>
        <div class="flex gap-3">
            <input bind:value={outputMinimessage} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-5 h-[35px] w-[100%] max-w-[100%] " disabled>
            <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block mt-5" on:click={copyMinimessageValue}>Copy</button>
        </div>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center">Preview</h3>
        <p class="font-['Minecraft'] break-all text-2xl text-center mt-5" style="white-space: pre-wrap">{@html previewText}</p>
    </div>
</main>

<style>
    input::-webkit-color-swatch {
        border: none;
        border-radius: 6px;
        height: 180%
    }
</style>
