<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";

    let soundStructure: SoundStructure = {};
    let selectedCategory: string = '';
    let selectedSubCategory: string = '';
    let searchValue: string = '';
    let audioElement: HTMLAudioElement | null = null;
    let filteredSounds: Sound[] = [];

    interface Sound {
        category: string;
        subCategory?: string;
        name: string;
        path: string;
        displayPath: string;
    }

    let soundFiles;
    let sounds: Sound[] = [];
    let soundControls: Record<string, { pitch: number; volume: number }> = {};

    onMount(async () => {
        await loadSoundFiles();
        initializeSounds();
    });

    async function loadSoundFiles() {
        soundFiles = import.meta.glob('/static/sounds/**/*.{mp3,ogg,wav}', {
            eager: true,
            as: 'url'
        });

        Object.keys(soundFiles).forEach((path) => {
            const cleanPath = path
                .replace('/static/sounds/', '')
                .replace(/\.(mp3|ogg|wav)$/, '');

            const [category, ...rest] = cleanPath.split('/');

            if (!soundStructure[category]) {
                soundStructure[category] = {name: category};
            }

            if (rest.length > 1) {
                const subCategory = rest[0];
                const soundName = rest[1];

                if (!soundStructure[category].subCategories) {
                    soundStructure[category].subCategories = {};
                }

                if (!soundStructure[category].subCategories![subCategory]) {
                    soundStructure[category].subCategories![subCategory] = [];
                }

                soundStructure[category].subCategories![subCategory].push(soundName);
            } else {
                if (!soundStructure[category].sounds) {
                    soundStructure[category].sounds = [];
                }
                soundStructure[category].sounds!.push(rest[0]);
            }
        });
    }

    function initializeSounds() {
        Object.entries(soundStructure).forEach(([category, data]) => {
            if (data.sounds) {
                data.sounds.forEach(sound => {
                    const newSound = {
                        category,
                        name: sound,
                        path: `${category}/${sound}`,
                        displayPath: sound
                    };
                    sounds.push(newSound);
                    soundControls[newSound.path] = { pitch: 1, volume: 1 };
                });
            }
            if (data.subCategories) {
                Object.entries(data.subCategories).forEach(([subCategory, subSounds]) => {
                    subSounds.forEach(sound => {
                        const newSound = {
                            category,
                            subCategory,
                            name: sound,
                            path: `${category}/${subCategory}/${sound}`,
                            displayPath: sound
                        };
                        sounds.push(newSound);
                        soundControls[newSound.path] = { pitch: 1, volume: 1 };
                    });
                });
            }
        });
        updateFilteredSounds();
    }

    interface SoundCategory {
        name: string;
        subCategories?: { [key: string]: string[] };
        sounds?: string[];
    }

    interface SoundStructure {
        [category: string]: SoundCategory;
    }

    function formatSoundPath(sound: Sound): string {
        return sound.path.replace(/\//g, '.');
    }

    function getSoundUrl(sound: Sound): string {
        return `/sounds/${sound.path}.ogg`;
    }

    function updateFilteredSounds() {
        filteredSounds = sounds.filter(sound => {
            const matchesSearch = !searchValue ||
                sound.path.toLowerCase().includes(searchValue.toLowerCase());
            const matchesCategory = !selectedCategory ||
                sound.category === selectedCategory;
            const matchesSubCategory =
                !selectedSubCategory ||
                (sound.subCategory && sound.subCategory === selectedSubCategory) ||
                (!sound.subCategory && selectedSubCategory === selectedCategory);

            let displayPath = sound.name;
            if (!selectedCategory) {
                displayPath = formatSoundPath(sound);
            } else if (!selectedSubCategory && sound.subCategory) {
                displayPath = `${sound.subCategory}.${sound.name}`;
            }
            sound.displayPath = displayPath;

            return matchesSearch && matchesCategory && matchesSubCategory;
        });
    }

    $: {
        searchValue;
        updateFilteredSounds();
    }

    $: categories = Object.keys(soundStructure);

    $: subCategories = selectedCategory && soundStructure[selectedCategory]?.subCategories
        ? Object.keys(soundStructure[selectedCategory].subCategories!)
        : [];

    function playSound(sound: Sound) {
        if (audioElement) {
            audioElement.pause();
        }
        audioElement = new Audio(getSoundUrl(sound));
        const controls = soundControls[sound.path];
        audioElement.playbackRate = controls.pitch;
        audioElement.volume = controls.volume;
        audioElement.play();
    }

    function downloadSound(sound: Sound) {
        const url = getSoundUrl(sound);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formatSoundPath(sound)}.ogg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast.push("Downloaded successfully!", {
            theme: {
                "--toastColor": "mintcream",
                "--toastBackground": "rgba(72,187,120,0.9)",
                "--toastBarBackground": "#2F855A",
            },
        });
    }

    function copyGameCommand(sound: Sound) {
        const controls = soundControls[sound.path];
        const command = `/playsound ${formatSoundPath(sound)} master @p ~ ~ ~ ${controls.volume} ${controls.pitch}`;
        navigator.clipboard.writeText(command);
        toast.push("Copied successfully!", {
            theme: {
                "--toastColor": "mintcream",
                "--toastBackground": "rgba(72,187,120,0.9)",
                "--toastBarBackground": "#2F855A",
            },
        });
    }

    function handleCategoryChange() {
        if (!soundStructure[selectedCategory]?.subCategories) {
            selectedSubCategory = selectedCategory;
        } else if (subCategories.length > 0) {
            selectedSubCategory = subCategories[0];
        }
        updateFilteredSounds();
    }

    function handleSubCategoryChange() {
        updateFilteredSounds();
    }

    $: showType = selectedCategory && soundStructure[selectedCategory]?.subCategories;

    function disallowSpaces(event: KeyboardEvent) {
        if (event.key === " ") {
            event.preventDefault();
        }
    }
