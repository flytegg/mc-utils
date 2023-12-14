// See https://kit.svelte.dev/docs/types#app

import type { SvelteComponentTyped } from "svelte"
import type { Util } from "$lib/util.ts"

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {
		// 	status: number
		// 	utils: any
		// 	util: {
		// 		path: string
		// 		icon: string
		// 		name: string
		// 		description: string
		// 	}
		// }
		// interface LayoutData {
		// 	utils: Util[]
		// }
		// interface Platform {}
	}
}

export {}
