<script lang="ts">
    let selectedType = "Chest"

    const inventories = [
        {
            name: "Chest",
            img: "chest"
        },
        {
            name: "Anvil",
            img: "anvil"
        },
        {
            name: "Beacon",
            img: "beacon"
        },
        {
            name: "Blast Furnace",
            img: "blast-furnace"
        },
        {
            name: "Brewing Stand",
            img: "brewing-stand"
        },
        {
            name: "Cartography Table",
            img: "cartography-table"
        },
        {
            name: "Crafting Table",
            img: "crafting-table"
        },
        {
            name: "Dispenser",
            img: "dispenser"
        },
        {
            name: "Donkey",
            img: "donkey"
        },
        {
            name: "Dropper",
            img: "dropper"
        },
        {
            name: "Enchanting Table",
            img: "enchanting-table"
        },
        {
            name: "Furnace",
            img: "furnace"
        },
        {
            name: "Grindstone",
            img: "grindstone"
        },
        {
            name: "Hopper",
            img: "hopper"
        },
        {
            name: "Horse",
            img: "horse"
        },
        {
            name: "Llama",
            img: "llama"
        },
        {
            name: "Loom",
            img: "loom"
        },
        {
            name: "Player",
            img: "player"
        },
        {
            name: "Shulker Box",
            img: "shulker-box"
        },
        {
            name: "Smithing Table",
            img: "smithing-table"
        },
        {
            name: "Smoker",
            img: "smoker"
        },
        {
            name: "Stonecutter",
            img: "stonecutter"
        },
        {
            name: "Villager",
            img: "villager"
        }
    ]
</script>

<main>
    <div class="place-items-center text-center flex-col gap-9 flex">
        <div class="flex flex-col">
            <h3 class="font-medium text-white text-[20px] text-left">Container Type</h3>
            <select bind:value={selectedType} id="type" class="w-[120px] scroll">
                {#each inventories as inventory}
                    <option value="{inventory.name}" class="scroll-option">{inventory.name}</option>
                {/each}
            </select>
        </div>
        <img src="/inventory/{inventories.find(item => item.name == selectedType).img}.png" alt="Inventory Slots" class="w-[450px]">
    </div>
</main>