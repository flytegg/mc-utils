<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {trackEvent} from "$lib/google/gtag";

    let selectedType = "paper"
    let selectedVersion = "1.20.2"

    const getServerJarPlatforms = async () => {
        return await (await fetch("/api/server-jars")).json()
    }

    const getServerJarVersions = async (type: string) => {
        return await (await fetch(`/api/server-jars/${type}`)).json()
    }

    const getServerJarDownloadUrl = async (type: string, version: string) => {
        return (await (await fetch(`/api/server-jars/${type}/${version}`)).json()).downloadUrl
    }

    function downloadSuccess() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        trackEvent('server-jars-download', 'type', `${selectedType}-${selectedVersion}`);
    }

    // Keep selected version if exists in new type, if not select highest
    function select() {
        // if (!getDownloadURL()) {
        //     const result = info.find(item => item.platform === selectedType);
        //     selectedVersion = result?.jars[0].version
        // }
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} on:change={select} id="type" class="w-[140px] scroll">
            {#await getServerJarPlatforms()}
                <h1>Loading</h1>
            {:then platforms} 
                {#each platforms as platform}
                    <option value={platform.key} class="scroll-option">{platform.name}</option>
                {/each}
            {/await}
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select bind:value={selectedVersion} id="underline_select2" class="w-[120px] scroll">
            {#await getServerJarVersions(selectedType)}
                <h1>Loading</h1>
            {:then versions} 
                {#each versions as version}
                    <option value="{version}" class="scroll-option">{version}</option>
                {/each}
            {/await}

        </select>
    </div>
    {#await getServerJarDownloadUrl(selectedType, selectedVersion)}
        <h1>Loading</h1>
    {:then downloadUrl} 
        <a href="{downloadUrl}" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
    {/await}
</div>

<table class="w-[90%] lg:w-[60%] text-white mt-12">
    <tr class="bg-[#1d1f24]">
        <th class="rounded-tl-lg rounded-bl-lg p-2 pl-6 font-medium text-[20px] text-left">Version</th>
        <th class="font-medium text-[20px] text-left">Release Date</th>
        <th class="rounded-tr-lg rounded-br-lg font-medium text-[20px] text-left">Size</th>
        <th class="font-medium text-[20px] text-left bg-[#1a1b1e] "></th>
    </tr>
    <!-- {#each info.find(item => item.platform === selectedType).jars as jar}
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
    {/each} -->
</table>