</script>

<div class="sound-explorer p-4">
    <div class="flex flex-col">
        <input
                class="search w-[26rem] mb-6"
                bind:value={searchValue}
                type="text"
                placeholder="Search sounds... "
                on:keydown={disallowSpaces}
        />

        <div class="flex gap-4">
            <div class="flex flex-col">
                <h3 class="font-medium text-white text-[20px] text-left">Category</h3>
                <select
                        bind:value={selectedCategory}
                        on:change={handleCategoryChange}
                        id="type"
                        class="w-[140px] scroll"
                >
                    {#each categories as category}
                        <option value={category} class="scroll-option">{category}</option>
                    {/each}
                </select>
            </div>

            <div class="flex flex-col">
                <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
                <select
                        bind:value={selectedSubCategory}
                        on:change={handleSubCategoryChange}
                        id="underline_select2"
                        class="w-[120px] scroll"
                        disabled={!showType}
                >
                    {#if showType}
                        {#each subCategories as type}
                            <option value={type} class="scroll-option">{type}</option>
                        {/each}
                    {:else}
                        <option value={selectedCategory}>{selectedCategory}</option>
                    {/if}
                </select>
            </div>
        </div>
    </div>

    <table class="table-fixed w-full text-white mt-6">
        <thead>
        <tr class="border-b-[1.5px] border-b-[#232324] text-[#9d9d9e]">
            <th class="p-2 font-medium text-left">Sound</th>
            <th class="p-2 font-medium text-center">Controls</th>
            <th class="p-2 font-medium text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each filteredSounds as sound}
            <tr class="border-b-[1px] border-b-[#232324] text-[#cecece]">
                <td class="p-2">{sound.displayPath}</td>
                <td class="p-2">
                    <div class="flex items-center gap-4 justify-center">
                        <div class="flex items-center gap-2">
                            <span class="text-sm">Pitch:</span>
                            <input
                                    type="range"
                                    bind:value={soundControls[sound.path].pitch}
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    class="w-24"
                            />
                            <span class="text-sm w-12">
                                {soundControls[sound.path].pitch.toFixed(1)}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm">Volume:</span>
                            <input
                                    type="range"
                                    bind:value={soundControls[sound.path].volume}
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    class="w-24"
                            />
                            <span class="text-sm w-12">
                                {(soundControls[sound.path].volume * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </td>
                <td class="p-2">
                    <div class="flex justify-center gap-2">
                        <button
                                on:click={() => playSound(sound)}
                                class="button"
                        >
                            Play
                        </button>
                        <button
                                on:click={() => downloadSound(sound)}
                                class="button"
                        >
                            Download
                        </button>
                        <button
                                on:click={() => copyGameCommand(sound)}
                                class="button"
                        >
                            Copy
                        </button>
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>