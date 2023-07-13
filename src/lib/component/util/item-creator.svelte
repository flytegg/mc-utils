<script lang="ts">
  import GiveCommand from "$lib/component/other/GiveCommand.svelte";
import { insert, onMount, set_attributes } from "svelte/internal";


  let activeTab = 0;
  const materials = [
    {
      name: "AIR",
    },
    {
      name: "STONE",
    },
    {
      name: "GRANITE",
    },
    {
      name: "POLISHED_GRANITE",
    },
    {
      name: "DIORITE",
    },
    {
      name: "POLISHED_DIORITE",
    },
    {
      name: "ANDESITE",
    },
    {
      name: "POLISHED_ANDESITE",
    },
    {
      name: "DEEPSLATE",
    },
    {
      name: "COBBLED_DEEPSLATE",
    },
    {
      name: "POLISHED_DEEPSLATE",
    },
    {
      name: "CALCITE",
    },
    {
      name: "TUFF",
    },
    {
      name: "DRIPSTONE_BLOCK",
    },
    {
      name: "GRASS_BLOCK",
    },
    {
      name: "DIRT",
    },
    {
      name: "COARSE_DIRT",
    },
    {
      name: "PODZOL",
    },
    {
      name: "ROOTED_DIRT",
    },
    {
      name: "MUD",
    },
    {
      name: "CRIMSON_NYLIUM",
    },
    {
      name: "WARPED_NYLIUM",
    },
    {
      name: "COBBLESTONE",
    },
    {
      name: "OAK_PLANKS",
    },
    {
      name: "SPRUCE_PLANKS",
    },
    {
      name: "BIRCH_PLANKS",
    },
    {
      name: "JUNGLE_PLANKS",
    },
    {
      name: "ACACIA_PLANKS",
    },
    {
      name: "CHERRY_PLANKS",
    },
    {
      name: "DARK_OAK_PLANKS",
    },
    {
      name: "MANGROVE_PLANKS",
    },
    {
      name: "BAMBOO_PLANKS",
    },
    {
      name: "CRIMSON_PLANKS",
    },
    {
      name: "WARPED_PLANKS",
    },
    {
      name: "BAMBOO_MOSAIC",
    },
    {
      name: "OAK_SAPLING",
    },
    {
      name: "SPRUCE_SAPLING",
    },
    {
      name: "BIRCH_SAPLING",
    },
    {
      name: "JUNGLE_SAPLING",
    },
    {
      name: "ACACIA_SAPLING",
    },
    {
      name: "CHERRY_SAPLING",
    },
    {
      name: "DARK_OAK_SAPLING",
    },
    {
      name: "MANGROVE_PROPAGULE",
    },
    {
      name: "BEDROCK",
    },
    {
      name: "SAND",
    },
    {
      name: "SUSPICIOUS_SAND",
    },
    {
      name: "RED_SAND",
    },
    {
      name: "GRAVEL",
    },
    {
      name: "COAL_ORE",
    },
    {
      name: "DEEPSLATE_COAL_ORE",
    },
    {
      name: "IRON_ORE",
    },
    {
      name: "DEEPSLATE_IRON_ORE",
    },
    {
      name: "COPPER_ORE",
    },
    {
      name: "DEEPSLATE_COPPER_ORE",
    },
    {
      name: "GOLD_ORE",
    },
    {
      name: "DEEPSLATE_GOLD_ORE",
    },
    {
      name: "REDSTONE_ORE",
    },
    {
      name: "DEEPSLATE_REDSTONE_ORE",
    },
    {
      name: "EMERALD_ORE",
    },
    {
      name: "DEEPSLATE_EMERALD_ORE",
    },
    {
      name: "LAPIS_ORE",
    },
    {
      name: "DEEPSLATE_LAPIS_ORE",
    },
    {
      name: "DIAMOND_ORE",
    },
    {
      name: "DEEPSLATE_DIAMOND_ORE",
    },
    {
      name: "NETHER_GOLD_ORE",
    },
    {
      name: "NETHER_QUARTZ_ORE",
    },
    {
      name: "ANCIENT_DEBRIS",
    },
    {
      name: "COAL_BLOCK",
    },
    {
      name: "RAW_IRON_BLOCK",
    },
    {
      name: "RAW_COPPER_BLOCK",
    },
    {
      name: "RAW_GOLD_BLOCK",
    },
    {
      name: "AMETHYST_BLOCK",
    },
    {
      name: "BUDDING_AMETHYST",
    },
    {
      name: "IRON_BLOCK",
    },
    {
      name: "COPPER_BLOCK",
    },
    {
      name: "GOLD_BLOCK",
    },
    {
      name: "DIAMOND_BLOCK",
    },
    {
      name: "NETHERITE_BLOCK",
    },
    {
      name: "EXPOSED_COPPER",
    },
    {
      name: "WEATHERED_COPPER",
    },
    {
      name: "OXIDIZED_COPPER",
    },
    {
      name: "CUT_COPPER",
    },
    {
      name: "EXPOSED_CUT_COPPER",
    },
    {
      name: "WEATHERED_CUT_COPPER",
    },
    {
      name: "OXIDIZED_CUT_COPPER",
    },
    {
      name: "CUT_COPPER_STAIRS",
    },
    {
      name: "EXPOSED_CUT_COPPER_STAIRS",
    },
    {
      name: "WEATHERED_CUT_COPPER_STAIRS",
    },
    {
      name: "OXIDIZED_CUT_COPPER_STAIRS",
    },
    {
      name: "CUT_COPPER_SLAB",
    },
    {
      name: "EXPOSED_CUT_COPPER_SLAB",
    },
    {
      name: "WEATHERED_CUT_COPPER_SLAB",
    },
    {
      name: "OXIDIZED_CUT_COPPER_SLAB",
    },
    {
      name: "WAXED_COPPER_BLOCK",
    },
    {
      name: "WAXED_EXPOSED_COPPER",
    },
    {
      name: "WAXED_WEATHERED_COPPER",
    },
    {
      name: "WAXED_OXIDIZED_COPPER",
    },
    {
      name: "WAXED_CUT_COPPER",
    },
    {
      name: "WAXED_EXPOSED_CUT_COPPER",
    },
    {
      name: "WAXED_WEATHERED_CUT_COPPER",
    },
    {
      name: "WAXED_OXIDIZED_CUT_COPPER",
    },
    {
      name: "WAXED_CUT_COPPER_STAIRS",
    },
    {
      name: "WAXED_EXPOSED_CUT_COPPER_STAIRS",
    },
    {
      name: "WAXED_WEATHERED_CUT_COPPER_STAIRS",
    },
    {
      name: "WAXED_OXIDIZED_CUT_COPPER_STAIRS",
    },
    {
      name: "WAXED_CUT_COPPER_SLAB",
    },
    {
      name: "WAXED_EXPOSED_CUT_COPPER_SLAB",
    },
    {
      name: "WAXED_WEATHERED_CUT_COPPER_SLAB",
    },
    {
      name: "WAXED_OXIDIZED_CUT_COPPER_SLAB",
    },
    {
      name: "OAK_LOG",
    },
    {
      name: "SPRUCE_LOG",
    },
    {
      name: "BIRCH_LOG",
    },
    {
      name: "JUNGLE_LOG",
    },
    {
      name: "ACACIA_LOG",
    },
    {
      name: "CHERRY_LOG",
    },
    {
      name: "DARK_OAK_LOG",
    },
    {
      name: "MANGROVE_LOG",
    },
    {
      name: "MANGROVE_ROOTS",
    },
    {
      name: "MUDDY_MANGROVE_ROOTS",
    },
    {
      name: "CRIMSON_STEM",
    },
    {
      name: "WARPED_STEM",
    },
    {
      name: "BAMBOO_BLOCK",
    },
    {
      name: "STRIPPED_OAK_LOG",
    },
    {
      name: "STRIPPED_SPRUCE_LOG",
    },
    {
      name: "STRIPPED_BIRCH_LOG",
    },
    {
      name: "STRIPPED_JUNGLE_LOG",
    },
    {
      name: "STRIPPED_ACACIA_LOG",
    },
    {
      name: "STRIPPED_CHERRY_LOG",
    },
    {
      name: "STRIPPED_DARK_OAK_LOG",
    },
    {
      name: "STRIPPED_MANGROVE_LOG",
    },
    {
      name: "STRIPPED_CRIMSON_STEM",
    },
    {
      name: "STRIPPED_WARPED_STEM",
    },
    {
      name: "STRIPPED_OAK_WOOD",
    },
    {
      name: "STRIPPED_SPRUCE_WOOD",
    },
    {
      name: "STRIPPED_BIRCH_WOOD",
    },
    {
      name: "STRIPPED_JUNGLE_WOOD",
    },
    {
      name: "STRIPPED_ACACIA_WOOD",
    },
    {
      name: "STRIPPED_CHERRY_WOOD",
    },
    {
      name: "STRIPPED_DARK_OAK_WOOD",
    },
    {
      name: "STRIPPED_MANGROVE_WOOD",
    },
    {
      name: "STRIPPED_CRIMSON_HYPHAE",
    },
    {
      name: "STRIPPED_WARPED_HYPHAE",
    },
    {
      name: "STRIPPED_BAMBOO_BLOCK",
    },
    {
      name: "OAK_WOOD",
    },
    {
      name: "SPRUCE_WOOD",
    },
    {
      name: "BIRCH_WOOD",
    },
    {
      name: "JUNGLE_WOOD",
    },
    {
      name: "ACACIA_WOOD",
    },
    {
      name: "CHERRY_WOOD",
    },
    {
      name: "DARK_OAK_WOOD",
    },
    {
      name: "MANGROVE_WOOD",
    },
    {
      name: "CRIMSON_HYPHAE",
    },
    {
      name: "WARPED_HYPHAE",
    },
    {
      name: "OAK_LEAVES",
    },
    {
      name: "SPRUCE_LEAVES",
    },
    {
      name: "BIRCH_LEAVES",
    },
    {
      name: "JUNGLE_LEAVES",
    },
    {
      name: "ACACIA_LEAVES",
    },
    {
      name: "CHERRY_LEAVES",
    },
    {
      name: "DARK_OAK_LEAVES",
    },
    {
      name: "MANGROVE_LEAVES",
    },
    {
      name: "AZALEA_LEAVES",
    },
    {
      name: "FLOWERING_AZALEA_LEAVES",
    },
    {
      name: "SPONGE",
    },
    {
      name: "WET_SPONGE",
    },
    {
      name: "GLASS",
    },
    {
      name: "TINTED_GLASS",
    },
    {
      name: "LAPIS_BLOCK",
    },
    {
      name: "SANDSTONE",
    },
    {
      name: "CHISELED_SANDSTONE",
    },
    {
      name: "CUT_SANDSTONE",
    },
    {
      name: "COBWEB",
    },
    {
      name: "GRASS",
    },
    {
      name: "FERN",
    },
    {
      name: "AZALEA",
    },
    {
      name: "FLOWERING_AZALEA",
    },
    {
      name: "DEAD_BUSH",
    },
    {
      name: "SEAGRASS",
    },
    {
      name: "SEA_PICKLE",
    },
    {
      name: "WHITE_WOOL",
    },
    {
      name: "ORANGE_WOOL",
    },
    {
      name: "MAGENTA_WOOL",
    },
    {
      name: "LIGHT_BLUE_WOOL",
    },
    {
      name: "YELLOW_WOOL",
    },
    {
      name: "LIME_WOOL",
    },
    {
      name: "PINK_WOOL",
    },
    {
      name: "GRAY_WOOL",
    },
    {
      name: "LIGHT_GRAY_WOOL",
    },
    {
      name: "CYAN_WOOL",
    },
    {
      name: "PURPLE_WOOL",
    },
    {
      name: "BLUE_WOOL",
    },
    {
      name: "BROWN_WOOL",
    },
    {
      name: "GREEN_WOOL",
    },
    {
      name: "RED_WOOL",
    },
    {
      name: "BLACK_WOOL",
    },
    {
      name: "DANDELION",
    },
    {
      name: "POPPY",
    },
    {
      name: "BLUE_ORCHID",
    },
    {
      name: "ALLIUM",
    },
    {
      name: "AZURE_BLUET",
    },
    {
      name: "RED_TULIP",
    },
    {
      name: "ORANGE_TULIP",
    },
    {
      name: "WHITE_TULIP",
    },
    {
      name: "PINK_TULIP",
    },
    {
      name: "OXEYE_DAISY",
    },
    {
      name: "CORNFLOWER",
    },
    {
      name: "LILY_OF_THE_VALLEY",
    },
    {
      name: "WITHER_ROSE",
    },
    {
      name: "TORCHFLOWER",
    },
    {
      name: "SPORE_BLOSSOM",
    },
    {
      name: "BROWN_MUSHROOM",
    },
    {
      name: "RED_MUSHROOM",
    },
    {
      name: "CRIMSON_FUNGUS",
    },
    {
      name: "WARPED_FUNGUS",
    },
    {
      name: "CRIMSON_ROOTS",
    },
    {
      name: "WARPED_ROOTS",
    },
    {
      name: "NETHER_SPROUTS",
    },
    {
      name: "WEEPING_VINES",
    },
    {
      name: "TWISTING_VINES",
    },
    {
      name: "SUGAR_CANE",
    },
    {
      name: "KELP",
    },
    {
      name: "MOSS_CARPET",
    },
    {
      name: "PINK_PETALS",
    },
    {
      name: "MOSS_BLOCK",
    },
    {
      name: "HANGING_ROOTS",
    },
    {
      name: "BIG_DRIPLEAF",
    },
    {
      name: "SMALL_DRIPLEAF",
    },
    {
      name: "BAMBOO",
    },
    {
      name: "OAK_SLAB",
    },
    {
      name: "SPRUCE_SLAB",
    },
    {
      name: "BIRCH_SLAB",
    },
    {
      name: "JUNGLE_SLAB",
    },
    {
      name: "ACACIA_SLAB",
    },
    {
      name: "CHERRY_SLAB",
    },
    {
      name: "DARK_OAK_SLAB",
    },
    {
      name: "MANGROVE_SLAB",
    },
    {
      name: "BAMBOO_SLAB",
    },
    {
      name: "BAMBOO_MOSAIC_SLAB",
    },
    {
      name: "CRIMSON_SLAB",
    },
    {
      name: "WARPED_SLAB",
    },
    {
      name: "STONE_SLAB",
    },
    {
      name: "SMOOTH_STONE_SLAB",
    },
    {
      name: "SANDSTONE_SLAB",
    },
    {
      name: "CUT_SANDSTONE_SLAB",
    },
    {
      name: "PETRIFIED_OAK_SLAB",
    },
    {
      name: "COBBLESTONE_SLAB",
    },
    {
      name: "BRICK_SLAB",
    },
    {
      name: "STONE_BRICK_SLAB",
    },
    {
      name: "MUD_BRICK_SLAB",
    },
    {
      name: "NETHER_BRICK_SLAB",
    },
    {
      name: "QUARTZ_SLAB",
    },
    {
      name: "RED_SANDSTONE_SLAB",
    },
    {
      name: "CUT_RED_SANDSTONE_SLAB",
    },
    {
      name: "PURPUR_SLAB",
    },
    {
      name: "PRISMARINE_SLAB",
    },
    {
      name: "PRISMARINE_BRICK_SLAB",
    },
    {
      name: "DARK_PRISMARINE_SLAB",
    },
    {
      name: "SMOOTH_QUARTZ",
    },
    {
      name: "SMOOTH_RED_SANDSTONE",
    },
    {
      name: "SMOOTH_SANDSTONE",
    },
    {
      name: "SMOOTH_STONE",
    },
    {
      name: "BRICKS",
    },
    {
      name: "BOOKSHELF",
    },
    {
      name: "CHISELED_BOOKSHELF",
    },
    {
      name: "DECORATED_POT",
    },
    {
      name: "MOSSY_COBBLESTONE",
    },
    {
      name: "OBSIDIAN",
    },
    {
      name: "TORCH",
    },
    {
      name: "END_ROD",
    },
    {
      name: "CHORUS_PLANT",
    },
    {
      name: "CHORUS_FLOWER",
    },
    {
      name: "PURPUR_BLOCK",
    },
    {
      name: "PURPUR_PILLAR",
    },
    {
      name: "PURPUR_STAIRS",
    },
    {
      name: "SPAWNER",
    },
    {
      name: "CHEST",
    },
    {
      name: "CRAFTING_TABLE",
    },
    {
      name: "FARMLAND",
    },
    {
      name: "FURNACE",
    },
    {
      name: "LADDER",
    },
    {
      name: "COBBLESTONE_STAIRS",
    },
    {
      name: "SNOW",
    },
    {
      name: "ICE",
    },
    {
      name: "SNOW_BLOCK",
    },
    {
      name: "CACTUS",
    },
    {
      name: "CLAY",
    },
    {
      name: "JUKEBOX",
    },
    {
      name: "OAK_FENCE",
    },
    {
      name: "SPRUCE_FENCE",
    },
    {
      name: "BIRCH_FENCE",
    },
    {
      name: "JUNGLE_FENCE",
    },
    {
      name: "ACACIA_FENCE",
    },
    {
      name: "CHERRY_FENCE",
    },
    {
      name: "DARK_OAK_FENCE",
    },
    {
      name: "MANGROVE_FENCE",
    },
    {
      name: "BAMBOO_FENCE",
    },
    {
      name: "CRIMSON_FENCE",
    },
    {
      name: "WARPED_FENCE",
    },
    {
      name: "PUMPKIN",
    },
    {
      name: "CARVED_PUMPKIN",
    },
    {
      name: "JACK_O_LANTERN",
    },
    {
      name: "NETHERRACK",
    },
    {
      name: "SOUL_SAND",
    },
    {
      name: "SOUL_SOIL",
    },
    {
      name: "BASALT",
    },
    {
      name: "POLISHED_BASALT",
    },
    {
      name: "SMOOTH_BASALT",
    },
    {
      name: "SOUL_TORCH",
    },
    {
      name: "GLOWSTONE",
    },
    {
      name: "INFESTED_STONE",
    },
    {
      name: "INFESTED_COBBLESTONE",
    },
    {
      name: "INFESTED_STONE_BRICKS",
    },
    {
      name: "INFESTED_MOSSY_STONE_BRICKS",
    },
    {
      name: "INFESTED_CRACKED_STONE_BRICKS",
    },
    {
      name: "INFESTED_CHISELED_STONE_BRICKS",
    },
    {
      name: "INFESTED_DEEPSLATE",
    },
    {
      name: "STONE_BRICKS",
    },
    {
      name: "MOSSY_STONE_BRICKS",
    },
    {
      name: "CRACKED_STONE_BRICKS",
    },
    {
      name: "CHISELED_STONE_BRICKS",
    },
    {
      name: "PACKED_MUD",
    },
    {
      name: "MUD_BRICKS",
    },
    {
      name: "DEEPSLATE_BRICKS",
    },
    {
      name: "CRACKED_DEEPSLATE_BRICKS",
    },
    {
      name: "DEEPSLATE_TILES",
    },
    {
      name: "CRACKED_DEEPSLATE_TILES",
    },
    {
      name: "CHISELED_DEEPSLATE",
    },
    {
      name: "REINFORCED_DEEPSLATE",
    },
    {
      name: "BROWN_MUSHROOM_BLOCK",
    },
    {
      name: "RED_MUSHROOM_BLOCK",
    },
    {
      name: "MUSHROOM_STEM",
    },
    {
      name: "IRON_BARS",
    },
    {
      name: "CHAIN",
    },
    {
      name: "GLASS_PANE",
    },
    {
      name: "MELON",
    },
    {
      name: "VINE",
    },
    {
      name: "GLOW_LICHEN",
    },
    {
      name: "BRICK_STAIRS",
    },
    {
      name: "STONE_BRICK_STAIRS",
    },
    {
      name: "MUD_BRICK_STAIRS",
    },
    {
      name: "MYCELIUM",
    },
    {
      name: "LILY_PAD",
    },
    {
      name: "NETHER_BRICKS",
    },
    {
      name: "CRACKED_NETHER_BRICKS",
    },
    {
      name: "CHISELED_NETHER_BRICKS",
    },
    {
      name: "NETHER_BRICK_FENCE",
    },
    {
      name: "NETHER_BRICK_STAIRS",
    },
    {
      name: "SCULK",
    },
    {
      name: "SCULK_VEIN",
    },
    {
      name: "SCULK_CATALYST",
    },
    {
      name: "SCULK_SHRIEKER",
    },
    {
      name: "ENCHANTING_TABLE",
    },
    {
      name: "END_PORTAL_FRAME",
    },
    {
      name: "END_STONE",
    },
    {
      name: "END_STONE_BRICKS",
    },
    {
      name: "DRAGON_EGG",
    },
    {
      name: "SANDSTONE_STAIRS",
    },
    {
      name: "ENDER_CHEST",
    },
    {
      name: "EMERALD_BLOCK",
    },
    {
      name: "OAK_STAIRS",
    },
    {
      name: "SPRUCE_STAIRS",
    },
    {
      name: "BIRCH_STAIRS",
    },
    {
      name: "JUNGLE_STAIRS",
    },
    {
      name: "ACACIA_STAIRS",
    },
    {
      name: "CHERRY_STAIRS",
    },
    {
      name: "DARK_OAK_STAIRS",
    },
    {
      name: "MANGROVE_STAIRS",
    },
    {
      name: "BAMBOO_STAIRS",
    },
    {
      name: "BAMBOO_MOSAIC_STAIRS",
    },
    {
      name: "CRIMSON_STAIRS",
    },
    {
      name: "WARPED_STAIRS",
    },
    {
      name: "COMMAND_BLOCK",
    },
    {
      name: "BEACON",
    },
    {
      name: "COBBLESTONE_WALL",
    },
    {
      name: "MOSSY_COBBLESTONE_WALL",
    },
    {
      name: "BRICK_WALL",
    },
    {
      name: "PRISMARINE_WALL",
    },
    {
      name: "RED_SANDSTONE_WALL",
    },
    {
      name: "MOSSY_STONE_BRICK_WALL",
    },
    {
      name: "GRANITE_WALL",
    },
    {
      name: "STONE_BRICK_WALL",
    },
    {
      name: "MUD_BRICK_WALL",
    },
    {
      name: "NETHER_BRICK_WALL",
    },
    {
      name: "ANDESITE_WALL",
    },
    {
      name: "RED_NETHER_BRICK_WALL",
    },
    {
      name: "SANDSTONE_WALL",
    },
    {
      name: "END_STONE_BRICK_WALL",
    },
    {
      name: "DIORITE_WALL",
    },
    {
      name: "BLACKSTONE_WALL",
    },
    {
      name: "POLISHED_BLACKSTONE_WALL",
    },
    {
      name: "POLISHED_BLACKSTONE_BRICK_WALL",
    },
    {
      name: "COBBLED_DEEPSLATE_WALL",
    },
    {
      name: "POLISHED_DEEPSLATE_WALL",
    },
    {
      name: "DEEPSLATE_BRICK_WALL",
    },
    {
      name: "DEEPSLATE_TILE_WALL",
    },
    {
      name: "ANVIL",
    },
    {
      name: "CHIPPED_ANVIL",
    },
    {
      name: "DAMAGED_ANVIL",
    },
    {
      name: "CHISELED_QUARTZ_BLOCK",
    },
    {
      name: "QUARTZ_BLOCK",
    },
    {
      name: "QUARTZ_BRICKS",
    },
    {
      name: "QUARTZ_PILLAR",
    },
    {
      name: "QUARTZ_STAIRS",
    },
    {
      name: "WHITE_TERRACOTTA",
    },
    {
      name: "ORANGE_TERRACOTTA",
    },
    {
      name: "MAGENTA_TERRACOTTA",
    },
    {
      name: "LIGHT_BLUE_TERRACOTTA",
    },
    {
      name: "YELLOW_TERRACOTTA",
    },
    {
      name: "LIME_TERRACOTTA",
    },
    {
      name: "PINK_TERRACOTTA",
    },
    {
      name: "GRAY_TERRACOTTA",
    },
    {
      name: "LIGHT_GRAY_TERRACOTTA",
    },
    {
      name: "CYAN_TERRACOTTA",
    },
    {
      name: "PURPLE_TERRACOTTA",
    },
    {
      name: "BLUE_TERRACOTTA",
    },
    {
      name: "BROWN_TERRACOTTA",
    },
    {
      name: "GREEN_TERRACOTTA",
    },
    {
      name: "RED_TERRACOTTA",
    },
    {
      name: "BLACK_TERRACOTTA",
    },
    {
      name: "BARRIER",
    },
    {
      name: "LIGHT",
    },
    {
      name: "HAY_BLOCK",
    },
    {
      name: "WHITE_CARPET",
    },
    {
      name: "ORANGE_CARPET",
    },
    {
      name: "MAGENTA_CARPET",
    },
    {
      name: "LIGHT_BLUE_CARPET",
    },
    {
      name: "YELLOW_CARPET",
    },
    {
      name: "LIME_CARPET",
    },
    {
      name: "PINK_CARPET",
    },
    {
      name: "GRAY_CARPET",
    },
    {
      name: "LIGHT_GRAY_CARPET",
    },
    {
      name: "CYAN_CARPET",
    },
    {
      name: "PURPLE_CARPET",
    },
    {
      name: "BLUE_CARPET",
    },
    {
      name: "BROWN_CARPET",
    },
    {
      name: "GREEN_CARPET",
    },
    {
      name: "RED_CARPET",
    },
    {
      name: "BLACK_CARPET",
    },
    {
      name: "TERRACOTTA",
    },
    {
      name: "PACKED_ICE",
    },
    {
      name: "DIRT_PATH",
    },
    {
      name: "SUNFLOWER",
    },
    {
      name: "LILAC",
    },
    {
      name: "ROSE_BUSH",
    },
    {
      name: "PEONY",
    },
    {
      name: "TALL_GRASS",
    },
    {
      name: "LARGE_FERN",
    },
    {
      name: "WHITE_STAINED_GLASS",
    },
    {
      name: "ORANGE_STAINED_GLASS",
    },
    {
      name: "MAGENTA_STAINED_GLASS",
    },
    {
      name: "LIGHT_BLUE_STAINED_GLASS",
    },
    {
      name: "YELLOW_STAINED_GLASS",
    },
    {
      name: "LIME_STAINED_GLASS",
    },
    {
      name: "PINK_STAINED_GLASS",
    },
    {
      name: "GRAY_STAINED_GLASS",
    },
    {
      name: "LIGHT_GRAY_STAINED_GLASS",
    },
    {
      name: "CYAN_STAINED_GLASS",
    },
    {
      name: "PURPLE_STAINED_GLASS",
    },
    {
      name: "BLUE_STAINED_GLASS",
    },
    {
      name: "BROWN_STAINED_GLASS",
    },
    {
      name: "GREEN_STAINED_GLASS",
    },
    {
      name: "RED_STAINED_GLASS",
    },
    {
      name: "BLACK_STAINED_GLASS",
    },
    {
      name: "WHITE_STAINED_GLASS_PANE",
    },
    {
      name: "ORANGE_STAINED_GLASS_PANE",
    },
    {
      name: "MAGENTA_STAINED_GLASS_PANE",
    },
    {
      name: "LIGHT_BLUE_STAINED_GLASS_PANE",
    },
    {
      name: "YELLOW_STAINED_GLASS_PANE",
    },
    {
      name: "LIME_STAINED_GLASS_PANE",
    },
    {
      name: "PINK_STAINED_GLASS_PANE",
    },
    {
      name: "GRAY_STAINED_GLASS_PANE",
    },
    {
      name: "LIGHT_GRAY_STAINED_GLASS_PANE",
    },
    {
      name: "CYAN_STAINED_GLASS_PANE",
    },
    {
      name: "PURPLE_STAINED_GLASS_PANE",
    },
    {
      name: "BLUE_STAINED_GLASS_PANE",
    },
    {
      name: "BROWN_STAINED_GLASS_PANE",
    },
    {
      name: "GREEN_STAINED_GLASS_PANE",
    },
    {
      name: "RED_STAINED_GLASS_PANE",
    },
    {
      name: "BLACK_STAINED_GLASS_PANE",
    },
    {
      name: "PRISMARINE",
    },
    {
      name: "PRISMARINE_BRICKS",
    },
    {
      name: "DARK_PRISMARINE",
    },
    {
      name: "PRISMARINE_STAIRS",
    },
    {
      name: "PRISMARINE_BRICK_STAIRS",
    },
    {
      name: "DARK_PRISMARINE_STAIRS",
    },
    {
      name: "SEA_LANTERN",
    },
    {
      name: "RED_SANDSTONE",
    },
    {
      name: "CHISELED_RED_SANDSTONE",
    },
    {
      name: "CUT_RED_SANDSTONE",
    },
    {
      name: "RED_SANDSTONE_STAIRS",
    },
    {
      name: "REPEATING_COMMAND_BLOCK",
    },
    {
      name: "CHAIN_COMMAND_BLOCK",
    },
    {
      name: "MAGMA_BLOCK",
    },
    {
      name: "NETHER_WART_BLOCK",
    },
    {
      name: "WARPED_WART_BLOCK",
    },
    {
      name: "RED_NETHER_BRICKS",
    },
    {
      name: "BONE_BLOCK",
    },
    {
      name: "STRUCTURE_VOID",
    },
    {
      name: "SHULKER_BOX",
    },
    {
      name: "WHITE_SHULKER_BOX",
    },
    {
      name: "ORANGE_SHULKER_BOX",
    },
    {
      name: "MAGENTA_SHULKER_BOX",
    },
    {
      name: "LIGHT_BLUE_SHULKER_BOX",
    },
    {
      name: "YELLOW_SHULKER_BOX",
    },
    {
      name: "LIME_SHULKER_BOX",
    },
    {
      name: "PINK_SHULKER_BOX",
    },
    {
      name: "GRAY_SHULKER_BOX",
    },
    {
      name: "LIGHT_GRAY_SHULKER_BOX",
    },
    {
      name: "CYAN_SHULKER_BOX",
    },
    {
      name: "PURPLE_SHULKER_BOX",
    },
    {
      name: "BLUE_SHULKER_BOX",
    },
    {
      name: "BROWN_SHULKER_BOX",
    },
    {
      name: "GREEN_SHULKER_BOX",
    },
    {
      name: "RED_SHULKER_BOX",
    },
    {
      name: "BLACK_SHULKER_BOX",
    },
    {
      name: "WHITE_GLAZED_TERRACOTTA",
    },
    {
      name: "ORANGE_GLAZED_TERRACOTTA",
    },
    {
      name: "MAGENTA_GLAZED_TERRACOTTA",
    },
    {
      name: "LIGHT_BLUE_GLAZED_TERRACOTTA",
    },
    {
      name: "YELLOW_GLAZED_TERRACOTTA",
    },
    {
      name: "LIME_GLAZED_TERRACOTTA",
    },
    {
      name: "PINK_GLAZED_TERRACOTTA",
    },
    {
      name: "GRAY_GLAZED_TERRACOTTA",
    },
    {
      name: "LIGHT_GRAY_GLAZED_TERRACOTTA",
    },
    {
      name: "CYAN_GLAZED_TERRACOTTA",
    },
    {
      name: "PURPLE_GLAZED_TERRACOTTA",
    },
    {
      name: "BLUE_GLAZED_TERRACOTTA",
    },
    {
      name: "BROWN_GLAZED_TERRACOTTA",
    },
    {
      name: "GREEN_GLAZED_TERRACOTTA",
    },
    {
      name: "RED_GLAZED_TERRACOTTA",
    },
    {
      name: "BLACK_GLAZED_TERRACOTTA",
    },
    {
      name: "WHITE_CONCRETE",
    },
    {
      name: "ORANGE_CONCRETE",
    },
    {
      name: "MAGENTA_CONCRETE",
    },
    {
      name: "LIGHT_BLUE_CONCRETE",
    },
    {
      name: "YELLOW_CONCRETE",
    },
    {
      name: "LIME_CONCRETE",
    },
    {
      name: "PINK_CONCRETE",
    },
    {
      name: "GRAY_CONCRETE",
    },
    {
      name: "LIGHT_GRAY_CONCRETE",
    },
    {
      name: "CYAN_CONCRETE",
    },
    {
      name: "PURPLE_CONCRETE",
    },
    {
      name: "BLUE_CONCRETE",
    },
    {
      name: "BROWN_CONCRETE",
    },
    {
      name: "GREEN_CONCRETE",
    },
    {
      name: "RED_CONCRETE",
    },
    {
      name: "BLACK_CONCRETE",
    },
    {
      name: "WHITE_CONCRETE_POWDER",
    },
    {
      name: "ORANGE_CONCRETE_POWDER",
    },
    {
      name: "MAGENTA_CONCRETE_POWDER",
    },
    {
      name: "LIGHT_BLUE_CONCRETE_POWDER",
    },
    {
      name: "YELLOW_CONCRETE_POWDER",
    },
    {
      name: "LIME_CONCRETE_POWDER",
    },
    {
      name: "PINK_CONCRETE_POWDER",
    },
    {
      name: "GRAY_CONCRETE_POWDER",
    },
    {
      name: "LIGHT_GRAY_CONCRETE_POWDER",
    },
    {
      name: "CYAN_CONCRETE_POWDER",
    },
    {
      name: "PURPLE_CONCRETE_POWDER",
    },
    {
      name: "BLUE_CONCRETE_POWDER",
    },
    {
      name: "BROWN_CONCRETE_POWDER",
    },
    {
      name: "GREEN_CONCRETE_POWDER",
    },
    {
      name: "RED_CONCRETE_POWDER",
    },
    {
      name: "BLACK_CONCRETE_POWDER",
    },
    {
      name: "TURTLE_EGG",
    },
    {
      name: "DEAD_TUBE_CORAL_BLOCK",
    },
    {
      name: "DEAD_BRAIN_CORAL_BLOCK",
    },
    {
      name: "DEAD_BUBBLE_CORAL_BLOCK",
    },
    {
      name: "DEAD_FIRE_CORAL_BLOCK",
    },
    {
      name: "DEAD_HORN_CORAL_BLOCK",
    },
    {
      name: "TUBE_CORAL_BLOCK",
    },
    {
      name: "BRAIN_CORAL_BLOCK",
    },
    {
      name: "BUBBLE_CORAL_BLOCK",
    },
    {
      name: "FIRE_CORAL_BLOCK",
    },
    {
      name: "HORN_CORAL_BLOCK",
    },
    {
      name: "TUBE_CORAL",
    },
    {
      name: "BRAIN_CORAL",
    },
    {
      name: "BUBBLE_CORAL",
    },
    {
      name: "FIRE_CORAL",
    },
    {
      name: "HORN_CORAL",
    },
    {
      name: "DEAD_BRAIN_CORAL",
    },
    {
      name: "DEAD_BUBBLE_CORAL",
    },
    {
      name: "DEAD_FIRE_CORAL",
    },
    {
      name: "DEAD_HORN_CORAL",
    },
    {
      name: "DEAD_TUBE_CORAL",
    },
    {
      name: "TUBE_CORAL_FAN",
    },
    {
      name: "BRAIN_CORAL_FAN",
    },
    {
      name: "BUBBLE_CORAL_FAN",
    },
    {
      name: "FIRE_CORAL_FAN",
    },
    {
      name: "HORN_CORAL_FAN",
    },
    {
      name: "DEAD_TUBE_CORAL_FAN",
    },
    {
      name: "DEAD_BRAIN_CORAL_FAN",
    },
    {
      name: "DEAD_BUBBLE_CORAL_FAN",
    },
    {
      name: "DEAD_FIRE_CORAL_FAN",
    },
    {
      name: "DEAD_HORN_CORAL_FAN",
    },
    {
      name: "BLUE_ICE",
    },
    {
      name: "CONDUIT",
    },
    {
      name: "POLISHED_GRANITE_STAIRS",
    },
    {
      name: "SMOOTH_RED_SANDSTONE_STAIRS",
    },
    {
      name: "MOSSY_STONE_BRICK_STAIRS",
    },
    {
      name: "POLISHED_DIORITE_STAIRS",
    },
    {
      name: "MOSSY_COBBLESTONE_STAIRS",
    },
    {
      name: "END_STONE_BRICK_STAIRS",
    },
    {
      name: "STONE_STAIRS",
    },
    {
      name: "SMOOTH_SANDSTONE_STAIRS",
    },
    {
      name: "SMOOTH_QUARTZ_STAIRS",
    },
    {
      name: "GRANITE_STAIRS",
    },
    {
      name: "ANDESITE_STAIRS",
    },
    {
      name: "RED_NETHER_BRICK_STAIRS",
    },
    {
      name: "POLISHED_ANDESITE_STAIRS",
    },
    {
      name: "DIORITE_STAIRS",
    },
    {
      name: "COBBLED_DEEPSLATE_STAIRS",
    },
    {
      name: "POLISHED_DEEPSLATE_STAIRS",
    },
    {
      name: "DEEPSLATE_BRICK_STAIRS",
    },
    {
      name: "DEEPSLATE_TILE_STAIRS",
    },
    {
      name: "POLISHED_GRANITE_SLAB",
    },
    {
      name: "SMOOTH_RED_SANDSTONE_SLAB",
    },
    {
      name: "MOSSY_STONE_BRICK_SLAB",
    },
    {
      name: "POLISHED_DIORITE_SLAB",
    },
    {
      name: "MOSSY_COBBLESTONE_SLAB",
    },
    {
      name: "END_STONE_BRICK_SLAB",
    },
    {
      name: "SMOOTH_SANDSTONE_SLAB",
    },
    {
      name: "SMOOTH_QUARTZ_SLAB",
    },
    {
      name: "GRANITE_SLAB",
    },
    {
      name: "ANDESITE_SLAB",
    },
    {
      name: "RED_NETHER_BRICK_SLAB",
    },
    {
      name: "POLISHED_ANDESITE_SLAB",
    },
    {
      name: "DIORITE_SLAB",
    },
    {
      name: "COBBLED_DEEPSLATE_SLAB",
    },
    {
      name: "POLISHED_DEEPSLATE_SLAB",
    },
    {
      name: "DEEPSLATE_BRICK_SLAB",
    },
    {
      name: "DEEPSLATE_TILE_SLAB",
    },
    {
      name: "SCAFFOLDING",
    },
    {
      name: "REDSTONE",
    },
    {
      name: "REDSTONE_TORCH",
    },
    {
      name: "REDSTONE_BLOCK",
    },
    {
      name: "REPEATER",
    },
    {
      name: "COMPARATOR",
    },
    {
      name: "PISTON",
    },
    {
      name: "STICKY_PISTON",
    },
    {
      name: "SLIME_BLOCK",
    },
    {
      name: "HONEY_BLOCK",
    },
    {
      name: "OBSERVER",
    },
    {
      name: "HOPPER",
    },
    {
      name: "DISPENSER",
    },
    {
      name: "DROPPER",
    },
    {
      name: "LECTERN",
    },
    {
      name: "TARGET",
    },
    {
      name: "LEVER",
    },
    {
      name: "LIGHTNING_ROD",
    },
    {
      name: "DAYLIGHT_DETECTOR",
    },
    {
      name: "SCULK_SENSOR",
    },
    {
      name: "TRIPWIRE_HOOK",
    },
    {
      name: "TRAPPED_CHEST",
    },
    {
      name: "TNT",
    },
    {
      name: "REDSTONE_LAMP",
    },
    {
      name: "NOTE_BLOCK",
    },
    {
      name: "STONE_BUTTON",
    },
    {
      name: "POLISHED_BLACKSTONE_BUTTON",
    },
    {
      name: "OAK_BUTTON",
    },
    {
      name: "SPRUCE_BUTTON",
    },
    {
      name: "BIRCH_BUTTON",
    },
    {
      name: "JUNGLE_BUTTON",
    },
    {
      name: "ACACIA_BUTTON",
    },
    {
      name: "CHERRY_BUTTON",
    },
    {
      name: "DARK_OAK_BUTTON",
    },
    {
      name: "MANGROVE_BUTTON",
    },
    {
      name: "BAMBOO_BUTTON",
    },
    {
      name: "CRIMSON_BUTTON",
    },
    {
      name: "WARPED_BUTTON",
    },
    {
      name: "STONE_PRESSURE_PLATE",
    },
    {
      name: "POLISHED_BLACKSTONE_PRESSURE_PLATE",
    },
    {
      name: "LIGHT_WEIGHTED_PRESSURE_PLATE",
    },
    {
      name: "HEAVY_WEIGHTED_PRESSURE_PLATE",
    },
    {
      name: "OAK_PRESSURE_PLATE",
    },
    {
      name: "SPRUCE_PRESSURE_PLATE",
    },
    {
      name: "BIRCH_PRESSURE_PLATE",
    },
    {
      name: "JUNGLE_PRESSURE_PLATE",
    },
    {
      name: "ACACIA_PRESSURE_PLATE",
    },
    {
      name: "CHERRY_PRESSURE_PLATE",
    },
    {
      name: "DARK_OAK_PRESSURE_PLATE",
    },
    {
      name: "MANGROVE_PRESSURE_PLATE",
    },
    {
      name: "BAMBOO_PRESSURE_PLATE",
    },
    {
      name: "CRIMSON_PRESSURE_PLATE",
    },
    {
      name: "WARPED_PRESSURE_PLATE",
    },
    {
      name: "IRON_DOOR",
    },
    {
      name: "OAK_DOOR",
    },
    {
      name: "SPRUCE_DOOR",
    },
    {
      name: "BIRCH_DOOR",
    },
    {
      name: "JUNGLE_DOOR",
    },
    {
      name: "ACACIA_DOOR",
    },
    {
      name: "CHERRY_DOOR",
    },
    {
      name: "DARK_OAK_DOOR",
    },
    {
      name: "MANGROVE_DOOR",
    },
    {
      name: "BAMBOO_DOOR",
    },
    {
      name: "CRIMSON_DOOR",
    },
    {
      name: "WARPED_DOOR",
    },
    {
      name: "IRON_TRAPDOOR",
    },
    {
      name: "OAK_TRAPDOOR",
    },
    {
      name: "SPRUCE_TRAPDOOR",
    },
    {
      name: "BIRCH_TRAPDOOR",
    },
    {
      name: "JUNGLE_TRAPDOOR",
    },
    {
      name: "ACACIA_TRAPDOOR",
    },
    {
      name: "CHERRY_TRAPDOOR",
    },
    {
      name: "DARK_OAK_TRAPDOOR",
    },
    {
      name: "MANGROVE_TRAPDOOR",
    },
    {
      name: "BAMBOO_TRAPDOOR",
    },
    {
      name: "CRIMSON_TRAPDOOR",
    },
    {
      name: "WARPED_TRAPDOOR",
    },
    {
      name: "OAK_FENCE_GATE",
    },
    {
      name: "SPRUCE_FENCE_GATE",
    },
    {
      name: "BIRCH_FENCE_GATE",
    },
    {
      name: "JUNGLE_FENCE_GATE",
    },
    {
      name: "ACACIA_FENCE_GATE",
    },
    {
      name: "CHERRY_FENCE_GATE",
    },
    {
      name: "DARK_OAK_FENCE_GATE",
    },
    {
      name: "MANGROVE_FENCE_GATE",
    },
    {
      name: "BAMBOO_FENCE_GATE",
    },
    {
      name: "CRIMSON_FENCE_GATE",
    },
    {
      name: "WARPED_FENCE_GATE",
    },
    {
      name: "POWERED_RAIL",
    },
    {
      name: "DETECTOR_RAIL",
    },
    {
      name: "RAIL",
    },
    {
      name: "ACTIVATOR_RAIL",
    },
    {
      name: "SADDLE",
    },
    {
      name: "MINECART",
    },
    {
      name: "CHEST_MINECART",
    },
    {
      name: "FURNACE_MINECART",
    },
    {
      name: "TNT_MINECART",
    },
    {
      name: "HOPPER_MINECART",
    },
    {
      name: "CARROT_ON_A_STICK",
    },
    {
      name: "WARPED_FUNGUS_ON_A_STICK",
    },
    {
      name: "ELYTRA",
    },
    {
      name: "OAK_BOAT",
    },
    {
      name: "OAK_CHEST_BOAT",
    },
    {
      name: "SPRUCE_BOAT",
    },
    {
      name: "SPRUCE_CHEST_BOAT",
    },
    {
      name: "BIRCH_BOAT",
    },
    {
      name: "BIRCH_CHEST_BOAT",
    },
    {
      name: "JUNGLE_BOAT",
    },
    {
      name: "JUNGLE_CHEST_BOAT",
    },
    {
      name: "ACACIA_BOAT",
    },
    {
      name: "ACACIA_CHEST_BOAT",
    },
    {
      name: "CHERRY_BOAT",
    },
    {
      name: "CHERRY_CHEST_BOAT",
    },
    {
      name: "DARK_OAK_BOAT",
    },
    {
      name: "DARK_OAK_CHEST_BOAT",
    },
    {
      name: "MANGROVE_BOAT",
    },
    {
      name: "MANGROVE_CHEST_BOAT",
    },
    {
      name: "BAMBOO_RAFT",
    },
    {
      name: "BAMBOO_CHEST_RAFT",
    },
    {
      name: "STRUCTURE_BLOCK",
    },
    {
      name: "JIGSAW",
    },
    {
      name: "TURTLE_HELMET",
    },
    {
      name: "SCUTE",
    },
    {
      name: "FLINT_AND_STEEL",
    },
    {
      name: "APPLE",
    },
    {
      name: "BOW",
    },
    {
      name: "ARROW",
    },
    {
      name: "COAL",
    },
    {
      name: "CHARCOAL",
    },
    {
      name: "DIAMOND",
    },
    {
      name: "EMERALD",
    },
    {
      name: "LAPIS_LAZULI",
    },
    {
      name: "QUARTZ",
    },
    {
      name: "AMETHYST_SHARD",
    },
    {
      name: "RAW_IRON",
    },
    {
      name: "IRON_INGOT",
    },
    {
      name: "RAW_COPPER",
    },
    {
      name: "COPPER_INGOT",
    },
    {
      name: "RAW_GOLD",
    },
    {
      name: "GOLD_INGOT",
    },
    {
      name: "NETHERITE_INGOT",
    },
    {
      name: "NETHERITE_SCRAP",
    },
    {
      name: "WOODEN_SWORD",
    },
    {
      name: "WOODEN_SHOVEL",
    },
    {
      name: "WOODEN_PICKAXE",
    },
    {
      name: "WOODEN_AXE",
    },
    {
      name: "WOODEN_HOE",
    },
    {
      name: "STONE_SWORD",
    },
    {
      name: "STONE_SHOVEL",
    },
    {
      name: "STONE_PICKAXE",
    },
    {
      name: "STONE_AXE",
    },
    {
      name: "STONE_HOE",
    },
    {
      name: "GOLDEN_SWORD",
    },
    {
      name: "GOLDEN_SHOVEL",
    },
    {
      name: "GOLDEN_PICKAXE",
    },
    {
      name: "GOLDEN_AXE",
    },
    {
      name: "GOLDEN_HOE",
    },
    {
      name: "IRON_SWORD",
    },
    {
      name: "IRON_SHOVEL",
    },
    {
      name: "IRON_PICKAXE",
    },
    {
      name: "IRON_AXE",
    },
    {
      name: "IRON_HOE",
    },
    {
      name: "DIAMOND_SWORD",
    },
    {
      name: "DIAMOND_SHOVEL",
    },
    {
      name: "DIAMOND_PICKAXE",
    },
    {
      name: "DIAMOND_AXE",
    },
    {
      name: "DIAMOND_HOE",
    },
    {
      name: "NETHERITE_SWORD",
    },
    {
      name: "NETHERITE_SHOVEL",
    },
    {
      name: "NETHERITE_PICKAXE",
    },
    {
      name: "NETHERITE_AXE",
    },
    {
      name: "NETHERITE_HOE",
    },
    {
      name: "STICK",
    },
    {
      name: "BOWL",
    },
    {
      name: "MUSHROOM_STEW",
    },
    {
      name: "STRING",
    },
    {
      name: "FEATHER",
    },
    {
      name: "GUNPOWDER",
    },
    {
      name: "WHEAT_SEEDS",
    },
    {
      name: "WHEAT",
    },
    {
      name: "BREAD",
    },
    {
      name: "LEATHER_HELMET",
    },
    {
      name: "LEATHER_CHESTPLATE",
    },
    {
      name: "LEATHER_LEGGINGS",
    },
    {
      name: "LEATHER_BOOTS",
    },
    {
      name: "CHAINMAIL_HELMET",
    },
    {
      name: "CHAINMAIL_CHESTPLATE",
    },
    {
      name: "CHAINMAIL_LEGGINGS",
    },
    {
      name: "CHAINMAIL_BOOTS",
    },
    {
      name: "IRON_HELMET",
    },
    {
      name: "IRON_CHESTPLATE",
    },
    {
      name: "IRON_LEGGINGS",
    },
    {
      name: "IRON_BOOTS",
    },
    {
      name: "DIAMOND_HELMET",
    },
    {
      name: "DIAMOND_CHESTPLATE",
    },
    {
      name: "DIAMOND_LEGGINGS",
    },
    {
      name: "DIAMOND_BOOTS",
    },
    {
      name: "GOLDEN_HELMET",
    },
    {
      name: "GOLDEN_CHESTPLATE",
    },
    {
      name: "GOLDEN_LEGGINGS",
    },
    {
      name: "GOLDEN_BOOTS",
    },
    {
      name: "NETHERITE_HELMET",
    },
    {
      name: "NETHERITE_CHESTPLATE",
    },
    {
      name: "NETHERITE_LEGGINGS",
    },
    {
      name: "NETHERITE_BOOTS",
    },
    {
      name: "FLINT",
    },
    {
      name: "PORKCHOP",
    },
    {
      name: "COOKED_PORKCHOP",
    },
    {
      name: "PAINTING",
    },
    {
      name: "GOLDEN_APPLE",
    },
    {
      name: "ENCHANTED_GOLDEN_APPLE",
    },
    {
      name: "OAK_SIGN",
    },
    {
      name: "SPRUCE_SIGN",
    },
    {
      name: "BIRCH_SIGN",
    },
    {
      name: "JUNGLE_SIGN",
    },
    {
      name: "ACACIA_SIGN",
    },
    {
      name: "CHERRY_SIGN",
    },
    {
      name: "DARK_OAK_SIGN",
    },
    {
      name: "MANGROVE_SIGN",
    },
    {
      name: "BAMBOO_SIGN",
    },
    {
      name: "CRIMSON_SIGN",
    },
    {
      name: "WARPED_SIGN",
    },
    {
      name: "OAK_HANGING_SIGN",
    },
    {
      name: "SPRUCE_HANGING_SIGN",
    },
    {
      name: "BIRCH_HANGING_SIGN",
    },
    {
      name: "JUNGLE_HANGING_SIGN",
    },
    {
      name: "ACACIA_HANGING_SIGN",
    },
    {
      name: "CHERRY_HANGING_SIGN",
    },
    {
      name: "DARK_OAK_HANGING_SIGN",
    },
    {
      name: "MANGROVE_HANGING_SIGN",
    },
    {
      name: "BAMBOO_HANGING_SIGN",
    },
    {
      name: "CRIMSON_HANGING_SIGN",
    },
    {
      name: "WARPED_HANGING_SIGN",
    },
    {
      name: "BUCKET",
    },
    {
      name: "WATER_BUCKET",
    },
    {
      name: "LAVA_BUCKET",
    },
    {
      name: "POWDER_SNOW_BUCKET",
    },
    {
      name: "SNOWBALL",
    },
    {
      name: "LEATHER",
    },
    {
      name: "MILK_BUCKET",
    },
    {
      name: "PUFFERFISH_BUCKET",
    },
    {
      name: "SALMON_BUCKET",
    },
    {
      name: "COD_BUCKET",
    },
    {
      name: "TROPICAL_FISH_BUCKET",
    },
    {
      name: "AXOLOTL_BUCKET",
    },
    {
      name: "TADPOLE_BUCKET",
    },
    {
      name: "BRICK",
    },
    {
      name: "CLAY_BALL",
    },
    {
      name: "DRIED_KELP_BLOCK",
    },
    {
      name: "PAPER",
    },
    {
      name: "BOOK",
    },
    {
      name: "SLIME_BALL",
    },
    {
      name: "EGG",
    },
    {
      name: "COMPASS",
    },
    {
      name: "RECOVERY_COMPASS",
    },
    {
      name: "BUNDLE",
    },
    {
      name: "FISHING_ROD",
    },
    {
      name: "CLOCK",
    },
    {
      name: "SPYGLASS",
    },
    {
      name: "GLOWSTONE_DUST",
    },
    {
      name: "COD",
    },
    {
      name: "SALMON",
    },
    {
      name: "TROPICAL_FISH",
    },
    {
      name: "PUFFERFISH",
    },
    {
      name: "COOKED_COD",
    },
    {
      name: "COOKED_SALMON",
    },
    {
      name: "INK_SAC",
    },
    {
      name: "GLOW_INK_SAC",
    },
    {
      name: "COCOA_BEANS",
    },
    {
      name: "WHITE_DYE",
    },
    {
      name: "ORANGE_DYE",
    },
    {
      name: "MAGENTA_DYE",
    },
    {
      name: "LIGHT_BLUE_DYE",
    },
    {
      name: "YELLOW_DYE",
    },
    {
      name: "LIME_DYE",
    },
    {
      name: "PINK_DYE",
    },
    {
      name: "GRAY_DYE",
    },
    {
      name: "LIGHT_GRAY_DYE",
    },
    {
      name: "CYAN_DYE",
    },
    {
      name: "PURPLE_DYE",
    },
    {
      name: "BLUE_DYE",
    },
    {
      name: "BROWN_DYE",
    },
    {
      name: "GREEN_DYE",
    },
    {
      name: "RED_DYE",
    },
    {
      name: "BLACK_DYE",
    },
    {
      name: "BONE_MEAL",
    },
    {
      name: "BONE",
    },
    {
      name: "SUGAR",
    },
    {
      name: "CAKE",
    },
    {
      name: "WHITE_BED",
    },
    {
      name: "ORANGE_BED",
    },
    {
      name: "MAGENTA_BED",
    },
    {
      name: "LIGHT_BLUE_BED",
    },
    {
      name: "YELLOW_BED",
    },
    {
      name: "LIME_BED",
    },
    {
      name: "PINK_BED",
    },
    {
      name: "GRAY_BED",
    },
    {
      name: "LIGHT_GRAY_BED",
    },
    {
      name: "CYAN_BED",
    },
    {
      name: "PURPLE_BED",
    },
    {
      name: "BLUE_BED",
    },
    {
      name: "BROWN_BED",
    },
    {
      name: "GREEN_BED",
    },
    {
      name: "RED_BED",
    },
    {
      name: "BLACK_BED",
    },
    {
      name: "COOKIE",
    },
    {
      name: "FILLED_MAP",
    },
    {
      name: "SHEARS",
    },
    {
      name: "MELON_SLICE",
    },
    {
      name: "DRIED_KELP",
    },
    {
      name: "PUMPKIN_SEEDS",
    },
    {
      name: "MELON_SEEDS",
    },
    {
      name: "BEEF",
    },
    {
      name: "COOKED_BEEF",
    },
    {
      name: "CHICKEN",
    },
    {
      name: "COOKED_CHICKEN",
    },
    {
      name: "ROTTEN_FLESH",
    },
    {
      name: "ENDER_PEARL",
    },
    {
      name: "BLAZE_ROD",
    },
    {
      name: "GHAST_TEAR",
    },
    {
      name: "GOLD_NUGGET",
    },
    {
      name: "NETHER_WART",
    },
    {
      name: "POTION",
    },
    {
      name: "GLASS_BOTTLE",
    },
    {
      name: "SPIDER_EYE",
    },
    {
      name: "FERMENTED_SPIDER_EYE",
    },
    {
      name: "BLAZE_POWDER",
    },
    {
      name: "MAGMA_CREAM",
    },
    {
      name: "BREWING_STAND",
    },
    {
      name: "CAULDRON",
    },
    {
      name: "ENDER_EYE",
    },
    {
      name: "GLISTERING_MELON_SLICE",
    },
    {
      name: "ALLAY_SPAWN_EGG",
    },
    {
      name: "AXOLOTL_SPAWN_EGG",
    },
    {
      name: "BAT_SPAWN_EGG",
    },
    {
      name: "BEE_SPAWN_EGG",
    },
    {
      name: "BLAZE_SPAWN_EGG",
    },
    {
      name: "CAT_SPAWN_EGG",
    },
    {
      name: "CAMEL_SPAWN_EGG",
    },
    {
      name: "CAVE_SPIDER_SPAWN_EGG",
    },
    {
      name: "CHICKEN_SPAWN_EGG",
    },
    {
      name: "COD_SPAWN_EGG",
    },
    {
      name: "COW_SPAWN_EGG",
    },
    {
      name: "CREEPER_SPAWN_EGG",
    },
    {
      name: "DOLPHIN_SPAWN_EGG",
    },
    {
      name: "DONKEY_SPAWN_EGG",
    },
    {
      name: "DROWNED_SPAWN_EGG",
    },
    {
      name: "ELDER_GUARDIAN_SPAWN_EGG",
    },
    {
      name: "ENDER_DRAGON_SPAWN_EGG",
    },
    {
      name: "ENDERMAN_SPAWN_EGG",
    },
    {
      name: "ENDERMITE_SPAWN_EGG",
    },
    {
      name: "EVOKER_SPAWN_EGG",
    },
    {
      name: "FOX_SPAWN_EGG",
    },
    {
      name: "FROG_SPAWN_EGG",
    },
    {
      name: "GHAST_SPAWN_EGG",
    },
    {
      name: "GLOW_SQUID_SPAWN_EGG",
    },
    {
      name: "GOAT_SPAWN_EGG",
    },
    {
      name: "GUARDIAN_SPAWN_EGG",
    },
    {
      name: "HOGLIN_SPAWN_EGG",
    },
    {
      name: "HORSE_SPAWN_EGG",
    },
    {
      name: "HUSK_SPAWN_EGG",
    },
    {
      name: "IRON_GOLEM_SPAWN_EGG",
    },
    {
      name: "LLAMA_SPAWN_EGG",
    },
    {
      name: "MAGMA_CUBE_SPAWN_EGG",
    },
    {
      name: "MOOSHROOM_SPAWN_EGG",
    },
    {
      name: "MULE_SPAWN_EGG",
    },
    {
      name: "OCELOT_SPAWN_EGG",
    },
    {
      name: "PANDA_SPAWN_EGG",
    },
    {
      name: "PARROT_SPAWN_EGG",
    },
    {
      name: "PHANTOM_SPAWN_EGG",
    },
    {
      name: "PIG_SPAWN_EGG",
    },
    {
      name: "PIGLIN_SPAWN_EGG",
    },
    {
      name: "PIGLIN_BRUTE_SPAWN_EGG",
    },
    {
      name: "PILLAGER_SPAWN_EGG",
    },
    {
      name: "POLAR_BEAR_SPAWN_EGG",
    },
    {
      name: "PUFFERFISH_SPAWN_EGG",
    },
    {
      name: "RABBIT_SPAWN_EGG",
    },
    {
      name: "RAVAGER_SPAWN_EGG",
    },
    {
      name: "SALMON_SPAWN_EGG",
    },
    {
      name: "SHEEP_SPAWN_EGG",
    },
    {
      name: "SHULKER_SPAWN_EGG",
    },
    {
      name: "SILVERFISH_SPAWN_EGG",
    },
    {
      name: "SKELETON_SPAWN_EGG",
    },
    {
      name: "SKELETON_HORSE_SPAWN_EGG",
    },
    {
      name: "SLIME_SPAWN_EGG",
    },
    {
      name: "SNIFFER_SPAWN_EGG",
    },
    {
      name: "SNOW_GOLEM_SPAWN_EGG",
    },
    {
      name: "SPIDER_SPAWN_EGG",
    },
    {
      name: "SQUID_SPAWN_EGG",
    },
    {
      name: "STRAY_SPAWN_EGG",
    },
    {
      name: "STRIDER_SPAWN_EGG",
    },
    {
      name: "TADPOLE_SPAWN_EGG",
    },
    {
      name: "TRADER_LLAMA_SPAWN_EGG",
    },
    {
      name: "TROPICAL_FISH_SPAWN_EGG",
    },
    {
      name: "TURTLE_SPAWN_EGG",
    },
    {
      name: "VEX_SPAWN_EGG",
    },
    {
      name: "VILLAGER_SPAWN_EGG",
    },
    {
      name: "VINDICATOR_SPAWN_EGG",
    },
    {
      name: "WANDERING_TRADER_SPAWN_EGG",
    },
    {
      name: "WARDEN_SPAWN_EGG",
    },
    {
      name: "WITCH_SPAWN_EGG",
    },
    {
      name: "WITHER_SPAWN_EGG",
    },
    {
      name: "WITHER_SKELETON_SPAWN_EGG",
    },
    {
      name: "WOLF_SPAWN_EGG",
    },
    {
      name: "ZOGLIN_SPAWN_EGG",
    },
    {
      name: "ZOMBIE_SPAWN_EGG",
    },
    {
      name: "ZOMBIE_HORSE_SPAWN_EGG",
    },
    {
      name: "ZOMBIE_VILLAGER_SPAWN_EGG",
    },
    {
      name: "ZOMBIFIED_PIGLIN_SPAWN_EGG",
    },
    {
      name: "EXPERIENCE_BOTTLE",
    },
    {
      name: "FIRE_CHARGE",
    },
    {
      name: "WRITABLE_BOOK",
    },
    {
      name: "WRITTEN_BOOK",
    },
    {
      name: "ITEM_FRAME",
    },
    {
      name: "GLOW_ITEM_FRAME",
    },
    {
      name: "FLOWER_POT",
    },
    {
      name: "CARROT",
    },
    {
      name: "POTATO",
    },
    {
      name: "BAKED_POTATO",
    },
    {
      name: "POISONOUS_POTATO",
    },
    {
      name: "MAP",
    },
    {
      name: "GOLDEN_CARROT",
    },
    {
      name: "SKELETON_SKULL",
    },
    {
      name: "WITHER_SKELETON_SKULL",
    },
    {
      name: "PLAYER_HEAD",
    },
    {
      name: "ZOMBIE_HEAD",
    },
    {
      name: "CREEPER_HEAD",
    },
    {
      name: "DRAGON_HEAD",
    },
    {
      name: "PIGLIN_HEAD",
    },
    {
      name: "NETHER_STAR",
    },
    {
      name: "PUMPKIN_PIE",
    },
    {
      name: "FIREWORK_ROCKET",
    },
    {
      name: "FIREWORK_STAR",
    },
    {
      name: "ENCHANTED_BOOK",
    },
    {
      name: "NETHER_BRICK",
    },
    {
      name: "PRISMARINE_SHARD",
    },
    {
      name: "PRISMARINE_CRYSTALS",
    },
    {
      name: "RABBIT",
    },
    {
      name: "COOKED_RABBIT",
    },
    {
      name: "RABBIT_STEW",
    },
    {
      name: "RABBIT_FOOT",
    },
    {
      name: "RABBIT_HIDE",
    },
    {
      name: "ARMOR_STAND",
    },
    {
      name: "IRON_HORSE_ARMOR",
    },
    {
      name: "GOLDEN_HORSE_ARMOR",
    },
    {
      name: "DIAMOND_HORSE_ARMOR",
    },
    {
      name: "LEATHER_HORSE_ARMOR",
    },
    {
      name: "LEAD",
    },
    {
      name: "NAME_TAG",
    },
    {
      name: "COMMAND_BLOCK_MINECART",
    },
    {
      name: "MUTTON",
    },
    {
      name: "COOKED_MUTTON",
    },
    {
      name: "WHITE_BANNER",
    },
    {
      name: "ORANGE_BANNER",
    },
    {
      name: "MAGENTA_BANNER",
    },
    {
      name: "LIGHT_BLUE_BANNER",
    },
    {
      name: "YELLOW_BANNER",
    },
    {
      name: "LIME_BANNER",
    },
    {
      name: "PINK_BANNER",
    },
    {
      name: "GRAY_BANNER",
    },
    {
      name: "LIGHT_GRAY_BANNER",
    },
    {
      name: "CYAN_BANNER",
    },
    {
      name: "PURPLE_BANNER",
    },
    {
      name: "BLUE_BANNER",
    },
    {
      name: "BROWN_BANNER",
    },
    {
      name: "GREEN_BANNER",
    },
    {
      name: "RED_BANNER",
    },
    {
      name: "BLACK_BANNER",
    },
    {
      name: "END_CRYSTAL",
    },
    {
      name: "CHORUS_FRUIT",
    },
    {
      name: "POPPED_CHORUS_FRUIT",
    },
    {
      name: "TORCHFLOWER_SEEDS",
    },
    {
      name: "BEETROOT",
    },
    {
      name: "BEETROOT_SEEDS",
    },
    {
      name: "BEETROOT_SOUP",
    },
    {
      name: "DRAGON_BREATH",
    },
    {
      name: "SPLASH_POTION",
    },
    {
      name: "SPECTRAL_ARROW",
    },
    {
      name: "TIPPED_ARROW",
    },
    {
      name: "LINGERING_POTION",
    },
    {
      name: "SHIELD",
    },
    {
      name: "TOTEM_OF_UNDYING",
    },
    {
      name: "SHULKER_SHELL",
    },
    {
      name: "IRON_NUGGET",
    },
    {
      name: "KNOWLEDGE_BOOK",
    },
    {
      name: "DEBUG_STICK",
    },
    {
      name: "MUSIC_DISC_13",
    },
    {
      name: "MUSIC_DISC_CAT",
    },
    {
      name: "MUSIC_DISC_BLOCKS",
    },
    {
      name: "MUSIC_DISC_CHIRP",
    },
    {
      name: "MUSIC_DISC_FAR",
    },
    {
      name: "MUSIC_DISC_MALL",
    },
    {
      name: "MUSIC_DISC_MELLOHI",
    },
    {
      name: "MUSIC_DISC_STAL",
    },
    {
      name: "MUSIC_DISC_STRAD",
    },
    {
      name: "MUSIC_DISC_WARD",
    },
    {
      name: "MUSIC_DISC_11",
    },
    {
      name: "MUSIC_DISC_WAIT",
    },
    {
      name: "MUSIC_DISC_OTHERSIDE",
    },
    {
      name: "MUSIC_DISC_5",
    },
    {
      name: "MUSIC_DISC_PIGSTEP",
    },
    {
      name: "DISC_FRAGMENT_5",
    },
    {
      name: "TRIDENT",
    },
    {
      name: "PHANTOM_MEMBRANE",
    },
    {
      name: "NAUTILUS_SHELL",
    },
    {
      name: "HEART_OF_THE_SEA",
    },
    {
      name: "CROSSBOW",
    },
    {
      name: "SUSPICIOUS_STEW",
    },
    {
      name: "LOOM",
    },
    {
      name: "FLOWER_BANNER_PATTERN",
    },
    {
      name: "CREEPER_BANNER_PATTERN",
    },
    {
      name: "SKULL_BANNER_PATTERN",
    },
    {
      name: "MOJANG_BANNER_PATTERN",
    },
    {
      name: "GLOBE_BANNER_PATTERN",
    },
    {
      name: "PIGLIN_BANNER_PATTERN",
    },
    {
      name: "GOAT_HORN",
    },
    {
      name: "COMPOSTER",
    },
    {
      name: "BARREL",
    },
    {
      name: "SMOKER",
    },
    {
      name: "BLAST_FURNACE",
    },
    {
      name: "CARTOGRAPHY_TABLE",
    },
    {
      name: "FLETCHING_TABLE",
    },
    {
      name: "GRINDSTONE",
    },
    {
      name: "SMITHING_TABLE",
    },
    {
      name: "STONECUTTER",
    },
    {
      name: "BELL",
    },
    {
      name: "LANTERN",
    },
    {
      name: "SOUL_LANTERN",
    },
    {
      name: "SWEET_BERRIES",
    },
    {
      name: "GLOW_BERRIES",
    },
    {
      name: "CAMPFIRE",
    },
    {
      name: "SOUL_CAMPFIRE",
    },
    {
      name: "SHROOMLIGHT",
    },
    {
      name: "HONEYCOMB",
    },
    {
      name: "BEE_NEST",
    },
    {
      name: "BEEHIVE",
    },
    {
      name: "HONEY_BOTTLE",
    },
    {
      name: "HONEYCOMB_BLOCK",
    },
    {
      name: "LODESTONE",
    },
    {
      name: "CRYING_OBSIDIAN",
    },
    {
      name: "BLACKSTONE",
    },
    {
      name: "BLACKSTONE_SLAB",
    },
    {
      name: "BLACKSTONE_STAIRS",
    },
    {
      name: "GILDED_BLACKSTONE",
    },
    {
      name: "POLISHED_BLACKSTONE",
    },
    {
      name: "POLISHED_BLACKSTONE_SLAB",
    },
    {
      name: "POLISHED_BLACKSTONE_STAIRS",
    },
    {
      name: "CHISELED_POLISHED_BLACKSTONE",
    },
    {
      name: "POLISHED_BLACKSTONE_BRICKS",
    },
    {
      name: "POLISHED_BLACKSTONE_BRICK_SLAB",
    },
    {
      name: "POLISHED_BLACKSTONE_BRICK_STAIRS",
    },
    {
      name: "CRACKED_POLISHED_BLACKSTONE_BRICKS",
    },
    {
      name: "RESPAWN_ANCHOR",
    },
    {
      name: "CANDLE",
    },
    {
      name: "WHITE_CANDLE",
    },
    {
      name: "ORANGE_CANDLE",
    },
    {
      name: "MAGENTA_CANDLE",
    },
    {
      name: "LIGHT_BLUE_CANDLE",
    },
    {
      name: "YELLOW_CANDLE",
    },
    {
      name: "LIME_CANDLE",
    },
    {
      name: "PINK_CANDLE",
    },
    {
      name: "GRAY_CANDLE",
    },
    {
      name: "LIGHT_GRAY_CANDLE",
    },
    {
      name: "CYAN_CANDLE",
    },
    {
      name: "PURPLE_CANDLE",
    },
    {
      name: "BLUE_CANDLE",
    },
    {
      name: "BROWN_CANDLE",
    },
    {
      name: "GREEN_CANDLE",
    },
    {
      name: "RED_CANDLE",
    },
    {
      name: "BLACK_CANDLE",
    },
    {
      name: "SMALL_AMETHYST_BUD",
    },
    {
      name: "MEDIUM_AMETHYST_BUD",
    },
    {
      name: "LARGE_AMETHYST_BUD",
    },
    {
      name: "AMETHYST_CLUSTER",
    },
    {
      name: "POINTED_DRIPSTONE",
    },
    {
      name: "OCHRE_FROGLIGHT",
    },
    {
      name: "VERDANT_FROGLIGHT",
    },
    {
      name: "PEARLESCENT_FROGLIGHT",
    },
    {
      name: "FROGSPAWN",
    },
    {
      name: "ECHO_SHARD",
    },
    {
      name: "BRUSH",
    },
    {
      name: "NETHERITE_UPGRADE_SMITHING_TEMPLATE",
    },
    {
      name: "SENTRY_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "DUNE_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "COAST_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "WILD_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "WARD_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "EYE_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "VEX_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "TIDE_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "SNOUT_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "RIB_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "SPIRE_ARMOR_TRIM_SMITHING_TEMPLATE",
    },
    {
      name: "POTTERY_SHARD_ARCHER",
    },
    {
      name: "POTTERY_SHARD_PRIZE",
    },
    {
      name: "POTTERY_SHARD_ARMS_UP",
    },
    {
      name: "POTTERY_SHARD_SKULL",
    },
    {
      name: "WATER",
    },
    {
      name: "LAVA",
    },
    {
      name: "TALL_SEAGRASS",
    },
    {
      name: "PISTON_HEAD",
    },
    {
      name: "MOVING_PISTON",
    },
    {
      name: "WALL_TORCH",
    },
    {
      name: "FIRE",
    },
    {
      name: "SOUL_FIRE",
    },
    {
      name: "REDSTONE_WIRE",
    },
    {
      name: "OAK_WALL_SIGN",
    },
    {
      name: "SPRUCE_WALL_SIGN",
    },
    {
      name: "BIRCH_WALL_SIGN",
    },
    {
      name: "ACACIA_WALL_SIGN",
    },
    {
      name: "CHERRY_WALL_SIGN",
    },
    {
      name: "JUNGLE_WALL_SIGN",
    },
    {
      name: "DARK_OAK_WALL_SIGN",
    },
    {
      name: "MANGROVE_WALL_SIGN",
    },
    {
      name: "BAMBOO_WALL_SIGN",
    },
    {
      name: "OAK_WALL_HANGING_SIGN",
    },
    {
      name: "SPRUCE_WALL_HANGING_SIGN",
    },
    {
      name: "BIRCH_WALL_HANGING_SIGN",
    },
    {
      name: "ACACIA_WALL_HANGING_SIGN",
    },
    {
      name: "CHERRY_WALL_HANGING_SIGN",
    },
    {
      name: "JUNGLE_WALL_HANGING_SIGN",
    },
    {
      name: "DARK_OAK_WALL_HANGING_SIGN",
    },
    {
      name: "MANGROVE_WALL_HANGING_SIGN",
    },
    {
      name: "CRIMSON_WALL_HANGING_SIGN",
    },
    {
      name: "WARPED_WALL_HANGING_SIGN",
    },
    {
      name: "BAMBOO_WALL_HANGING_SIGN",
    },
    {
      name: "REDSTONE_WALL_TORCH",
    },
    {
      name: "SOUL_WALL_TORCH",
    },
    {
      name: "NETHER_PORTAL",
    },
    {
      name: "ATTACHED_PUMPKIN_STEM",
    },
    {
      name: "ATTACHED_MELON_STEM",
    },
    {
      name: "PUMPKIN_STEM",
    },
    {
      name: "MELON_STEM",
    },
    {
      name: "WATER_CAULDRON",
    },
    {
      name: "LAVA_CAULDRON",
    },
    {
      name: "POWDER_SNOW_CAULDRON",
    },
    {
      name: "END_PORTAL",
    },
    {
      name: "COCOA",
    },
    {
      name: "TRIPWIRE",
    },
    {
      name: "POTTED_TORCHFLOWER",
    },
    {
      name: "POTTED_OAK_SAPLING",
    },
    {
      name: "POTTED_SPRUCE_SAPLING",
    },
    {
      name: "POTTED_BIRCH_SAPLING",
    },
    {
      name: "POTTED_JUNGLE_SAPLING",
    },
    {
      name: "POTTED_ACACIA_SAPLING",
    },
    {
      name: "POTTED_CHERRY_SAPLING",
    },
    {
      name: "POTTED_DARK_OAK_SAPLING",
    },
    {
      name: "POTTED_MANGROVE_PROPAGULE",
    },
    {
      name: "POTTED_FERN",
    },
    {
      name: "POTTED_DANDELION",
    },
    {
      name: "POTTED_POPPY",
    },
    {
      name: "POTTED_BLUE_ORCHID",
    },
    {
      name: "POTTED_ALLIUM",
    },
    {
      name: "POTTED_AZURE_BLUET",
    },
    {
      name: "POTTED_RED_TULIP",
    },
    {
      name: "POTTED_ORANGE_TULIP",
    },
    {
      name: "POTTED_WHITE_TULIP",
    },
    {
      name: "POTTED_PINK_TULIP",
    },
    {
      name: "POTTED_OXEYE_DAISY",
    },
    {
      name: "POTTED_CORNFLOWER",
    },
    {
      name: "POTTED_LILY_OF_THE_VALLEY",
    },
    {
      name: "POTTED_WITHER_ROSE",
    },
    {
      name: "POTTED_RED_MUSHROOM",
    },
    {
      name: "POTTED_BROWN_MUSHROOM",
    },
    {
      name: "POTTED_DEAD_BUSH",
    },
    {
      name: "POTTED_CACTUS",
    },
    {
      name: "CARROTS",
    },
    {
      name: "POTATOES",
    },
    {
      name: "SKELETON_WALL_SKULL",
    },
    {
      name: "WITHER_SKELETON_WALL_SKULL",
    },
    {
      name: "ZOMBIE_WALL_HEAD",
    },
    {
      name: "PLAYER_WALL_HEAD",
    },
    {
      name: "CREEPER_WALL_HEAD",
    },
    {
      name: "DRAGON_WALL_HEAD",
    },
    {
      name: "PIGLIN_WALL_HEAD",
    },
    {
      name: "WHITE_WALL_BANNER",
    },
    {
      name: "ORANGE_WALL_BANNER",
    },
    {
      name: "MAGENTA_WALL_BANNER",
    },
    {
      name: "LIGHT_BLUE_WALL_BANNER",
    },
    {
      name: "YELLOW_WALL_BANNER",
    },
    {
      name: "LIME_WALL_BANNER",
    },
    {
      name: "PINK_WALL_BANNER",
    },
    {
      name: "GRAY_WALL_BANNER",
    },
    {
      name: "LIGHT_GRAY_WALL_BANNER",
    },
    {
      name: "CYAN_WALL_BANNER",
    },
    {
      name: "PURPLE_WALL_BANNER",
    },
    {
      name: "BLUE_WALL_BANNER",
    },
    {
      name: "BROWN_WALL_BANNER",
    },
    {
      name: "GREEN_WALL_BANNER",
    },
    {
      name: "RED_WALL_BANNER",
    },
    {
      name: "BLACK_WALL_BANNER",
    },
    {
      name: "TORCHFLOWER_CROP",
    },
    {
      name: "BEETROOTS",
    },
    {
      name: "END_GATEWAY",
    },
    {
      name: "FROSTED_ICE",
    },
    {
      name: "KELP_PLANT",
    },
    {
      name: "DEAD_TUBE_CORAL_WALL_FAN",
    },
    {
      name: "DEAD_BRAIN_CORAL_WALL_FAN",
    },
    {
      name: "DEAD_BUBBLE_CORAL_WALL_FAN",
    },
    {
      name: "DEAD_FIRE_CORAL_WALL_FAN",
    },
    {
      name: "DEAD_HORN_CORAL_WALL_FAN",
    },
    {
      name: "TUBE_CORAL_WALL_FAN",
    },
    {
      name: "BRAIN_CORAL_WALL_FAN",
    },
    {
      name: "BUBBLE_CORAL_WALL_FAN",
    },
    {
      name: "FIRE_CORAL_WALL_FAN",
    },
    {
      name: "HORN_CORAL_WALL_FAN",
    },
    {
      name: "BAMBOO_SAPLING",
    },
    {
      name: "POTTED_BAMBOO",
    },
    {
      name: "VOID_AIR",
    },
    {
      name: "CAVE_AIR",
    },
    {
      name: "BUBBLE_COLUMN",
    },
    {
      name: "SWEET_BERRY_BUSH",
    },
    {
      name: "WEEPING_VINES_PLANT",
    },
    {
      name: "TWISTING_VINES_PLANT",
    },
    {
      name: "CRIMSON_WALL_SIGN",
    },
    {
      name: "WARPED_WALL_SIGN",
    },
    {
      name: "POTTED_CRIMSON_FUNGUS",
    },
    {
      name: "POTTED_WARPED_FUNGUS",
    },
    {
      name: "POTTED_CRIMSON_ROOTS",
    },
    {
      name: "POTTED_WARPED_ROOTS",
    },
    {
      name: "CANDLE_CAKE",
    },
    {
      name: "WHITE_CANDLE_CAKE",
    },
    {
      name: "ORANGE_CANDLE_CAKE",
    },
    {
      name: "MAGENTA_CANDLE_CAKE",
    },
    {
      name: "LIGHT_BLUE_CANDLE_CAKE",
    },
    {
      name: "YELLOW_CANDLE_CAKE",
    },
    {
      name: "LIME_CANDLE_CAKE",
    },
    {
      name: "PINK_CANDLE_CAKE",
    },
    {
      name: "GRAY_CANDLE_CAKE",
    },
    {
      name: "LIGHT_GRAY_CANDLE_CAKE",
    },
    {
      name: "CYAN_CANDLE_CAKE",
    },
    {
      name: "PURPLE_CANDLE_CAKE",
    },
    {
      name: "BLUE_CANDLE_CAKE",
    },
    {
      name: "BROWN_CANDLE_CAKE",
    },
    {
      name: "GREEN_CANDLE_CAKE",
    },
    {
      name: "RED_CANDLE_CAKE",
    },
    {
      name: "BLACK_CANDLE_CAKE",
    },
    {
      name: "POWDER_SNOW",
    },
    {
      name: "CAVE_VINES",
    },
    {
      name: "CAVE_VINES_PLANT",
    },
    {
      name: "BIG_DRIPLEAF_STEM",
    },
    {
      name: "POTTED_AZALEA_BUSH",
    },
    {
      name: "POTTED_FLOWERING_AZALEA_BUSH",
    },
  ];

  type enchant  = {
    name: string,
    cmdname?: string
  }

  // cmdname = the name that works in /give, or undefined if it is unchanged from the name
  const enchantments: enchant[] = [
    {
      name: "PROTECTION_FIRE-1",
      cmdname: "fire_protection-1",
    },
    {
      name: "PROTECTION_FIRE-2",
      cmdname: "fire_protection-2",
    },
    {
      name: "PROTECTION_FIRE-3",
      cmdname: "fire_protection-3",
    },
    {
      name: "PROTECTION_FIRE-4",
      cmdname: "fire_protection-4",
    },
    {
      name: "DAMAGE_ALL-1",
      cmdname: "sharpness-1",
    },
    {
      name: "DAMAGE_ALL-2",
      cmdname: "sharpness-2",
    },
    {
      name: "DAMAGE_ALL-3",
      cmdname: "sharpness-3",
    },
    {
      name: "DAMAGE_ALL-4",
      cmdname: "sharpness-4",
    },
    {
      name: "DAMAGE_ALL-5",
      cmdname: "sharpness-5",
    },
    {
      name: "ARROW_FIRE-1",
      cmdname: "flame-1",
    },
    {
      name: "SOUL_SPEED-1",
    },
    {
      name: "SOUL_SPEED-2",
    },
    {
      name: "SOUL_SPEED-3",
    },
    {
      name: "WATER_WORKER-1",
      cmdname: "aqua_affinity-1",
    },
    {
      name: "ARROW_KNOCKBACK-1",
      cmdname: "punch-1",
    },
    {
      name: "ARROW_KNOCKBACK-2",
      cmdname: "punch-2",
    },
    {
      name: "LOYALTY-1",
    },
    {
      name: "LOYALTY-2",
    },
    {
      name: "LOYALTY-3",
    },
    {
      name: "DEPTH_STRIDER-1",
    },
    {
      name: "DEPTH_STRIDER-2",
    },
    {
      name: "DEPTH_STRIDER-3",
    },
    {
      name: "VANISHING_CURSE-1",
    },
    {
      name: "DURABILITY-1",
      cmdname: "unbreaking-1",
    },
    {
      name: "DURABILITY-2",
      cmdname: "unbreaking-2",
    },
    {
      name: "DURABILITY-3",
      cmdname: "unbreaking-3",
    },
    {
      name: "KNOCKBACK-1",
    },
    {
      name: "KNOCKBACK-2",
    },
    {
      name: "LUCK-1",
      cmdname: "luck_of_the_sea-1",
    },
    {
      name: "LUCK-2",
      cmdname: "luck_of_the_sea-2",
    },
    {
      name: "LUCK-3",
      cmdname: "luck_of_the_sea-3",
    },
    {
      name: "BINDING_CURSE-1",
      cmdname: "binding_curse-1"
    },
    {
      name: "LOOT_BONUS_BLOCKS-1",
      cmdname: "fortune-1",
    },
    {
      name: "LOOT_BONUS_BLOCKS-2",
      cmdname: "fortune-2",
    },
    {
      name: "LOOT_BONUS_BLOCKS-3",
      cmdname: "fortune-3",
    },
    {
      name: "PROTECTION_ENVIRONMENTAL-1",
      cmdname: "protection-1",
    },
    {
      name: "PROTECTION_ENVIRONMENTAL-2",
      cmdname: "protection-2",
    },
    {
      name: "PROTECTION_ENVIRONMENTAL-3",
      cmdname: "protection-3",
    },
    {
      name: "PROTECTION_ENVIRONMENTAL-4",
      cmdname: "protection-4",
    },
    {
      name: "DIG_SPEED-1",
      cmdname: "efficiency-1",
    },
    {
      name: "DIG_SPEED-2",
      cmdname: "efficiency-2",
    },
    {
      name: "DIG_SPEED-3",
      cmdname: "efficiency-3",
    },
    {
      name: "DIG_SPEED-4",
      cmdname: "efficiency-4",
    },
    {
      name: "DIG_SPEED-5",
      cmdname: "efficiency-5",
    },
    {
      name: "MENDING-1",
    },
    {
      name: "FROST_WALKER-1",
    },
    {
      name: "FROST_WALKER-2",
    },
    {
      name: "LURE-1",
    },
    {
      name: "LURE-2",
    },
    {
      name: "LURE-3",
    },
    {
      name: "LOOT_BONUS_MOBS-1",
      cmdname: "looting-1",
    },
    {
      name: "LOOT_BONUS_MOBS-2",
      cmdname: "looting-2",
    },
    {
      name: "LOOT_BONUS_MOBS-3",
      cmdname: "looting-3",
    },
    {
      name: "PIERCING-1",
    },
    {
      name: "PIERCING-2",
    },
    {
      name: "PIERCING-3",
    },
    {
      name: "PIERCING-4",
    },
    {
      name: "PROTECTION_EXPLOSIONS-1",
      cmdname: "blast_protection-1",
    },
    {
      name: "PROTECTION_EXPLOSIONS-2",
      cmdname: "blast_protection-2",
    },
    {
      name: "PROTECTION_EXPLOSIONS-3",
      cmdname: "blast_protection-3",
    },
    {
      name: "PROTECTION_EXPLOSIONS-4",
      cmdname: "blast_protection-4",
    },
    {
      name: "DAMAGE_UNDEAD-1",
      cmdname: "smite-1",
    },
    {
      name: "DAMAGE_UNDEAD-2",
      cmdname: "smite-2",
    },
    {
      name: "DAMAGE_UNDEAD-3",
      cmdname: "smite-3",
    },
    {
      name: "DAMAGE_UNDEAD-4",
      cmdname: "smite-4",
    },
    {
      name: "DAMAGE_UNDEAD-5",
      cmdname: "smite-5",
    },
    {
      name: "MULTISHOT-1",
      cmdname: "multishot-1",
    },
    {
      name: "SWIFT_SNEAK-1",
    },
    {
      name: "SWIFT_SNEAK-2",
    },
    {
      name: "SWIFT_SNEAK-3",
    },
    {
      name: "FIRE_ASPECT-1",
    },
    {
      name: "FIRE_ASPECT-2",
    },
    {
      name: "CHANNELING-1",
    },
    {
      name: "SWEEPING_EDGE-1",
    },
    {
      name: "SWEEPING_EDGE-2",
    },
    {
      name: "SWEEPING_EDGE-3",
    },
    {
      name: "THORNS-1",
    },
    {
      name: "THORNS-2",
    },
    {
      name: "THORNS-3",
    },
    {
      name: "DAMAGE_ARTHROPODS-1",
      cmdname: "bane_of_arthropods-1",
    },
    {
      name: "DAMAGE_ARTHROPODS-2",
      cmdname: "bane_of_arthropods-2",
    },
    {
      name: "DAMAGE_ARTHROPODS-3",
      cmdname: "bane_of_arthropods-3",
    },
    {
      name: "DAMAGE_ARTHROPODS-4",
      cmdname: "bane_of_arthropods-4",
    },
    {
      name: "DAMAGE_ARTHROPODS-5",
      cmdname: "bane_of_arthropods-5",
    },
    {
      name: "OXYGEN-1",
      cmdname: "respiration-1",
    },
    {
      name: "OXYGEN-2",
      cmdname: "respiration-2",
    },
    {
      name: "OXYGEN-3",
      cmdname: "respiration-3",
    },
    {
      name: "RIPTIDE-1",
    },
    {
      name: "RIPTIDE-2",
    },
    {
      name: "RIPTIDE-3",
    },
    {
      name: "SILK_TOUCH-1",
    },
    {
      name: "QUICK_CHARGE-1",
    },
    {
      name: "QUICK_CHARGE-2",
    },
    {
      name: "QUICK_CHARGE-3",
    },
    {
      name: "PROTECTION_PROJECTILE-1",
      cmdname: "projectile_protection-1",
    },
    {
      name: "PROTECTION_PROJECTILE-2",
      cmdname: "projectile_protection-2",
    },
    {
      name: "PROTECTION_PROJECTILE-3",
      cmdname: "projectile_protection-3",
    },
    {
      name: "PROTECTION_PROJECTILE-4",
      cmdname: "projectile_protection-4",
    },
    {
      name: "IMPALING-1",
    },
    {
      name: "IMPALING-2",
    },
    {
      name: "IMPALING-3",
    },
    {
      name: "IMPALING-4",
    },
    {
      name: "IMPALING-5",
    },
    {
      name: "PROTECTION_FALL-1",
      cmdname: "feather_falling-1",
    },
    {
      name: "PROTECTION_FALL-2",
      cmdname: "feather_falling-2",
    },
    {
      name: "PROTECTION_FALL-3",
      cmdname: "feather_falling-3",
    },
    {
      name: "PROTECTION_FALL-4",
      cmdname: "feather_falling-4",
    },
    {
      name: "ARROW_DAMAGE-1",
      cmdname: "power-1",    },
    {
      name: "ARROW_DAMAGE-2",
      cmdname: "power-2",
    },
    {
      name: "ARROW_DAMAGE-3",
      cmdname: "power-3",
    },
    {
      name: "ARROW_DAMAGE-4",
      cmdname: "power-4",
    },
    {
      name: "ARROW_DAMAGE-5",
      cmdname: "power-5",
    },
    {
      name: "ARROW_INFINITE-1",
      cmdname: "infinity-1",
    },
  ];

  const itemflags = [
    {
      name: "HIDE_ENCHANTS",
    },
    {
      name: "HIDE_ATTRIBUTES",
    },
    {
      name: "HIDE_UNBREAKABLE",
    },
    {
      name: "HIDE_DESTROYS",
    },
    {
      name: "HIDE_PLACED_ON",
    },
    {
      name: "HIDE_POTION_EFFECTS",
    },
    {
      name: "HIDE_DYE",
    },
    {
      name: "HIDE_ARMOR_TRIM",
    },
  ];

  materials.sort((a, b) => a.name.localeCompare(b.name));
  itemflags.sort((a, b) => a.name.localeCompare(b.name));
  enchantments.sort((a, b) => a.name.localeCompare(b.name));

  /* CREATE BASIC VARIABLES */
  var enchantmentButton;
  var defaultEnchantment: HTMLElement | null;

  var flagButton;
  var defaultFlag: HTMLElement | null;

  var generateButton;

  onMount(() => {
    enchantmentButton = document.getElementById("enchantment-button");
    defaultEnchantment = document.getElementById("enchantment");

    flagButton = document.getElementById("flag-button");
    defaultFlag = document.getElementById("itemflag");

    generateButton = document.getElementById("generateButton");

    /* ADD EVENT LISTENERS */
    enchantmentButton?.addEventListener("click", (event) => {
      handleEnchantClick(event);
    });
    flagButton?.addEventListener("click", (event) => {
      handleFlagClick(event);
    });
    generateButton?.addEventListener("click", (event) => {
      handleGenerateClick(event);
    });
  });

  /* HANDLE ENCHANT CLICK */
  function handleEnchantClick(event: Event) {
    const newSelect = document.createElement("select");

    const defoption = document.createElement("option");
    defoption.value = "main-enchantment";
    defoption.text = "Select an option...";
    newSelect.appendChild(defoption);

    enchantments.forEach((enchantment) => {
      const option = document.createElement("option");
      option.value = enchantment.name;
      option.text = enchantment.name;
      newSelect.appendChild(option);
    });

    newSelect.setAttribute(
      "class",
      "text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E] mt-4 appearance-none enchantment"
    );
    defaultEnchantment?.parentNode?.insertBefore(
      newSelect,
      defaultEnchantment?.nextSibling
    );
  }

  /* HANDLE FLAG CLICK */
  function handleFlagClick(event: Event) {
    const newSelect = document.createElement("select");

    const defoption = document.createElement("option");
    defoption.value = "main-itemflag";
    defoption.text = "Select an option...";
    newSelect.appendChild(defoption);

    itemflags.forEach((itemflag) => {
      const option = document.createElement("option");
      option.value = itemflag.name;
      option.text = itemflag.name;
      newSelect.appendChild(option);
    });

    newSelect.setAttribute(
      "class",
      "text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E] mt-4 appearance-none itemflag"
    );
    defaultFlag?.parentNode?.insertBefore(newSelect, defaultFlag?.nextSibling);
  }

  /*
    # Start: Penguin
  */
  function getMaterial(): string {
    if ((document.getElementById("material") as HTMLSelectElement).selectedOptions[0].text == "Select an option...") { 
      return "NULL"
    } else {
      return (document.getElementById("material") as HTMLSelectElement).selectedOptions[0].text;
    }
  }

  function getEnchants(): enchant[] {
    let enchantmentSelects = document.getElementsByClassName("enchantment");
    let values: enchant[] = [];
    for (var i = 0; i < enchantmentSelects.length; i++) {
      var selectElement = enchantmentSelects[i];
      var selectedValue = (selectElement as HTMLSelectElement).selectedOptions[0].text;
      if (selectedValue != "Select an option...") {
        values.push(enchantments.find((option) => option.name === selectedValue)!!);
      }
    }
    return values;
  }

  let material: string = "NULL"
  let displayname: string | null = "Custom Item"
  let lore: string | null = "Use \\n to create a new line"
  $: lines = lore ? lore.split('\\n') : []
  let cmd = "0"
  let enchants: enchant[] = []

  /*
    # End: Penguin
  */

  /* HANDLE GENERATE CLICK */
  function handleGenerateClick(event: Event) {
    var code = "ItemStack item = new ItemStack(Material.";

    /* SET MATERIAL TYPE */
    code += getMaterial()
    code += ");";

    /* ITEM META */
    code += "\nItemMeta meta = item.getItemMeta();";

    /* DISPLAYNAME */
    code +=
      "\nmeta.setDisplayName(ChatColor.translateAlternateColorCodes('&', \"" +
      (document.getElementById("displayname") as HTMLInputElement).value +
      '"));';

    /* LORE */

    code += "\nmeta.setLore(Arrays.asList(";

    var lines = (
      document.getElementById("lore") as HTMLInputElement
    ).value.split("\\n");

    lines.forEach((line, index) => {
      code += "ChatColor.translateAlternateColorCodes('&', \"" + line + '")';

      if (index != lines.length - 1) {
        code += ", ";
      }
    });

    code += "));";

    /* CMD */

    let cmdval = (document.getElementById("cmd") as HTMLInputElement).value
    if (cmdval != "0" && cmdval) {
      code += `\nmeta.setCustomModelData("${cmdval}");`;
    }

    /* ENCHANTMENT */    
    let values = getEnchants().map((ench) => ench.name);

    if (values.length > 0) {
      values.forEach((value) => {
        code +=
          "\nmeta.addEnchant(" +
          "Enchantment." +
          value.split("-")[0] +
          ", " +
          value.split("-")[1] +
          ", " +
          " true" +
          ");";
      });
    }

    /* ITEM FLAGS */

    var itemSelects = document.getElementsByClassName("itemflag");
    var itemValues = [];

    for (var i = 0; i < itemSelects.length; i++) {
      var selectElementItem = itemSelects[i];
      var selectedValueItem = (selectElementItem as HTMLSelectElement)
        .selectedOptions[0].text;

      if (selectedValueItem != "Select an option...") {
        itemValues.push(selectedValueItem);
      }
    }

    if (itemValues.length > 0) {
      code += "\nmeta.addItemFlags(";
      itemValues.forEach((value, index) => {
        code += "ItemFlag." + value;
        if (index != itemValues.length - 1) {
          code += ", ";
        }
      });

      code += ");";
    }

    /* APPLY */

    code += "\nitem.setItemMeta(meta);";

    console.log(code);

    var oldCode = document.getElementById("code");
    var oldCopy = document.getElementById("copyButton");
    if (oldCode != null) {
      oldCode.remove();
    }
    if (oldCopy != null) {
      oldCopy.remove();
    }

    var codeElement = document.createElement("p");
    codeElement.setAttribute(
      "class",
      "mt-8 font-mono break-words border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E]"
    );
    codeElement.setAttribute("id", "code");
    codeElement.textContent = code;

    var copyButton = document.createElement("button");
    copyButton.setAttribute("class", "button mt-4");
    copyButton.setAttribute("id", "copyButton");
    copyButton.textContent = "Copy";

    var generateButton = document.getElementById("generateButton");

    generateButton?.parentNode?.insertBefore(
      copyButton,
      generateButton.nextSibling
    );

    generateButton?.parentNode?.insertBefore(
      codeElement,
      generateButton.nextSibling
    );

    copyButton.addEventListener("click", (event) => {
      const tempInput = document.createElement("textarea");
      tempInput.value = code;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    });
  }
