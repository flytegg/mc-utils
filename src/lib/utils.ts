import { existsSync, readFileSync, readdirSync } from "fs-extra";

const dir = "src/lib/util";
const nameRegex = /const name = /;
const descriptionRegex = /const description = /;

type Util = {
    path: string;
    icon: string;
    name: string;
    description: string;
}

export const utilList = async () => {
    const utils: Util[] = [];
    readdirSync(`${dir}/component`).forEach((fileName) => {
        const path = fileName.replace(".svelte", "");
        let name: string = "";
        let description: string = "";

        readFileSync(`${dir}/component/${fileName}`, {encoding: 'utf8', flag: 'r'}).split(/\r?\n/).forEach((line: string) => {
            if (nameRegex.test(line)) name = clean(line, nameRegex);
            if (descriptionRegex.test(line)) description = clean(line, descriptionRegex);
        });
        utils.push({
            path: path,
            icon: `/${dir}/icon/${path}.png`,
            name: name,
            description: description
        });
    })
    return utils;
}

export const findUtilByPath = async (path: string) => {
    const componentUri = `${dir}/component/${path}.svelte`;
    if (!existsSync(componentUri)) return undefined;
    let name: string = "";
    let description: string = "";
    
    readFileSync(componentUri, {encoding: 'utf8', flag: 'r'}).split(/\r?\n/).forEach((line: string) => {
        if (nameRegex.test(line)) name = clean(line, nameRegex);
        if (descriptionRegex.test(line)) description = clean(line, descriptionRegex);
    });

    return {
        path: path,
        icon: `/${dir}/icon/${path}.png`,
        name: name,
        description: description
    };
}

const clean = (string: string, iconRegex: RegExp) => {
    string = string.split(iconRegex)[1];
    if (string.endsWith(";")) string = string.substring(0, string.length - 1);
    if (string.startsWith("'")) string = string.substring(1);
    if (string.endsWith("'")) string = string.substring(0, string.length - 1);
    return string.replaceAll("\"", "").replaceAll("`", "").replaceAll("\\'", "'");
} 