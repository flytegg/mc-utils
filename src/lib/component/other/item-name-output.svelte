<script lang="ts">
    import { itemNameOutput, renameHeldItem, type ItemVersion } from '$lib/minecraft/item-name';
    import { renameItemData } from '$lib/minecraft/item-data';

    export let input: string;
    let version = '26.3' as ItemVersion;
    let mode = 'held';
    let itemId = 'minecraft:diamond_sword';
    let existingData = '';
    let copyStatus = '';
    $: output = itemNameOutput(input, version, itemId);
    $: merged = merge(existingData, input, version, itemId);
    $: command = mode === 'held' ? renameHeldItem(input, version) : mode === 'data' ? merged.command : output.command;
    $: { input; version; itemId; mode; existingData; copyStatus = ''; }

    function merge(source: string, name: string, selectedVersion: ItemVersion, id: string) {
        if (!source.trim()) return { command: '', data: '', error: '' };
        try { return { ...renameItemData(source, name, selectedVersion, id), error: '' }; }
        catch (error) { return { command: '', data: '', error: error instanceof Error ? error.message : 'Could not read the item data.' }; }
    }

    async function copy(value: string) {
        try {
            await navigator.clipboard.writeText(value);
            copyStatus = 'Copied successfully!';
        } catch {
            copyStatus = 'Could not copy. Select the output and copy it manually.';
        }
    }
</script>

<details class="mt-6 text-sm text-gray-300">
    <summary class="cursor-pointer text-white font-medium py-2">Use on a weapon or item (Java Edition)</summary>
    <p class="mt-3">Color the item's name while keeping its enchantments and other data. Commands require cheats or operator permissions. This does not recolor the weapon's texture or work in Bedrock Edition.</p>
    <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <label class="flex flex-col gap-2 flex-1 min-w-0">
            Minecraft version
            <select bind:value={version} class="bg-[#141517] rounded-md p-2 w-full">
                <option value="26.3">Java 26.3</option>
                <option value="snbt-components">Java 1.21.5 through 26.2</option>
                <option value="json-components">Java 1.20.5 through 1.21.4</option>
                <option value="legacy">Java 1.16 through 1.20.4</option>
            </select>
        </label>
        <label class="flex flex-col gap-2 flex-1 min-w-0">
            What do you want to do?
            <select bind:value={mode} class="bg-[#141517] rounded-md p-2 w-full">
                <option value="held">Rename my existing weapon</option>
                <option value="data">Use my existing item data</option>
                <option value="new">Give a new item</option>
            </select>
        </label>
    </div>
    {#if mode === 'held'}
        {#if version === 'legacy'}
            <p class="mt-4">Drop just the weapon you want to rename, stand within 3 blocks of it, then run this command in chat and pick it back up. It renames the nearest dropped item, so move other dropped items away first. Enchantments, damage, lore, and other tags stay intact.</p>
        {:else}
            <p class="mt-4">Hold the weapon in your main hand and run this command in chat. Only its custom name changes. Enchantments, damage, lore, and other components stay intact.</p>
        {/if}
    {:else}
        <label class="flex flex-col gap-2 mt-4">
            Item ID {mode === 'data' ? '(used when your data has no id field)' : ''}
            <input bind:value={itemId} class="bg-[#141517] rounded-md p-2 w-full" placeholder="minecraft:diamond_sword" />
        </label>
        {#if mode === 'new'}
            <p class="mt-2">This gives a new item. To keep your current weapon's enchantments, choose “Rename my existing weapon”.</p>
            {#if !output.command}<p role="alert" class="mt-2 text-red-300">Enter a lowercase item ID without spaces, such as minecraft:diamond_sword.</p>{/if}
        {:else}
            <label class="flex flex-col gap-2 mt-4">
                Existing item data (SNBT)
                <textarea bind:value={existingData} rows="5" spellcheck="false" class="font-mono bg-[#141517] rounded-md p-2 w-full" placeholder={version === 'legacy' ? '{id:"minecraft:diamond_sword",Count:1b,tag:{Damage:12}}' : '{id:"minecraft:diamond_sword",count:1,components:{"minecraft:damage":12}}'}></textarea>
            </label>
            <p class="mt-2">Paste a complete item stack, or just its {version === 'legacy' ? 'tag' : 'components'} compound. To inspect your held weapon, run <code>/data get entity @s SelectedItem</code>. Copy only the compound in braces, without the surrounding chat message. Use the version the data came from; this tool does not migrate item data between versions.</p>
            {#if merged.error}<p role="alert" class="mt-2 text-red-300">{merged.error}</p>{/if}
            <p class="mt-2">The command gives a copy with your supplied data and the new name. Your original weapon stays unchanged. To rename it directly, choose “Rename my existing weapon”.</p>
        {/if}
    {/if}
    <label class="flex flex-col gap-2 mt-4">
        {mode === 'held' ? 'Rename command' : 'Give command'}
        <textarea readonly value={command} rows="4" class="font-mono bg-[#141517] rounded-md p-2 w-full"></textarea>
    </label>
    <button class="button mt-2" disabled={!command || !input} on:click={() => copy(command)}>Copy command</button>
    {#if command.length > 256}
        <p class="mt-2">This exceeds chat's 256-character limit. In a command block, run <code>/execute as YOUR_PLAYER_NAME at @s run </code> followed by this command without its leading slash. Replace YOUR_PLAYER_NAME with your Minecraft username.</p>
    {/if}
    {#if mode === 'data' && merged.data}
        <label class="flex flex-col gap-2 mt-4">
            Updated item data
            <textarea readonly value={merged.data} rows="5" class="font-mono bg-[#141517] rounded-md p-2 w-full"></textarea>
        </label>
        <button class="button mt-2" disabled={!input} on:click={() => copy(merged.data)}>Copy updated data</button>
    {/if}
    <details class="mt-4">
        <summary class="cursor-pointer py-2">Name value only</summary>
        <p class="mt-2">For manual editing, replace only {version === 'legacy' ? 'display.Name' : 'minecraft:custom_name'} with this value.</p>
        <label class="flex flex-col gap-2 mt-3">
            Name value
            <textarea readonly value={output.value} rows="4" class="font-mono bg-[#141517] rounded-md p-2 w-full"></textarea>
        </label>
        <button class="button mt-2" disabled={!input} on:click={() => copy(output.value)}>Copy name value</button>
    </details>
    <p role="status" class="mt-2">{copyStatus}</p>
</details>
