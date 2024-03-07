import type {PageLoad} from './$types'

export const load: PageLoad = (async ({fetch, params}) => {
    const response = await fetch(`/api/util?path=${params.util}`)
    const json = await response.json()
    return {
        status: json.status,
        util: json.content,
        path: params.util
    }
})
