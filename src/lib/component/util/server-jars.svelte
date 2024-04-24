<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";
    import {incrementTracker} from "$lib/tracker/tracker";

    let selectedType = "paper"
    let selectedVersion = "1.20.4"
    let selectedDownloadUrl = ""

    onMount(() => {
        updateSelected()
        setTimeout(() => {
            document.getElementById("platformType").value = "paper"
        }, 50)
    })

    const updateSelected = async () => selectedDownloadUrl = await getServerJarDownloadUrl(selectedType, selectedVersion)

    const getServerJarPlatforms = async () => await (await fetch("/api/server-jars")).json()
    const getServerJarVersions = async (type: string) => await (await fetch(`/api/server-jars/${type}`)).json()
    const getServerJarDownloadUrl = async (type: string, version: string) => (await (await fetch(`/api/server-jars/${type}/${await getLatestServerJarVersionIfNotExists(type, version)}`)).json()).downloadUrl
    const getServerJarVersionsInfo = async (type: string) => Promise.all((await (await fetch(`/api/server-jars/${type}`)).json()).map(async (version: any) => await (await fetch(`/api/server-jars/${type}/${version.version}`)).json()))

    const getLatestServerJarVersionIfNotExists = async (type: string, version: string) => {
        const versions = await (await fetch(`/api/server-jars/${type}`)).json()
        return versions.find((v: any) => v.version === version).version ?? versions[0].version ?? 0
    }

    function downloadSuccess() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} on:change={updateSelected} id="platformType" class="w-[140px] scroll">
            {#await getServerJarPlatforms()}
                <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
            {:then platforms} 
                {#each platforms as platform}
                    <option value={platform.key} class="scroll-option">{platform.name}</option>
                {/each}
            {/await}
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select bind:value={selectedVersion} on:change={updateSelected} id="underline_select2" class="w-[120px] scroll">
            {#await getServerJarVersions(selectedType)}
                <svg class="h-10 animate-spin mt-40" fill="#3C414B" viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
            {:then versions} 
                {#each versions as version}
                    <option value="{version.version}" class="scroll-option">{version.version}</option>
                {/each}
            {/await}
        </select>
    </div>
    <a href="{selectedDownloadUrl}" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
</div>

{#await getServerJarVersionsInfo(selectedType)}
    <svg class="h-10 animate-spin mt-40 w-10 self-center" fill="#3C414B" viewBox="0 0 576 512"><defs><style>.fa-secondary{opacity:.4}</style></defs><path class="fa-primary" d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"/><path class="fa-secondary" d="M287.1 64C181.1 64 95.1 149.1 95.1 256C95.1 362 181.1 448 287.1 448C358.1 448 419.3 410.5 452.9 354.4L453 354.5C446.1 369.4 451.5 387.3 465.1 395.7C481.3 404.6 500.9 399.3 509.7 384C509.9 383.7 510.1 383.4 510.2 383.1C466.1 460.1 383.1 512 288 512C146.6 512 32 397.4 32 256C32 114.6 146.6 0 288 0C270.3 0 256 14.33 256 32C256 49.67 270.3 64 288 64H287.1z"/></svg>
{:then versions}
    <table class="w-[90%] lg:w-[60%] text-white mt-12">
        <tr class="border-b-[1.5px] border-b-[#232324] text-[#9d9d9e]">
            <th class="rounded-tl-lg rounded-bl-lg p-2 font-medium text-left">{selectedType === "velocity" ? 'Version' : 'Minecraft Version'}</th>
            <th class="font-medium text-left">Release Date</th>
        </tr>
        {#each versions as version}
            <tr class="border-b-[1px] border-b-[#232324] text-[#cecece]">
                <td class="p-2 ">{version.version}</td>
                <td class="">{version.release}</td>
                <td class="justify-end">
                    <div class="flex justify-end items-center h-full pr-1">
                        <a aria-label='Download Jar' href={version.downloadUrl}>
                            <button on:click={downloadSuccess}>
                                <svg class="fill-[#626875] pl-4 h-5" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                            </button>
                        </a>
                    </div>
                </td>
            </tr>
        {/each}
    </table>
{/await}
