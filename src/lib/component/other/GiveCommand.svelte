<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import type enchant from "../util/item-creator.svelte"

    export let material: string
    export let displayName: string | null = null
    export let lore: string[] = []
    export let custommodeldata: string = "0"
    export let enchants: enchant[] = []
    // Need to add item flags which are handled with a bitmask

    $: processedLore = lore.filter((line) => line)

    $: nbt = {
        display: (displayName || processedLore.length > 0) ? {
            Name: displayName ? toTextComponent(displayName) : undefined,
            Lore: processedLore.length > 0 ? processedLore.map(toTextComponent) : undefined,
        } : undefined,
        CustomModelData: (custommodeldata == "0" || !custommodeldata) ? undefined : custommodeldata,
        Enchantments: enchants.length === 0 ? undefined : enchants.map(toEnchantment),
    }

    // Format it to work as a command
    $: nbtstring = JSON.stringify(nbt)
            .replaceAll("\\", "")
            .replaceAll("\"'", "'")
            .replaceAll("'\"", "'")
            .replaceAll("'{id", "{id")
            .replaceAll(new RegExp("lvl:([0-9]+)}'", 'g'), "lvl:$1}")


    function toTextComponent(msg: string): string {    
        return `'{"text":"${msg}"}'`

    }

    function toEnchantment(enchant: enchant): string {
        let name = enchant.cmdname ? enchant.cmdname : enchant.name.toLowerCase()
        let split = name.split('-')
        return `'{id:"${split[0].toLowerCase()}",lvl:${split[1]}}'`
    }

    // Stolen from Server-Info Util :)
    function copyCommand() {
        navigator.clipboard.writeText(getCommand())
        toast.push('Copied successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    // Copied into the HTML so it auto updates
    function getCommand(): string {
        return `/give @s minecraft:${material.toLowerCase()}${(nbtstring.length > 2) ? nbtstring : ""} 1`
    }
</script>

{#if material == null || material == "NULL"}
<p class="text-center mt-8 font-mono break-words border-2 rounded-xl py-2 px-4 border-[#626875] text-red-700 bg-[#1A1B1E]">
    Please Select a Material
</p>
{:else}
<!-- Could add a checkbox which appends /minecraft: at the start of the command for use on servers here -->
<button on:click={copyCommand}
    class="mt-8 font-mono break-words border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E]" 
>
    {`/give @s minecraft:${material.toLowerCase()}${(nbtstring.length > 2) ? nbtstring : ""} 1`}
</button>
{/if}