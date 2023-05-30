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

We've made it easy to add utils to the site by having a dynamic routing system for util components. Refer to [Adding a new util](#adding-a-new-util) to understand how to use it.

#### Reusable elements

We also have a library of reusable elements that you can use in your utils to allow for a consistent style across the site.

Currently we only have a Search component and a slightly different way of using buttons, see below for how to use each.

Search
```svelte
<Search placeholder="Enter your query" search={(query) => doSomething(query)} classes="specify override classes here" disabled={false} /> // You can use disabled to prevent use of the element
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

Next we can add the icon for our util to the `static/component/icon` folder and upload your icon, named the same as the `path`. Make sure it's a `.png`.

Finally, navigate to the `src/lib/component/util` folder, where you can create your util component, remember this needs to be named the same as `path`.

From here you just write your util in Svelte using HTML & JS/TS.

If you want to take a look, here's a link to an existing util, [Skin Stealer](https://github.com/flytegg/mcu-website/blob/master/src/lib/component/util/skin-stealer.svelte).

### Using GitHub Projects & Issues

TODO
