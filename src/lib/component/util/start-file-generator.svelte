<script lang="ts">
	import { onMount } from 'svelte';
    import {toast} from "@zerodevx/svelte-toast";

    let activeTab = 0;

    const tabData = [
        {
            name: 'Windows',
            content: '',
        },
        {
            name: 'Linux/MacOS',
            content: '',
        }
    ];

    let serverJarName = "server.jar"
    let ram = "8GB"
    let flags = "aikar"
    let gui = false
    let autoRestart = false

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const ramParam = urlParams.get('ram');
        if (ramParam) {
            ram = ramParam;
            calculateResult();
        }
    })

    function calculateResult() {
        let java = "java %ram% %flags% -jar %filename% %gui%"
        java = java.replace(" %ram%", " -Xmx" + ram.replace("GB","G"))
        java = java.replace(" %flags%",
            flags === "none" ? "" :
                (flags === "aikar" ? " -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Daikars.new.flags=true -Dusing.aikars.flags=https://mcutils.com" : (flags === "aikarex" ? " -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=40 -XX:G1MaxNewSizePercent=50 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=15 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=20 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Daikars.new.flags=true -Dusing.aikars.flags=https://mcutils.com" : " -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -XX:MaxInlineLevel=15")))
        java = java.replace(" %filename%", " " + serverJarName)
        java = java.replace(" %gui%", gui || isProxySelected() ? "" : " --nogui")

        let windows = java
        if (autoRestart) {
            windows = ":start<br>" + windows + "<br><br>echo Server restarting...<br>goto :start";
        }
        tabData[0].content = windows

        let linuxMac
        if (autoRestart) {
            linuxMac = "#!/bin/bash<br><br>while [ true ]; do<br>&emsp;&emsp;&emsp;&emsp;" + java + "<br><br>&emsp;&emsp;&emsp;&emsp;echo Server restarting...<br>done"
        } else {
            linuxMac = "#!/bin/bash<br><br>" + java
        }

        tabData[1].content = linuxMac
    }

    calculateResult()

    function setActiveTab(index) {
        activeTab = index;
    }

    function updateStorageValue(event) {
        let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (inputValue.length > 3) {
            inputValue = inputValue.slice(0, 3); // Limit the total length to 3 characters
        }
        ram = inputValue + 'GB';
        calculateResult()
    }

    function copyValue() {
        navigator.clipboard.writeText(tabData[activeTab].content)
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    function downloadStartBat() {
        const content = tabData[activeTab].content.replace(/<br>/g, '\n').replace(/&emsp;/g, ' ')
        const blob = new Blob([content], { type: "text/plain" });
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = "start." + (activeTab == 0 ? "bat" : "sh");
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    function isProxySelected() {
        return flags === "proxy"
    }

    function CalculateRam() {
        window.location.href = `/ram-calculator`;
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mt-3">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Server Jar Name</h3>
        <input bind:value={serverJarName} on:input={calculateResult} id="serverJarName" class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
    </div>
    <div class="flex flex-col">
        <div class="flex flex-row gap-4">
            <h3 class="font-medium text-white text-[20px] text-left">RAM</h3>
            <button on:click={CalculateRam} class="button text-sm w-fit px-2 py-1">Calculate</button>
        </div>
        <input type="text" inputmode="numeric" pattern="[0-9]*" bind:value={ram} on:input={updateStorageValue} class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
    </div>
    <div class="flex flex-col w-[160px]">
        <h3 class="font-medium text-white text-[20px] text-left">Flags</h3>
        <select bind:value={flags} on:change={calculateResult} id="flags" class=" py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="none" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]" >None</option>
            <option value="aikar" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Aikar's Flags</option>
            <option value="aikarex" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Aikar's Flags (Extreme 12gb+)</option>
            <option value="proxy" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Proxy Flags</option>
        </select>
    </div>
    <div class="flex flex-col">
        <label class="relative inline-flex items-center mb-4 cursor-pointer">
            <input disabled={isProxySelected()} bind:checked={gui} on:change={calculateResult} id="gui" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f55050]"></div>
            <p class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                <a href="#"
                   aria-label='Additional GUI'
                   class="text-white transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                   data-te-toggle="tooltip"
                   title="This starts an inbuilt GUI control panel as well as the console.">Additional GUI</a>
            </p>
        </label>
        <label class="relative inline-flex items-center mb-4 cursor-pointer">
            <input bind:checked={autoRestart} on:change={calculateResult} id="autoRestart" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-[#374151] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f55050]"></div>
            <p class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                <a href="#"
                   aria-label='Auto-restart'
                   class="text-white transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                   data-te-toggle="tooltip"
                   title="This restarts the server after it has crashed or stopped.">Auto-restart</a>
            </p>
        </label>
    </div>
</div>

<div class="flex flex-col w-[90%] lg:w-[60%]">
    <h3 class="font-medium text-white text-[20px] mt-12 text-center mb-5">Result</h3>
    <div class="tab-system w-[100%] flex flex-col">
        <div class="flex self-center">
            {#each tabData as tab, index}
                <button class="px-4 py-2 mr-2 rounded focus:outline-none button"
                        class:bg-gray-200={index === activeTab}
                        class:text-black={index === activeTab}
                        on:click={() => setActiveTab(index)}>
                    {tab.name}
                </button>
            {/each}
        </div>
        <div class="mt-4">
            {#each tabData as tab, index}
                {#if index === activeTab}
                    <code class="inline-block w-full text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517]">
                        {@html tab.content}
                    </code>
                {/if}
            {/each}
        </div>
        <div class="flex justify-center gap-3 mt-3">
            <button class="w-fit text-sm px-2 py-1.5 button" on:click={copyValue}>Copy</button>
            <button class="w-fit text-sm px-2 py-1.5 button" on:click={downloadStartBat}>Download</button>
        </div>
    </div>
</div>

<style>
    .tab-system .tab {
        display: none;
    }

    .tab-system .tab.active {
        display: block;
    }
</style>
