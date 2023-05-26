import { writable } from "svelte/store"

type Util = {
    path: string
    icon: string
    name: string
    description: string
    shortDescription: string
}

export const UtilList = writable([] as Util[])
export const Favourites = writable([] as Util[])