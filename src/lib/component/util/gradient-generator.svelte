<script lang="ts">
    import ColorPicker from "svelte-awesome-color-picker";
    import {toast} from "@zerodevx/svelte-toast";
    import {afterUpdate} from "svelte";

    let text = "awddwawad"
    let hex;
    let rgb;
    
    let outputText = ""
    let previewText = ""

    function calculateResult() {

        const numSteps = text.length;
        const startColor = parseInt(hex.slice(1), 16);
        alert("lading")
        const endColor = parseInt(hex.slice(1), 16);
        let gradientString = '';

        alert("lading")

        for (let i = 0; i < numSteps; i++) {
            const ratio = i / (numSteps - 1);
            const color = Math.floor(startColor * (1 - ratio) + endColor * ratio);
            const hex = color.toString(16).padStart(6, '0');
            const colorCode = `&#${hex}`;
            gradientString += colorCode + text[i];
        }

        outputText = gradientString
    }

    function copyValue() {
        navigator.clipboard.writeText(outputText)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

</script>

<main class="w-[60%]">
    <div class="place-items-center text-center items-start grid grid-cols-1 xl:flex justify-center gap-6">
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-left">Message</h3>
            <input bind:value={text} on:input={calculateResult} id="serverJarName" class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
        </div>
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-left">Color #1</h3>
            <div class="self-center text-[#626875] font-medium">
                <ColorPicker bind:hex label="Choose Color" />
            </div>
        </div>
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-left">Color #2</h3>
            <div class="self-center text-[#626875] font-medium">
                <ColorPicker bind:rgb label="Choose Color" />
            </div>
        </div>
    </div>

    <div class="flex gap-3">
        <input bind:value={outputText} class="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-8 h-[35px] w-[100%] max-w-[100%] " disabled>
        <button class="w-fit text-sm px-2 py-1.5 button h-fit inline-block mt-8" >Copy</button>
    </div>

    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] mt-8 text-center mb-5">Preview</h3>
        <p class="font-['Minecraft'] break-all text-2xl text-center mt-8" style="white-space: pre-wrap">{@html previewText}</p>
    </div>
</main>