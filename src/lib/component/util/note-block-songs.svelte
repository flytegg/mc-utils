<script lang="ts">
    import {onMount} from "svelte"
    import {toast} from "@zerodevx/svelte-toast";
    let searchResults: Song[]

    type Song = {
        fileName: string,
        downloadUrl: string
    }

    let songs: Song[] = []

    async function fetchFilesFromRepo() {
        const owner = 'flytegg';
        const repo = 'nbs-songs';
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`

        const response = await fetch(apiUrl);
        const filesData = await response.json();

        if (!Array.isArray(filesData)) {
            throw new Error('Invalid response. Expected an array of files.')
        }

        songs = filesData
            .filter(file => file.type === 'file')
            .map(file => ({
                fileName: file.name,
                downloadUrl: file.download_url,
            }))
    }

    onMount(fetchFilesFromRepo);

    const updateSearch = async (query: string) => {
        searchResults = songs.filter(song => song.fileName.toLowerCase().includes(query.toLowerCase()))
    }

    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSearch(searchValue)
    }

    const handleInput = () => {
        updateSearch(searchValue)
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

<input class="search w-[26rem]" bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter song name..." on:keypress={handleKeyPress} on:blur={handleInput}>

<table class="w-[90%] lg:w-[60%] text-white mt-12">
    <tr class="border-b-[1.5px] border-b-[#232324] text-[#9d9d9e]">
        <th class="rounded-tl-lg rounded-bl-lg p-2 font-medium text-left">
            <p>Title</p>
        </th>
        <th class="flex justify-end relative">
            <a aria-label='Download All Songs' href="https://api.github.com/repos/flytegg/nbs-songs/zipball/master" download="https://api.github.com/repos/flytegg/nbs-songs/zipball/master" class="absolute -bottom-6">
                <button class="button text-sm p-1.5 w-[120px]" on:click={downloadSuccess}>Download All</button>
            </a>
        </th>
    </tr>
    {#each searchResults ? searchResults : songs as song}
        <tr class="border-b-[1px] border-b-[#232324] text-[#cecece]">
            <td class="p-2">{song.fileName}</td>
            <td class="justify-end">
                <div class="flex justify-end items-center h-full pr-1">
                    <a aria-label='Download Song' download={song.downloadUrl} href="{song.downloadUrl}">
                        <button on:click={downloadSuccess}>
                            <svg class="fill-[#626875] pl-4 h-5" viewBox="0 0 384 512"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                        </button>
                    </a>
                </div>
            </td>
        </tr>
    {/each}
</table>

<a class="flex gap-2 mt-10" href="https://github.com/flytegg/nbs-songs" aria-label='GitHub' target="_blank">
    <p class="text-[#cecece] text-md">See the GitHub </p>
    <img src="/icon/new-tab.svg" alt="New Tab Icon" class="justify-center">
</a>
