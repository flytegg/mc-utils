import type {LayoutLoad} from './$types'

export const load: LayoutLoad = (async ({fetch}) => {
    const response = await fetch(`/api/util`)
    const json = await response.json()
    return {
        utils: json.content
    }
})