</script>
<main class="w-[90%] lg:w-[60%]">
  <div class="tab-system w-[100%] flex flex-col">
    <!--MATERIAL-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3">Material</h3>
    <select
      on:click={() => material = getMaterial()}
      name="material"
      id="material"
      class="text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E] appearance-none"
    >
      <option value="main-material">Select an option...</option>
      {#each materials as material, index}
        <option value={material.name}>{material.name}</option>
      {/each}
    </select>

    <!--DISPLAYNAME-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3 mt-6">
      Displayname
    </h3>
    <input      
      bind:value={displayname}
      id="displayname"
      type="text"
      class="rounded text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#ffff] bg-[#1A1B1E]"
      
    />

    <!--LORE-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3 mt-6">Lore</h3>
    <input
      bind:value={lore}
      id="lore"
      type="text"
      class="rounded text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#ffff] bg-[#1A1B1E]"
    />

    <!--CMD-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3 mt-6">
      Custom Model Data
    </h3>
    <input
      bind:value={cmd}
      id="cmd"
      type="text"
      class="rounded text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#ffff] bg-[#1A1B1E]"
    />

    <!--ENCHANTMENT-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3 mt-6">
      Enchantment
    </h3>
    <select
      on:click={() => enchants = getEnchants()}
      name="enchantment"
      id="enchantment"
      class="text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E] appearance-none enchantment"
    >
      <option value="main-enchantment">Select an option...</option>
      {#each enchantments as enchantment, index}
        <option value={enchantment.name}>{enchantment.name}</option>
      {/each}
    </select>
    <div id="enchantment-button-div" class="flex justify-center">
      <button
        id="enchantment-button"
        class="w-fit text-sm px-2 py-1.5 button h-fit inline-block cente pr-3 pl-3 mt-3"
      >
        +
      </button>
    </div>

    <!--ITEM FLAG-->
    <h3 class="font-medium text-white text-[20px] text-left mb-3 mt-6">
      Item Flag
    </h3>
    <select
      name="itemflag"
      id="itemflag"
      class="text-xl font-medium border-2 rounded-xl py-2 px-4 border-[#626875] text-[#fff] bg-[#1A1B1E] appearance-none itemflag"
    >
      <option value="main-itemflag">Select an option...</option>
      {#each itemflags as itemflag, index}
        <option value={itemflag.name}>{itemflag.name}</option>
      {/each}
    </select>
    <div class="flex justify-center">
      <button
        id="flag-button"
        class="w-fit text-sm px-2 py-1.5 button h-fit inline-block cente pr-3 pl-3 mt-3"
      >
        +
      </button>
    </div>

    <button id="generateButton" class="button mt-10">Generate!</button>
    <GiveCommand material={material}
      displayName={displayname} 
      lore={lines} 
      custommodeldata={cmd}
      enchants={enchants} 
    />
  </div>
</main>

<style>
  #code {
    width: 100%;
  }
</style>
