<script lang="ts">
    let activeTab = 0;

    const tabData = [
        {
            name: 'Windows',
            content: 'java -Xms4096M -Xmx4096M --add-modules=jdk.incubator.vector -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -jar server.jar --nogui',
        },
        {
            name: 'Linux/Mac',
            content: 'Content for Tab Two',
        }
    ];

    let serverJarName = "server.jar"
    let ram = "8GB"
    let flags = "aikar"
    let gui = false
    let autoRestart = false

    function calculateResult() {
        alert(serverJarName)
        alert(ram)
        alert(flags)
        alert(gui)
        alert(autoRestart)
    }

    function setActiveTab(index) {
        activeTab = index;
    }

    function updateStorageValue(event) {
        let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (inputValue.length > 3) {
            inputValue = inputValue.slice(0, 3); // Limit the total length to 3 characters
        }
        ram = inputValue + 'GB';
    }

    function copyValue() {
        navigator.clipboard.writeText(tabData[activeTab].content)
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-3">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Server Jar Name</h3>
        <input bind:this={serverJarName} value="server.jar" id="serverJarName" class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">RAM</h3>
        <input type="text" inputmode="numeric" pattern="[0-9]*" bind:value={ram} on:input={updateStorageValue} class="w-[160px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
    </div>
    <div class="flex flex-col w-[160px]">
        <h3 class="font-medium text-white text-[20px] text-left">Flags</h3>
        <select bind:value={flags} id="flags" class=" py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="none" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]" >None</option>
            <option value="aikar" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Aikar's Flags</option>
            <option value="proxy" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Proxy Flags</option>
        </select>
    </div>
    <div class="flex flex-col">
        <label class="relative inline-flex items-center mb-4 cursor-pointer">
            <input bind:this={gui} id="gui" type="checkbox" value="" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <p class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                <a href="#"
                   class="text-white transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                   data-te-toggle="tooltip"
                   title="This starts an inbuilt GUI control panel as well as the console.">Additional GUI</a>
            </p>
        </label>
        <label class="relative inline-flex items-center mb-4 cursor-pointer">
            <input bind:this={autoRestart} id="autoRestart" type="checkbox" value="" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <p class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                <a href="#"
                   class="text-white transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                   data-te-toggle="tooltip"
                   title="This restarts the server after it has crashed or stopped.">Auto-restart</a>
            </p>
        </label>
    </div>
</div>

<div class="flex flex-col w-[50%]">
    <h3 class="font-medium text-white text-[20px] text-left mt-12 text-center mb-5">Result</h3>
    <div class="tab-system w-[100%] flex flex-col">
        <div class="flex self-center">
            {#each tabData as tab, index}
                <button class="px-4 py-2 mr-2 rounded focus:outline-none"
                        class:bg-gray-200={index === activeTab}
                        on:click={() => setActiveTab(index)}>
                    {tab.name}
                </button>
            {/each}
        </div>
        <div class="mt-4">
            {#each tabData as tab, index}
                {#if index === activeTab}
                    <code class="inline-block w-full text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517]">
                        {tab.content}
                    </code>
                {/if}
            {/each}
        </div>
        <div class="flex gap-3 mt-3">
            <button class="w-fit text-sm px-2 py-1.5" on:click={copyValue}>Copy</button>
            <button class="w-fit text-sm px-2 py-1.5">Download</button>
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