<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";
    import {trackEvent} from "$lib/google/gtag";
    import info from "$lib/server-jars.json"

    let selectedType = "paper"
    let selectedVersion = "1.20.2"

    function downloadSuccess() {
        getDownloadURL()
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        trackEvent('server-jars-download', 'type', selectedType);
    }

    onMount(() => {
        getDownloadURL()
    })

    let downloadURL = ""
    function getDownloadURL() {
        const result = info.find(item => item.platform === selectedType);
        if (result) {
            const jar = result.jars.find(item => item.version === selectedVersion);
            if (jar) {
                downloadURL = jar.downloadURL;
                return true
            }
        }
        return false
    }

    // Keep selected version if exists in new type, if not select highest
    function select() {
        if (!getDownloadURL()) {
            const result = info.find(item => item.platform === selectedType);
            selectedVersion = result?.jars[0].version
        }
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} on:change={select} id="type" class="w-[140px] scroll">
            <option value="velocity" class="scroll-option">Velocity (Proxy)</option>
            <option value="waterfall" class="scroll-option">Waterfall (Proxy)</option>
            <option disabled value="bungee" class="scroll-option">BungeeCord (Coming Soon)</option>
            <option value="fabric" class="scroll-option">Fabric</option>
            <option value="forge" class="scroll-option">Forge</option>
            <option value="folia" class="scroll-option">Folia</option>
            <option value="purpur" class="scroll-option">Purpur</option>
            <option value="pufferfish" class="scroll-option">Pufferfish</option>
            <option value="paper" class="scroll-option">Paper</option>
            <option value="spigot" class="scroll-option">Spigot</option>
            <option value="craftbukkit" class="scroll-option">CraftBukkit</option>
            <option value="vanilla" class="scroll-option">Vanilla</option>
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select bind:value={selectedVersion} id="underline_select2" class="w-[120px] scroll">
            {#each info.find(item => item.platform === selectedType).jars as jar}
                <option value="{jar.version}" class="scroll-option">{jar.version}</option>
            {/each}
        </select>
    </div>
    {#if selectedType === "paper" || selectedType === "pufferfish" || selectedType === "purpur" || selectedType === "folia" || selectedType === "waterfall" || selectedType === "velocity" || selectedType === "forge" || selectedType === "fabric"}
        <a href="{downloadURL}" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
    {:else}
        <a href="https://cdn.mcutils.com/jars/{selectedType}-{selectedVersion}.jar" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
    {/if}
</div>

<table class="w-[90%] lg:w-[60%] text-white mt-12">
    <tr class="bg-[#1d1f24]">
        <th class="rounded-tl-lg rounded-bl-lg p-2 pl-6 font-medium text-[20px] text-left">Version</th>
        <th class="font-medium text-[20px] text-left">Release Date</th>
        <th class="rounded-tr-lg rounded-br-lg font-medium text-[20px] text-left">Size</th>
        <th class="font-medium text-[20px] text-left bg-[#1a1b1e] "></th>
    </tr>
    {#each info.find(item => item.platform === selectedType).jars as jar}
        <tr class="">
            <td class="pl-6 p-1.5 border-b-2 border-b-[#1D1F24] text-gray-400">{jar.version}</td>
            <td class="border-b-2 border-b-[#1D1F24] text-gray-400">{jar.release}</td>
            <td class="border-b-2 border-b-[#1D1F24] text-gray-400">{jar.size}</td>
            <td>
                <a aria-label='Download Jar' href="{jar.downloadURL ? jar.downloadURL : 'https://cdn.mcutils.com/jars/' + selectedType + '-' + jar.version + '.jar'}">
                    <button on:click={downloadSuccess}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-[#626875] pl-4 h-5"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                    </button>
                </a>
            </td>
        </tr>
    {/each}
</table>