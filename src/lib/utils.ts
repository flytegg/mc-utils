const utils: Util[] = [
    {
        path: "skin-stealer",
        name: "Skin Stealer",
        description: "Yoink someone's skin",
        shortDescription: "asdasd"
    },
    {
        path: "server-jars",
        name: "Server Jars",
        description: "Download existing jar files for<br>popular server software.",
        shortDescription: "wdawdwadad"
    },
    {
        path: "start-file-generator",
        name: "Start File Generator",
        description: "Generate server start file with<br>varying settings and flags.",
        shortDescription: "wdawdwadad"
    },
    {
        path: "note-block-songs",
        name: "Note Block Songs",
        description: "Largest collection of Note Block Songs (.nbs files)<br>on the web to use with <a href='https://www.spigotmc.org/resources/noteblockapi.19287/' target='_blank' class='underline decoration-dotted'>NoteblockAPI</a>.",
        shortDescription: "wdawdwadad"
    },
    {
        path: "inventory-slots",
        name: "Inventory Slots",
        description: "awdeadwadwwad",
        shortDescription: "wdwdwddwdwdw"
    }
]

type Util = {
    path: string
    name: string
    description: string
    shortDescription: string
}

export const utilList = async () => {
    return utils
}

export const findUtilByPath = async (path: string) => {
    for (const i in utils) {
        const util = utils[i]
        if (util.path == path) return util
    }
    return undefined
}