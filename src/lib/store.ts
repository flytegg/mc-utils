import {writable} from "svelte/store"

type Util = {
    path: string
    name: string
    description: string
    shortDescription: string
}

export const UtilList = writable([] as Util[])
export const Favourites = writable([] as Util[])
