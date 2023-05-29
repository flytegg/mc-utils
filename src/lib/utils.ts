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
        description: "Download a specific server jar",
        shortDescription: "wdawdwadad"
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