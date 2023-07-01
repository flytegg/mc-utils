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

<div class="search w-fit h-10 text-md">
    <img src="/icon/search.svg" alt="Search Icon" class="h-5">
    <input bind:value={searchValue} on:input={handleInput} type="text" placeholder="Enter song name..." on:keypress={handleKeyPress} on:blur={handleInput} class="w-full pt-0.5 pr-0.5 justify-center items-center self-center">
</div>
<table class="w-[90%] lg:w-[60%] text-white mt-12">
    <tr class="bg-[#1d1f24]">
        <th class="p-2 pl-6 font-medium text-[20px] text-left flex rounded-tl-lg rounded-bl-lg">
            <p>Title</p>
            <a href="https://api.github.com/repos/flytegg/nbs-songs/zipball/master" download="https://api.github.com/repos/flytegg/nbs-songs/zipball/master" class="ml-auto">
                <button class="button text-sm p-1.5" on:click={downloadSuccess}>Download All</button>
            </a>
        </th>
    </tr>
    {#each searchResults ? searchResults : songs as song}
        <tr class=" ">
            <td class="pl-6 p-1.5 border-b-2 border-b-[#1D1F24] text-gray-400 rounded-bl-lg">{song.fileName}</td>
            <td class=" self-center mt-1 justify-center items-center">
                <a download={song.downloadUrl} href="{song.downloadUrl}">
                    <button on:click={downloadSuccess}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-[#626875] h-5"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                    </button>
                </a>
            </td>
        </tr>
    {/each}
</table>


<a class="flex gap-2 mt-10" href="https://github.com/flytegg/nbs-songs" target="_blank">
    <p class="text-gray-400 text-md">See the GitHub </p>
    <img src="/icon/new-tab.svg" alt="New Tab Icon" class="justify-center">
</a>