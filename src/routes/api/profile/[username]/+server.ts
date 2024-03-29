import {json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'

export const GET: RequestHandler = (async ({fetch, params}) => {

    const request = await fetch(`https://api.ashcon.app/mojang/v2/user/${params.username}`)
    const response = await request.json()

    if (response.code) {
        let message = "An unknown error occured."
        if (response.code == 404) message = `The profile '${params.username}' was not found.`
        return json({
            status: response.code,
            message: message
        })
    }

    const id = response.uuid.replaceAll("-", "")

    return json({
        uuid: response.uuid,
        id: id,
        username: response.username,
        skin: {
            png: {
                url: response.textures.skin.url,
                data: `data:image/png;base64,${response.textures.skin.data}`,
                base64: response.textures.skin.data
            },
            texture: {
                value: response.textures.raw.value,
                signature: response.textures.raw.signature
            },
            extra: {
                slim: response.textures.slim,
                custom: response.textures.custom
            }
        },
        renders: {
            avatar: `https://crafatar.com/avatars/${id}`,
            head: `https://crafatar.com/renders/head/${id}`,
            body: `https://crafatar.com/renders/body/${id}`,
            skin: `https://crafatar.com/skins/${id}`,
        }
    })
})
