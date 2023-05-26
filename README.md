# MC Utils
Collection of helpful Minecraft utilities for players, builders and developers.

## ✨ The Mission
TODO

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

We've made it easy to add utils to the site by having a dynamic routing system for util components. Refer to [Example: Adding a new util](#example-adding-a-new-util) to understand how to use it.

#### Reusable elements

We also have a library of reusable elements that you can use in your utils to allow for a consistent style across the site.

Below are the elements we have with examples of how to use them:

```svelte
<Button text="My Button" click={() => console.log("You clicked the button")} /> 
<Search placeholder="Enter your query" search={(query) => doSomething(query)} />
```

### Using GitHub Projects & Issues

TODO

### Example: Adding a new util

Navigate to the `src/lib/component/util` folder, here you can see the `component` and `icon` folders - where you will respectively create your util and add an icon for it.

Naming matters here, in this example we are going to create a JSON Parser util, so we'll create a new file in `component` called `json-parser.svelte`. We can then add a `json-parser.png` to `icon` (so that it has an image in the sidebar navigation).

There are also some standard things that need to be put in our `json-parser.svelte`.

Firstly, we need to specify the name and description of the util.

We can do this by adding the following in a `<script>` tag like so:

```svelte
<script lang="ts">
    const name = "JSON Parser"
    const description = "Validate your JSON structure"
</script>
```

From here you just write your util in Svelte using HTML & JS/TS.
