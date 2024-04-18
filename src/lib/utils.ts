const utils: Util[] = [
    {
        path: "server-jars",
        name: "Server Jars",
        description: "Download jar files for popular server software.",
        shortDescription: "Download server software jar",
        seoDescription:
            "Download Minecraft server jars of any version including Vanilla, Fabric, Forge, CraftBukkit, Spigot, Paper, Purpur, Folia, BungeeCord, Waterfall and Velocity.",
    },
    {
        path: "inventory-slots",
        name: "Inventory Slots",
        description: "Slot numbers for every inventory type.",
        shortDescription: "Numbers for all inventories",
        seoDescription:
            "A list of Minecraft Bukkit inventory slot IDs including chests, double chests, furnace, player, villager, brewing stand, crafting table and many more.",
    },
    {
        path: "item-ids",
        name: "Item IDs",
        description: "Search all in-game items and IDs.",
        shortDescription: "Modern & legacy item IDs",
        seoDescription:
            "An interactive list of all Minecraft item IDs, including current and legacy IDs (data values).",
    },
    {
        path: "start-file-generator",
        name: "Start File Generator",
        description: "Generate server start file with varying settings and flags.",
        shortDescription: "Generate server jar start file",
        seoDescription:
            "A minimal script generator to produce start.bat or start.command files for Minecraft Spigot/Paper servers with customisable RAM and Flags (proxy & Aikar's flags).",
    },
    {
        path: "server-info",
        name: "Server Info",
        description: "Ping an address to get live server data.",
        shortDescription: "Ping server for info",
        seoDescription:
            "A Minecraft server list like viewer to view live player counts, MOTD and favicon.",
    },
    {
        path: "skin-stealer",
        name: "Skin Stealer",
        description: "Steal a player's skin from their IGN.",
        shortDescription: "Steal another player's skin",
        seoDescription:
            "View and download any Minecraft player's skin by searching their in-game name.",
    },
    {
        path: "cape-stealer",
        name: "Cape Stealer",
        description: "Steal a player's cape from their IGN.",
        shortDescription: "Steal another player's cape",
        seoDescription: "View and download any Minecraft player's capes, whether Mojang/Minecon or Optifine, by searching their in-game name.",
    },
    {
        path: "color-codes",
        name: "Color Codes",
        description: "List of built in color and format codes.",
        shortDescription: "All default color codes",
        seoDescription:
            "Table of Minecraft color codes along with the chat code (&), the MiniMessage tag, the MOTD code and the hex codes.",
    },
    {
        path: "color-text-generator",
        name: "Color Text Generator",
        description: "Generate and preview text with color codes.",
        shortDescription: "Create text with color codes",
        seoDescription:
            "Generate text using Minecraft color codes & custom hex codes and preview as text, in sign, a book, chat and MOTD.",
    },
    {
        path: "custom-heads",
        name: "Custom Heads",
        description: "List of 900+ custom Minecraft heads.",
        shortDescription: "List of custom heads.",
        seoDescription:
            "Find the perfect head to decorate your build through our amazing collection of 900+ custom Minecraft heads!",
    },
    {
        path: "gradient-generator",
        name: "Gradient Generator",
        description: "Create a gradient between two colors for in-game text.",
        shortDescription: "Create chat color gradient",
        seoDescription:
            "Create a custom gradient between two colors and receive Spigot ChatColor and MiniMessage output for use in Minecraft plugins.",
    },
    {
        path: "small-text-converter",
        name: "Small Text Converter",
        description: "Convert into sᴍᴀʟʟ ᴛᴇxᴛ seen on new era servers.",
        shortDescription: "Convert into sᴍᴀʟʟ ᴛᴇxᴛ",
        seoDescription:
            "Convert text into small caps font seen on Minecraft servers like MCCI- uppercase-like, yet tiny, small capital letters.",
    },
    {
        path: "server-icon-converter",
        name: "Server Icon Converter",
        description: "Resize and rename any image as a server icon.",
        shortDescription: "Create a server-icon.png",
        seoDescription:
            "Convert an image into a Minecraft server icon by resizing to 64x64 format and renaming to server-icon.png.",
    },
    {
        path: "unicode-symbols",
        name: "Unicode Symbols",
        description: "Collection of allowed in-game unicode characters.",
        shortDescription: "All allowed unicode symbols",
        seoDescription:
            "A collection of unicode characters/symbols which can be used in Minecraft chat, GUIs, MOTDs.",
    },
    {
        path: "note-block-songs",
        name: "Note Block Songs",
        description:
            "Largest collection of .nbs files to use with <a href='https://www.spigotmc.org/resources/noteblockapi.19287/' aria-label='NoteblockAPI' target='_blank' class='underline decoration-dotted'>NoteblockAPI</a>.",
        shortDescription: "Largest .nbs file collection",
        seoDescription:
            "The largest collection of Noteblock Studio songs (.nbs files) for use in NoteBlockAPI to play Note Block music in Minecraft.",
    },
    {
        path: "banner-creator",
        name: "Banner Creator",
        description: "Create a banner design and get in-game commands and code.",
        shortDescription: "Craft banners and get code",
        seoDescription:
            "Create Minecraft banners using a range of colors or patterns and receive the /give command and Spigot API code.",
    },
    {
        path: "daylight-cycle",
        name: "Daylight Cycle",
        description: "Convert real time into Minecraft time.",
        shortDescription: "Convert real time to MC time",
        seoDescription:
            "Convert real life time into Minecraft ticks and view a daylight time graph. ",
    },
    {
        path: "firework-creator",
        name: "Firework Creator",
        description: "Create a firework and get in-game commands and recipe.",
        shortDescription: "Build custom fireworks",
        seoDescription:
            "Build a Minecraft firework with custom explosion shapes, effects, colors and durations and get the commands and crafting recipe for it.",
    },
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
