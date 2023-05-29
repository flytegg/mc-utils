import { existsSync, readFileSync, readdirSync } from "node:fs"
import { Favourites } from "./store"
import type { Cookies } from "@sveltejs/kit"

const dir = "src/lib/component/util"
const nameRegex = /const name = /
const descriptionRegex = /const description = /
const shortDescriptionRegex = /const shortDescription = /

type Util = {
    path: string
    icon: string
    name: string
    description: string
    shortDescription: string
}

export const utilList = async () => {
    const utils: Util[] = []
    readdirSync(`${dir}/component`).forEach((fileName: string) => {
        const path = fileName.replace(".svelte", "")
        let name = ""
        let description = ""
        let shortDescription = ""

        readFileSync(`${dir}/component/${fileName}`, {encoding: 'utf8', flag: 'r'}).split(/\r?\n/).forEach((line: string) => {
            if (nameRegex.test(line)) name = clean(line, nameRegex)
            if (descriptionRegex.test(line)) description = clean(line, descriptionRegex)
            if (shortDescriptionRegex.test(line)) shortDescription = clean(line, shortDescriptionRegex)
        })
        utils.push({
            path: path,
            icon: `/${dir}/icon/${path}.png`,
            name: name,
            description: description,
            shortDescription: shortDescription
        })
    })
    return utils
}

export const findUtilByPath = async (path: string) => {
    const componentUri = `${dir}/component/${path}.svelte`
    if (!existsSync(componentUri)) return undefined
    let name = ""
    let description = ""
    let shortDescription = ""
    
    readFileSync(componentUri, {encoding: 'utf8', flag: 'r'}).split(/\r?\n/).forEach((line: string) => {
        if (nameRegex.test(line)) name = clean(line, nameRegex)
        if (descriptionRegex.test(line)) description = clean(line, descriptionRegex)
        if (shortDescriptionRegex.test(line)) shortDescription = clean(line, shortDescriptionRegex)
    });

    return {
        path: path,
        icon: `/${dir}/icon/${path}.png`,
        name: name,
        description: description,
        shortDescription: shortDescription
    }
}

const clean = (string: string, iconRegex: RegExp) => {
    string = string.split(iconRegex)[1]
    if (string.endsWith(";")) string = string.substring(0, string.length - 1)
    if (string.startsWith("'")) string = string.substring(1)
    if (string.endsWith("'")) string = string.substring(0, string.length - 1)
    return string.replaceAll("\"", "").replaceAll("`", "").replaceAll("\\'", "'")
} 