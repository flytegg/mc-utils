import { writable } from "svelte/store"

type Util = {
    path: string
    icon: string
    name: string
    description: string
}

export const UtilList = writable([] as Util[])