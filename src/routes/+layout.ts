import type {LayoutLoad} from './$types'

export const load: LayoutLoad = (async ({fetch, data}) => {
    return {
        ...data,
        utils: (await (await fetch(`/api/util`)).json()).content
    }
})
