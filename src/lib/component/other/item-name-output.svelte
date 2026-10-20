<script lang="ts">
    import { itemNameOutput, type ItemVersion } from '$lib/minecraft/item-name';

    export let input: string;
    let version = 'snbt-components' as ItemVersion;
    let itemId = 'minecraft:diamond_sword';
    let copyStatus = '';
    $: output = itemNameOutput(input, version, itemId);
    $: { input; version; itemId; copyStatus = ''; }

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
    <p class="mt-3">This colors the item's name, not its texture. Choose your Java version. Commands require cheats or operator permissions. This output is not for Bedrock Edition.</p>
    <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <label class="flex flex-col gap-2 flex-1 min-w-0">
            Minecraft version
            <select bind:value={version} class="bg-[#141517] rounded-md p-2 w-full">
                <option value="snbt-components">Java 1.21.5 and later</option>
                <option value="json-components">Java 1.20.5 – 1.21.4</option>
                <option value="legacy">Java 1.16 – 1.20.4</option>
            </select>
        </label>
        <label class="flex flex-col gap-2 flex-1 min-w-0">
            Item ID
            <input bind:value={itemId} aria-invalid={!output.command} class="bg-[#141517] rounded-md p-2 w-full" placeholder="minecraft:diamond_sword" />
        </label>
    </div>
    {#if !output.command}
        <p role="alert" class="mt-2 text-red-300">Enter an item ID such as minecraft:diamond_sword, using lowercase letters and no spaces.</p>
    {/if}
    <label class="flex flex-col gap-2 mt-4">
        Give a new item
        <textarea readonly value={output.command} rows="4" class="font-mono bg-[#141517] rounded-md p-2 w-full"></textarea>
    </label>
    <button class="button mt-2" disabled={!output.command || !input} on:click={() => copy(output.command)}>Copy command</button>
    {#if output.command.length > 256}
        <p class="mt-2">This command exceeds chat's 256-character limit. Use a command block and replace @s with your player name.</p>
    {/if}
    <details class="mt-4">
        <summary class="cursor-pointer py-2">Already have item data?</summary>
        {#if version === 'legacy'}
            <p class="mt-2">Replace only the value of display.Name in your item's NBT with the value below. Keep the other display fields and item tags.</p>
        {:else}
            <p class="mt-2">Replace only the minecraft:custom_name value in your item's components with the value below. In a /give component list, use minecraft:custom_name= followed by this value. Keep all other components.</p>
        {/if}
        <label class="flex flex-col gap-2 mt-3">
            Name value {version === 'snbt-components' ? '(SNBT component)' : '(quoted JSON string)'}
            <textarea readonly value={output.value} rows="4" class="font-mono bg-[#141517] rounded-md p-2 w-full"></textarea>
        </label>
        <button class="button mt-2" disabled={!input} on:click={() => copy(output.value)}>Copy name value</button>
        <p class="mt-2">This is a name value, not a complete item or a command to modify a held weapon. The command above gives a new item without your existing enchantments or other data.</p>
    </details>
    <p role="status" class="mt-2">{copyStatus}</p>
</details>
