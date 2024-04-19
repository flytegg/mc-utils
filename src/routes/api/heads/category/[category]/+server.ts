import {json} from '@sveltejs/kit'
import type {RequestHandler} from '../../$types'

export const GET: RequestHandler = (async ({fetch, params}) => {

    enum Category {
        BLOCKS = "blocks",
        CHARACTERS = "characters",
        CHRISTMAS = "christmas",
        ELECTRONICS = "electronics",
        FLAGS = "flags",
        FOOD = "food",
        HALLOWEEN = "halloween",
        LETTERS = "letters",
        YOUTUBERS = "youtubers"
    }

    type Head = {
        name: string,
        uuid: string,
        headUrl: string,
        category: string,
        command: string
    }

    let heads: Head[] = []

    if (params.category == "all") {
        for (const [key, category] of Object.entries(Category)) {
            const request = await fetch(`https://headdb.org/api/category/${category}`)
            const response = await request.json()

            if (response.code) {
                let message = "An unknown error occured."
                if (response.code == 404) message = `404 not found.`
                return json({
                    status: response.code,
                    message: message
                })
            }

            for (let key in response) {
                const head = response[key]
                const oldCommand = head.command

                const skullOwnerId = oldCommand.slice(oldCommand.indexOf('Id:"') + 4, oldCommand.indexOf('",Properties:{textures:'))
                const textureValue = oldCommand.slice(oldCommand.indexOf('Value:"') + 7, oldCommand.indexOf('"}]}}}'))

                const modernCommand = `/give @p minecraft:player_head{display:{Name:'{"text":"${head.name}"}',Lore:['{"text":"Skull from HeadDB.org"}']},SkullOwner:{Id:"${skullOwnerId}",Properties:{textures:[{Value:"${textureValue}"}]}}}`

                heads.push({
                    name: head.name,
                    uuid: head.uuid,
                    headUrl: head.valueDecoded.textures.SKIN.url,
                    category: category,
                    command: modernCommand
                });
            }
        }
    } else {
        const request = await fetch(`https://headdb.org/api/category/${params.category}`)
        const response = await request.json()

        if (response.code) {
            let message = "An unknown error occured."
            if (response.code == 404) message = `404 not found.`
            return json({
                status: response.code,
                message: message
            })
        }

        for (let key in response) {
            heads.push({
                name: response[key].name,
                uuid: response[key].uuid,
                headUrl: response[key].valueDecoded.textures.SKIN.url,
                category: params.category,
                command: response[key].command
            });
        }
    }

   return json({
        headers: {
            "cache-control": "public, max-age=7200"
        },
        heads
    })
})