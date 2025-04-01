const utils: Util[] = [
    {
        path: "server-jars",
        name: "Server Jars",
        description: "Download jar files for popular server software.",
        shortDescription: "Download server software jar",
        seoDescription: "Instantly download Minecraft server jars for all versions: Vanilla, Fabric, Forge, CraftBukkit, Spigot, Paper, Purpur, Folia, BungeeCord, Waterfall, and Velocity. Optimize your Minecraft server setup with our comprehensive jar collection."
    },
    {
        path: "inventory-slots",
        name: "Inventory Slots",
        description: "Slot numbers for every inventory type.",
        shortDescription: "Numbers for all inventories",
        seoDescription: "Complete guide to Minecraft Bukkit inventory slot IDs. Navigate chests, double chests, furnaces, player inventories, villager trades, brewing stands, crafting tables, and more. Essential resource for Minecraft plugin developers and server admins."
    },
    {
        path: "item-ids",
        name: "Item IDs",
        description: "Search all in-game items and IDs.",
        shortDescription: "Modern & legacy item IDs",
        seoDescription: "Comprehensive Minecraft item ID database. Search and explore all current and legacy item IDs (data values). Essential tool for modders, plugin developers, and command block enthusiasts.",
    },
    {
        path: "sound-explorer",
        name: "Sound Explorer",
        description: "Browse all Minecraft sounds.",
        shortDescription: "Browse Minecraft Sounds",
        seoDescription: "Browse the sounds used in Minecraft. Experiment with different volume and pitch. See command to use the sound in-game and download all the sounds with a click of your mouse."
    },
    {
        path: "start-file-generator",
        name: "Start File Generator",
        description: "Generate server start file with varying settings and flags.",
        shortDescription: "Generate server jar start file",
        seoDescription: "Create optimized Minecraft server start files instantly. Generate custom start.bat or start.command scripts for Spigot/Paper servers. Configure RAM allocation and advanced flags, including proxy settings and Aikar's performance-boosting flags."
    },
    {
        path: "ram-calculator",
        name: "RAM Calculator",
        description: "Calculate the recommended RAM for your server.",
        shortDescription: "Calculate recommended RAM",
        seoDescription: "Optimize your Minecraft server performance with a RAM calculator. Get precise memory recommendations based on player count and installed plugins. Ensure smooth gameplay and maximize server efficiency with accurate RAM allocation.",
    },
    {
        path: "server-info",
        name: "Server Info",
        description: "Ping an address to get live server data.",
        shortDescription: "Ping server for info",
        seoDescription: "Real-time Minecraft server status checker. Instantly view live player counts, MOTD, and server favicons. Monitor your favorite Minecraft servers or troubleshoot your own with a user-friendly server list viewer."
    },
    {
        path: "skin-stealer",
        name: "Skin Stealer",
        description: "Steal a player's skin from their IGN.",
        shortDescription: "Steal another player's skin",
        seoDescription: "Discover and download Minecraft player skins instantly. Search by in-game name to view, save, and use any player's unique skin. Perfect for inspiration, cosplay, or trying new looks in Minecraft.",
    },
    {
        path: "cape-stealer",
        name: "Cape Stealer",
        description: "Steal a player's cape from their IGN.",
        shortDescription: "Steal another player's cape",
        seoDescription: "Explore and download rare Minecraft capes. Find Mojang, Minecon, and Optifine capes by player name. View, save, and admire exclusive Minecraft capes from any player. Ideal for cape enthusiasts and collectors.",
    },
    {
        path: "color-codes",
        name: "Color Codes",
        description: "List of built in color and format codes.",
        shortDescription: "All default color codes",
        seoDescription: "Complete Minecraft color code reference guide. Access chat codes (&), MiniMessage tags, MOTD codes, and hex values. Enhance your server's visual appeal with our comprehensive color code table for text formatting and customization.",
    },
    {
        path: "color-text-generator",
        name: "Color Text Generator",
        description: "Generate and preview text with color codes.",
        shortDescription: "Create text with color codes",
        seoDescription: "Create vibrant Minecraft text with our color code generator. Preview custom colored messages in chat, signs, books, MOTD, item name, item lore and kick message. Supports both standard color codes and custom hex values for unlimited creativity.",
    },
    {
        path: "gradient-generator",
        name: "Gradient Generator",
        description: "Create a gradient between two colors for in-game text.",
        shortDescription: "Create chat color gradient",
        seoDescription: "Design color gradients for Minecraft text, creating smooth transitions between any two colors. Get instant Spigot ChatColor and MiniMessage outputs for easy implementation in plugins.",
    },
    {
        path: "small-text-converter",
        name: "Small Text Converter",
        description: "Convert into sᴍᴀʟʟ ᴛᴇxᴛ seen on new era servers.",
        shortDescription: "Convert into sᴍᴀʟʟ ᴛᴇxᴛ",
        seoDescription: "Transform your Minecraft text into stylish small caps. Convert regular text to the trendy, compact font used on popular servers like MCCI, Mineclub, TubNet. Stand out in chat, signs, and names with the easy-to-use small text converter.",
    },
    {
        path: "server-icon-converter",
        name: "Server Icon Converter",
        description: "Resize and rename any image as a server icon.",
        shortDescription: "Create a server-icon.png",
        seoDescription: "Create perfect Minecraft server icons in seconds. Upload any image and the tool will automatically resize to the required 64x64 format and rename it to server-icon.png.",
    },
    {
        path: "unicode-symbols",
        name: "Unicode Symbols",
        description: "Collection of allowed in-game unicode characters.",
        shortDescription: "All allowed unicode symbols",
        seoDescription: "Explore hundreds of Minecraft-compatible Unicode symbols. Enhance your chat, GUIs, and MOTDs with unique characters. The curated collection ensures all symbols display correctly in-game.",
    },
    {
        path: "note-block-songs",
        name: "Note Block Songs",
        description:
            "Largest collection of .nbs files to use with <a href='https://www.spigotmc.org/resources/noteblockapi.19287/' aria-label='NoteblockAPI' target='_blank' class='underline decoration-dotted'>NoteblockAPI</a>.",
        shortDescription: "Largest .nbs file collection",
        seoDescription: "The web's largest Minecraft Note Block song collection. Download .nbs files compatible with NoteBlockAPI. Add immersive music to your Minecraft server or map. Thousands of songs available for instant use in your projects.",
    },
    {
        path: "banner-creator",
        name: "Banner Creator",
        description: "Create a banner design and get in-game commands and code.",
        shortDescription: "Craft banners and get code",
        seoDescription: "Design custom Minecraft banners with an intuitive creator. Choose from all available colors and patterns. Get instant /give commands and Spigot API code for easy implementation. Perfect for server branding, team flags, or decorative projects.",
    },
    {
        path: "daylight-cycle",
        name: "Daylight Cycle",
        description: "Convert real time into Minecraft time.",
        shortDescription: "Convert real time to MC time",
        seoDescription: "Master Minecraft's daylight cycle with a time converter. Translate real-world time to in-game ticks. Visualize the day-night cycle with our interactive graph. Optimize your gameplay and automate time-based events with precision.",
    },
    {
        path: "firework-creator",
        name: "Firework Creator",
        description: "Create a firework and get in-game commands and recipe.",
        shortDescription: "Build custom fireworks",
        seoDescription: "Craft spectacular Minecraft fireworks with a custom creator. Design unique explosions, effects, colors, and durations. Instantly receive in-game commands and crafting recipes for your creations. Perfect for celebrations, events, or adding flair to your Minecraft world.",
    },
    {
        "path": "nether-coords",
        "name": "Coordinates Converter",
        "description": "Convert coordinates between the Overworld and the Nether, or viceversa.",
        "shortDescription": "Convert coordinates",
        "seoDescription": "Convert Minecraft coordinates between the Overworld and the Nether instantly. Calculate precise coordinates for fast travel, portal linking, and efficient navigation. Get accurate 8:1 ratio conversions for both directions, making your Nether travel planning quick and easy."
    }    
];

type Util = {
    path: string;
    name: string;
    description: string;
    shortDescription: string;
    seoDescription: string;
};

export const utilList = async () => {
    return utils;
};

export const findUtilByPath = async (path: string) => {
    for (const i in utils) {
        const util = utils[i];
        if (util.path == path) return util;
    }
    return undefined;
};
