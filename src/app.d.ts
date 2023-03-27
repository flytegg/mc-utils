// See https://kit.svelte.dev/docs/types#app

import type { SvelteComponentTyped } from "svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			status: number;
			util: {
				path: string;
				icon: string;
				name: string;
				description: string;
			};
		}
		// interface Platform {}
	}
}

export {};
