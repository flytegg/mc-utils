<script lang="ts">
    import { toast } from "@zerodevx/svelte-toast";
    import { onMount } from "svelte";

    type Platform = { key: string, name: string, url: string, versionLabel: string };
    type Version = { version: string, build?: string, release?: string, url: string, downloadUrl?: string };

    let platforms: Platform[] = [];
    let versions: Version[] = [];
    let selectedType = "paper";
    let selectedVersion = "";
    let selectedDownloadUrl = "";
    let isLoading = true;
    let latestRequest = 0;

    $: versionLabel = platforms.find(p => p.key === selectedType)?.versionLabel ?? "Minecraft Version";
    $: showBuild = versions.some(version => version.build);

    onMount(async () => {
        platforms = await getServerJarPlatforms();
        await updateVersions();
    });

    async function updateVersions() {
        const request = ++latestRequest;
        isLoading = true;
        const result = await getServerJarVersions(selectedType);
        // Ignore responses for a type that is no longer selected
        if (request !== latestRequest) return;
        versions = result;
        selectedVersion = versions[0]?.version || "";
        updateSelectedDownloadUrl();
        isLoading = false;
    }

    function updateSelectedDownloadUrl() {
        selectedDownloadUrl = versions.find(v => v.version === selectedVersion)?.downloadUrl ?? "";
    }

    async function getServerJarPlatforms(): Promise<Platform[]> {
        const response = await fetch("/api/server-jars");
        const data: Platform[] = await response.json();
        return data.filter(item => item.key !== "spigot" && item.key !== "craftbukkit");
    }

    async function getServerJarVersions(type: string): Promise<Version[]> {
        const response = await fetch(`/api/server-jars/${type}`);
        return response.ok ? await response.json() : [];
    }

    async function handleTypeChange() {
        selectedDownloadUrl = "";  // Clear the URL immediately
        versions = [];
        await updateVersions();
    }

    async function handleVersionChange() {
        updateSelectedDownloadUrl();
    }

    function downloadSuccess() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        });
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} on:change={handleTypeChange} id="type" class="w-[140px] scroll">
            {#each platforms as platform}
                <option value={platform.key} class="scroll-option">{platform.name}</option>
            {/each}
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select bind:value={selectedVersion} on:change={handleVersionChange} id="underline_select2" class="w-[120px] scroll">
            {#each versions as version}
                <option value={version.version} class="scroll-option">{version.version}</option>
            {/each}
        </select>
    </div>
    <a href={selectedDownloadUrl} aria-label='Download Jar' class="self-end">
        <button class="button h-fit" on:click={downloadSuccess}>Download</button>
    </a>
</div>

{#if isLoading}
    <div class="flex flex-col items-center gap-3 mt-32" role="status">
        <div class="h-9 w-9 rounded-full border-[3px] border-[#232324] border-t-[#9d9d9e] animate-spin"></div>
        <span class="text-[#9d9d9e] text-sm font-medium">Loading versions...</span>
    </div>
{:else}
    <table class="w-[90%] lg:w-[60%] text-white mt-12">
        <tr class="border-b-[1.5px] border-b-[#232324] text-[#9d9d9e]">
            <th class="rounded-tl-lg rounded-bl-lg p-2 font-medium text-left">{versionLabel}</th>
            {#if showBuild}
                <th class="font-medium text-left">Build</th>
            {/if}
            <th class="font-medium text-left">Release Date</th>
        </tr>
        {#each versions as version}
            <tr class="border-b-[1px] border-b-[#232324] text-[#cecece]">
                <td class="p-2 ">{version.version}</td>
                {#if showBuild}
                    <td class="">{version.build ?? '-'}</td>
                {/if}
                <td class="">{version.release || 'Not known'}</td>
                <td class="justify-end">
                    <div class="flex justify-end items-center h-full pr-1">
                        {#if version.downloadUrl}
                            <a aria-label='Download Jar' href={version.downloadUrl}>
                                <button on:click={downloadSuccess}>
                                    <svg class="fill-[#626875] pl-4 h-5" viewBox="0 0 384 512">
                                        <path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/>
                                    </svg>
                                </button>
                            </a>
                        {:else}
                            <svg class="fill-[#626875] pl-4 h-5 opacity-30 cursor-not-allowed" viewBox="0 0 384 512">
                                <path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/>
                            </svg>
                        {/if}
                    </div>
                </td>
            </tr>
        {/each}
    </table>
{/if}
