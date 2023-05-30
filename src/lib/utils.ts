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