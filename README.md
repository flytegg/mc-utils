# MC Utils
[MC Utils](https://mcutils.com) is a collection of Minecraft utilities built for developers, builders and players. The site hosts some popular tools like Server Jars, Item IDs, Inventory Slots, Start File Generator and more, all with a slick interface for ease of use.

The project is powered by the team at [Flyte](https://flyte.gg/) and our generous contributors.

If you want to support, or chat with the team, come join our Discord:

[![Discord Banner](https://discordapp.com/api/guilds/835561528299880518/widget.png?style=banner2)](https://discord.gg/flyte)


## 📝 Contributing

### Prerequisites

You need to have Node 16 or higher installed.

If you're using VS Code, it will help to install the following extensions:
- Svelte for VS Code
- Svelte Intellisense
- Svelte Auto Import
- Tailwind CSS IntelliSense

### Setup

Clone the GitHub repository onto your machine and open a command line inside the project.

Run `npm install`.

And you're all set!

### Technologies

We use [SvelteKit](https://kit.svelte.dev/) and [Tailwind](https://tailwindcss.com/).

This entails some knowledge of:
- JavaScript/TypeScript
- Node/NPM
- SvelteKit's structure
- Svelte (very simple logic syntax on top of HTML/JS)
- Some CSS knowledge and the ability to type in Tailwind's search bar

### Our component system

#### Util components

We've made it easy to add utils to the site by having a dynamic routing system for util components. Refer to [Adding a new util](#adding-a-new-util) to understand how to use it.

#### Reusable elements

We also have a library of reusable elements that you can use in your utils to allow for a consistent style across the site.

Currently we only have a Search component and a slightly different way of using buttons, see below for how to use each.

Search
```svelte
<script>
    let searchValue: string

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") updateSkin(searchValue)
    }

    const handleInput = () => {
        updateSkin(searchValue)
    }
</script>
<input class="search" bind:value={searchValue} type="text" placeholder="Enter someone's username" on:keypress={handleKeyPress} on:blur={handleInput}>
```

Button
```svelte
<button class="button">My Button</button>
```

### Adding a new util

Firstly we should declare our util, we do this by navigating to `src/lib/utils.ts`.

In here is an array called `utils`, all you have to do is add your util to the list. Below is the schema with a description of each element:

```
path: The path in the URL, also needs to be the same name as the .svelte component we're about to create.
name: The name of the util... pretty self explanatory.
description: The description of the util... pretty self explantory.
shortDescription: ... A shorter version of the description - the one shown in the sidebar.
```

Next we can add the icon for our util to the `static/component/icon` folder and upload your icon, named the same as the `path`. Make sure it's a `.svg`.

Finally, navigate to the `src/lib/component/util` folder, where you can create your util component, remember this needs to be named the same as `path`.

From here you just write your util in Svelte using HTML & JS/TS.

If you want to take a look, here's a link to an existing util, [Skin Stealer](https://github.com/flytegg/mc-utils/blob/master/src/lib/component/util/skin-stealer.svelte).


## 🖥️ API

MC Utils does a lot of heavy lifting in the backend to power the [Server Jars](https://mcutils.com/server-jars) util. As a service to the community, we are happy to expose endpoints making this technology accessable in your own projects.

The following endpoints can be used to retrieve information about or serve jars from a range of server platforms and versions. Note that where a version may have multiple builds, we will always serve the latest build.

### Retrieve platforms supported by MC Utils
`GET` <https://mcutils.com/api/server-jars>

#### Example Response
```json
[
  {
    "key": "purpur",
    "name": "Purpur",
    "url": "https://mcutils.com/api/server-jars/purpur"
  },
  {
    "key": "paper",
    "name": "Paper",
    "url": "https://mcutils.com/api/server-jars/paper"
  }
]
```

### Retrieve all versions for platform
`GET` <https://mcutils.com/api/server-jars/:platform>

#### Example Response
```json
[
  {
    "version": "1.20.4",
    "url": "https://mcutils.com/api/server-jars/paper/1.20.4"
  },
  {
    "version": "1.20.2",
    "url": "https://mcutils.com/api/server-jars/paper/1.20.2"
  }
]
```

### Retrieve details about a version for a platform
`GET` <https://mcutils.com/api/server-jars/:platform/:version>

#### Example Response
```json
{
  "platform": "paper",
  "display": "Paper",
  "version": "1.20.4",
  "release": "March 25th 2024",
  "downloadUrl": "https://mcutils.com/api/server-jars/paper/1.20.4/download"
}
```

### Download jar for platform & version
`GET` <https://mcutils.com/api/server-jars/:platform/:version/download>
