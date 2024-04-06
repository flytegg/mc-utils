import {json} from '@sveltejs/kit'
import type {RequestHandler} from '../$types'

export const GET: RequestHandler = (async ({fetch, params}) => {

    const request = await fetch(`https://headdb.org/api/category/${params.category}`)
    const response = await request.json()

    type Head = {
        name: string,
        uuid: string,
        skinUrl: string,
        command: string
    }

    let heads: Head[] = []

    if (response.code) {
        let message = "An unknown error occured."
        if (response.code == 404) message = `Help.`
        return json({
            status: response.code,
            message: message
        })
    }

    for(var key in response) {
        heads.push({
            name: response[key].name,
            uuid: response[key].uuid,
            skinUrl: response[key].valueDecoded.textures.SKIN.url,
            command: response[key].command
        });
    }

    return json({
        heads
    })
})