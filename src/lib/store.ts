import {writable} from "svelte/store"

type Util = {
    path: string
    name: string
    description: string
    shortDescription: string
}

export const UtilList = writable([] as Util[])
export const Favourites = writable([] as Util[])
// Set while a full screen overlay (like the note block visualiser) covers the page, so the nav can be opened over it on desktop
export const NavOverlay = writable(false)
