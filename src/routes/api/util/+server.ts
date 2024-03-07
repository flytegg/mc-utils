import {utilList, findUtilByPath} from "$lib/utils"
import {json} from "@sveltejs/kit"
import type {RequestHandler} from "./$types"

export const GET: RequestHandler = (async ({url}) => {
    const path = url.searchParams.get("path")
    const query = url.searchParams.get("query")

    if (query && path) return json({
        status: 400,
        content: "Specify either path or query."
    })

    if (path) {
        const util = await findUtilByPath(path)
        if (!util) return json({
            status: 204,
            content: {
                path: ""
            }
        })

        return json({
            status: 200,
            content: util
        })
    }

    let utils = await utilList();

    if (query) return json({
        status: 200,
        content: utils.filter(util => util.name.toLowerCase().includes(query.toLowerCase()))
    })

    return json({
        status: 200,
        content: utils
    })
})
