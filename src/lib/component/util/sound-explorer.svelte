<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onDestroy, onMount} from "svelte";

    let soundStructure: SoundStructure = {};
    let selectedCategory: string = '';
    let selectedSubCategory: string = '';
    let searchValue: string = '';
    let audioElement: HTMLAudioElement | null = null;
    // Stop any sound still playing when leaving this util
    onDestroy(() => audioElement?.pause());
    let filteredSounds: Sound[] = [];
    let soundIdMapping: Record<string, string> = {};

    interface Sound {
        category: string;
        subCategory?: string;
        name: string;
        path: string;
        displayPath: string;
        commandId?: string;
    }

    interface SoundData {
        sounds: Array<string | { name: string; pitch?: number; volume?: number }>;
        subtitle?: string;
    }

    let soundFiles;
    let sounds: Sound[] = [];
    let soundControls: Record<string, { pitch: number; volume: number }> = {};

    onMount(async () => {
        await loadSoundJson();
        await loadSoundFiles();
        initializeSounds();
    });

    async function loadSoundJson() {
        try {
            const response = await fetch('/static/sounds/sounds.json');
            if (!response.ok) {
                console.error('Failed to load sounds.json');
                return;
            }

            const soundData: Record<string, SoundData> = await response.json();

            // Build the reverse mapping (resource path → command ID)
            Object.entries(soundData).forEach(([commandId, data]) => {
                if (data.sounds && Array.isArray(data.sounds)) {
                    data.sounds.forEach(sound => {
                        if (typeof sound === 'string') {
                            soundIdMapping[sound] = commandId;
                        } else if (sound) {
                            soundIdMapping[sound.name] = commandId;
                        }
                    });
                }
            });

            console.log('Sound ID mapping loaded:', soundIdMapping);
        } catch (error) {
            console.error('Error loading sounds.json:', error);
        }
    }

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
                    const resourcePath = `${category}/${sound}`;
                    const newSound = {
                        category,
                        name: sound,
                        path: resourcePath,
                        displayPath: sound,
                        commandId: getCommandId(resourcePath)
                    };
                    sounds.push(newSound);
                    soundControls[newSound.path] = { pitch: 1, volume: 1 };
                });
            }
            if (data.subCategories) {
                Object.entries(data.subCategories).forEach(([subCategory, subSounds]) => {
                    subSounds.forEach(sound => {
                        const resourcePath = `${category}/${subCategory}/${sound}`;
                        const newSound = {
                            category,
                            subCategory,
                            name: sound,
                            path: resourcePath,
                            displayPath: sound,
                            commandId: getCommandId(resourcePath)
                        };
                        sounds.push(newSound);
                        soundControls[newSound.path] = { pitch: 1, volume: 1 };
                    });
                });
            }
        });
        updateFilteredSounds();
    }

    function getCommandId(resourcePath: string): string {
        // Try exact match first
        if (soundIdMapping[resourcePath]) {
            return soundIdMapping[resourcePath];
        }

        const pathWithoutExt = resourcePath.replace(/\.(mp3|ogg|wav)$/, '');
        if (soundIdMapping[pathWithoutExt]) {
            return soundIdMapping[pathWithoutExt];
        }

        if (resourcePath.startsWith('mob/')) {
            const entityPath = 'entity.' + resourcePath.substring(4).replace(/\//g, '.');
            return entityPath.replace(/\.(mp3|ogg|wav)$/, '');
        }

        return resourcePath.replace(/\//g, '.').replace(/\.(mp3|ogg|wav)$/, '');
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
        // Use the commandId if available, otherwise fall back to the formatted path
        if (sound.commandId) {
            return sound.commandId;
        }
        return sound.path.replace(/\//g, '.');
    }

    function getSoundUrl(sound: Sound): string {
        return `/sounds/${sound.path}.ogg`;
    }

    function updateFilteredSounds() {
        filteredSounds = sounds.filter(sound => {
            const matchesSearch = !searchValue ||
                sound.path.toLowerCase().includes(searchValue.toLowerCase()) ||
                (sound.commandId && sound.commandId.toLowerCase().includes(searchValue.toLowerCase()));
            const matchesCategory = !selectedCategory ||
                sound.category === selectedCategory;
            const matchesSubCategory =
                !selectedSubCategory ||
                (sound.subCategory && sound.subCategory === selectedSubCategory) ||
                (!sound.subCategory && selectedSubCategory === selectedCategory);

            let displayPath = sound.name;
            if (!selectedCategory) {
                displayPath = sound.commandId || formatSoundPath(sound);
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

<div class="sound-explorer w-full xl:w-[90%] px-4 pb-4">
    <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
        <input
                class="search md:flex-1 md:min-w-0 md:max-w-[26rem]"
                bind:value={searchValue}
                type="text"
                placeholder="Search sounds... "
                on:keydown={disallowSpaces}
        />

        <div class="flex gap-4">
            <div class="flex flex-col flex-1 min-w-0 md:flex-none md:w-[140px]">
                <h3 class="font-medium text-white text-[20px] text-left">Category</h3>
                <select
                        bind:value={selectedCategory}
                        on:change={handleCategoryChange}
                        id="type"
                        class="scroll"
                >
                    {#each categories as category}
                        <option value={category} class="scroll-option">{category}</option>
                    {/each}
                </select>
            </div>

            <div class="flex flex-col flex-1 min-w-0 md:flex-none md:w-[140px]">
                <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
                <select
                        bind:value={selectedSubCategory}
                        on:change={handleSubCategoryChange}
                        id="underline_select2"
                        class="scroll"
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

    <!-- Stacked cards on mobile, three-column table layout from xl up -->
    <div class="w-full text-white mt-6">
        <div class="sound-row hidden xl:grid border-b-[1.5px] border-b-[#232324] text-[#9d9d9e] font-medium">
            <span class="p-2 text-left">Sound</span>
            <span class="p-2 text-center">Controls</span>
            <span class="p-2 text-center">Actions</span>
        </div>
        {#each filteredSounds as sound}
            <div class="sound-row flex flex-col gap-3 py-4 xl:py-0 xl:gap-0 border-b-[1px] border-b-[#232324] text-[#cecece]">
                <span class="xl:p-2 font-medium xl:font-normal [overflow-wrap:anywhere]">{sound.displayPath}</span>
                <div class="xl:p-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <label class="flex items-center gap-2">
                        <span class="text-sm w-14 shrink-0">Pitch</span>
                        <input
                                type="range"
                                bind:value={soundControls[sound.path].pitch}
                                min="0.5"
                                max="2"
                                step="0.1"
                                class="flex-1 min-w-0 xl:w-24 xl:flex-none"
                        />
                        <span class="text-sm w-10 shrink-0 text-right tabular-nums">
                            {soundControls[sound.path].pitch.toFixed(1)}
                        </span>
                    </label>
                    <label class="flex items-center gap-2">
                        <span class="text-sm w-14 shrink-0">Volume</span>
                        <input
                                type="range"
                                bind:value={soundControls[sound.path].volume}
                                min="0"
                                max="1"
                                step="0.1"
                                class="flex-1 min-w-0 xl:w-24 xl:flex-none"
                        />
                        <span class="text-sm w-10 shrink-0 text-right tabular-nums">
                            {(soundControls[sound.path].volume * 100).toFixed(0)}%
                        </span>
                    </label>
                </div>
                <div class="xl:p-2 grid grid-cols-3 xl:flex xl:justify-center gap-2">
                    <button
                            on:click={() => playSound(sound)}
                            class="button px-2 py-2 text-sm xl:text-base xl:px-4 xl:py-2.5"
                    >
                        Play
                    </button>
                    <button
                            on:click={() => downloadSound(sound)}
                            class="button px-2 py-2 text-sm xl:text-base xl:px-4 xl:py-2.5"
                    >
                        Download
                    </button>
                    <button
                            on:click={() => copyGameCommand(sound)}
                            class="button px-2 py-2 text-sm xl:text-base xl:px-4 xl:py-2.5"
                    >
                        Copy
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    @media (min-width: 1280px) {
        .sound-row {
            display: grid;
            /* Fixed widths so the header and every row line up as columns */
            grid-template-columns: minmax(0, 1fr) 440px 300px;
            align-items: center;
        }
    }
</style>