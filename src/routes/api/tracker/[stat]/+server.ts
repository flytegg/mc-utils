import type {RequestHandler} from "./$types"
import {error, json} from "@sveltejs/kit";
// import {trackerCollection} from "$lib/tracker/mongo";

const allowedStats = ["server-jars-served", "start-files-served", "server-infos-served", "skins-searched", "skins-served", "capes-searched", "capes-served", "color-text-copied", "gradients-copied", "small-text-copied", "server-icons-served", "note-block-songs-served", "banners-served", "fireworks-served"]

export const POST: RequestHandler = (async ({params}) => {
    const stat = params.stat
    if (!allowedStats.includes(stat)) {
        throw error(400, "Invalid statistic")
    }

    // await trackerCollection.updateOne({}, {$inc: {[stat]: 1}})

    return json({
        status: 200,
    })
})
