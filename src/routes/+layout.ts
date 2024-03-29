import type {LayoutLoad} from './$types'

export const load: LayoutLoad = (async ({fetch}) => {
    return {
        utils: (await (await fetch(`/api/util`)).json()).content
    }
})
