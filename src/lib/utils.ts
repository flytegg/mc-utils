const utils: Util[] = [
<<<<<<< Updated upstream
    {
        path: "skin-stealer",
        name: "Skin Stealer",
        description: "Steal a player's skin from their IGN.",
        shortDescription: "Steal another player's skin"
    },
    {
        path: "server-jars",
        name: "Server Jars",
        description: "Download existing jar files for<br> popular server software.",
        shortDescription: "Download server software jar"
    },
    {
        path: "start-file-generator",
        name: "Start File Generator",
        description: "Generate server start file with<br> varying settings and flags.",
        shortDescription: "Generate server jar start file"
    },
    {
        path: "note-block-songs",
        name: "Note Block Songs",
        description: "Largest collection of Note Block Songs<br> (.nbs files) to use with <a href='https://www.spigotmc.org/resources/noteblockapi.19287/' target='_blank' class='underline decoration-dotted'>NoteblockAPI</a>.",
        shortDescription: "Largest .nbs file collection"
    },
    {
        path: "inventory-slots",
        name: "Inventory Slots",
        description: "Slot numbers for every inventory type.",
        shortDescription: "Numbers for all inventories"
    },
    {
        path: "color-text-generator",
        name: "Color Text Generator",
        description: "Generate and preview text with color codes.",
        shortDescription: "Create text with color codes"
    },
    {
        path: "unicode-symbols",
        name: "Unicode Symbols",
        description: "The full collection of all allowed<br> in-game unicode characters.",
        shortDescription: "All allowed unicode symbols"
    },
    {
        path: "gradient-generator",
        name: "Gradient Generator",
        description: "Generate a gradient between two<br> colors for in-game text.",
        shortDescription: "Create chat color gradient"
    },
    {
        path: "server-info",
        name: "Server Info",
        description: "Ping an address to get live server data.",
        shortDescription: "Ping server for info"
    },
    {
        path: "armor-color",
        name: "Armor Color Generator",
        description: "Generate Leather armor using any color.",
        shortDescription: "Generate Leather colored armor"
    }
]
=======
  {
    path: "start-file-generator",
    name: "Start File Generator",
    description: "Generate server start file with varying settings and flags.",
    shortDescription: "Generate server jar start file",
  },
  {
    path: "server-jars",
    name: "Server Jars",
    description: "Download jar files for popular server software.",
    shortDescription: "Download server software jar",
  },
  {
    path: "server-info",
    name: "Server Info",
    description: "Ping an address to get live server data.",
    shortDescription: "Ping server for info",
  },
  {
    path: "skin-stealer",
    name: "Skin Stealer",
    description: "Steal a player's skin from their IGN.",
    shortDescription: "Steal another player's skin",
  },
  {
    path: "inventory-slots",
    name: "Inventory Slots",
    description: "Slot numbers for every inventory type.",
    shortDescription: "Numbers for all inventories",
  },
  {
    path: "color-codes",
    name: "Color Codes",
    description: "List of built in color and format codes.",
    shortDescription: "All default color codes",
  },
  {
    path: "color-text-generator",
    name: "Color Text Generator",
    description: "Generate and preview text with color codes.",
    shortDescription: "Create text with color codes",
  },
  {
    path: "gradient-generator",
    name: "Gradient Generator",
    description: "Create a gradient between two colors for in-game text.",
    shortDescription: "Create chat color gradient",
  },
  {
    path: "small-text-converter",
    name: "Small Text Converter",
    description:
      'Convert into <span style="font-variant: small-caps;">small text</span> seen on new era servers.',
    shortDescription:
      'Convert into <span style="font-variant: small-caps;">small text</span>',
  },
  // {
  //     path: "unicode-symbols",
  //     name: "Unicode Symbols",
  //     description: "The full collection of all allowed<br> in-game unicode characters.",
  //     shortDescription: "All allowed unicode symbols"
  // },
  {
    path: "note-block-songs",
    name: "Note Block Songs",
    description:
      "Largest collection of .nbs files to use with <a href='https://www.spigotmc.org/resources/noteblockapi.19287/' aria-label='NoteblockAPI' target='_blank' class='underline decoration-dotted'>NoteblockAPI</a>.",
    shortDescription: "Largest .nbs file collection",
  },
  {
    path: "banner-creator",
    name: "Banner Creator",
    description: "Create a banner design and get in-game commands and code.",
    shortDescription: "Craft banners and get code",
  },
  {
    path: "daylight-cycle",
    name: "Daylight Cycle",
    description: "Convert real time into Minecraft time.",
    shortDescription: "Convert real time to MC time",
  },
  {
    path: "item-creator",
    name: "Item Creator",
    description: "Configure your item and get spigot/java code",
    shortDescription: "Create items and get code",
  },
];
>>>>>>> Stashed changes

type Util = {
  path: string;
  name: string;
  description: string;
  shortDescription: string;
};

export const utilList = async () => {
  return utils;
};

export const findUtilByPath = async (path: string) => {
<<<<<<< Updated upstream
    for (const i in utils) {
        const util = utils[i]
        if (util.path == path) return util
    }
    return undefined
}
=======
  for (const i in utils) {
    const util = utils[i];
    if (util.path == path) return util;
  }
  return undefined;
};
>>>>>>> Stashed changes
