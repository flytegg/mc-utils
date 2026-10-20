# Item name color output

Local Chrome captures from October 19, 2026. Red outlines mark command output. These show the web generator, not an in-game client session.

- `before.png`: master at e8b6063. The Name preview renders colors, but Copy puts literal plugin codes on the clipboard.
- `after.png`: rename the existing held weapon, with Java 26.3 selected.
- `existing-data.png`: paste a sword's item data and generate a copy with its enchantments, damage, lore, and custom data preserved.
- `gradient.png`: rename an existing weapon with a gradient, including command-block instructions for long commands.
- `mobile.png`: held-weapon controls at 390px.

## Validation

- `bun test tests/item-name.test.ts tests/item-data.test.ts`: 22 passing tests. Covers version syntax, formatting resets, escaping, Unicode, data preservation, removed components, malformed input, and input bounds.
- Local Chrome: real clipboard matches displayed commands for all four version options. Held-item mode, modern and legacy pasted data, invalid-data copy prevention, gradient updates, and 320px/390px layouts pass. No page errors.
- `bun run build`: passes with the existing Cloudflare route-exclusion warning.
- `bun run check`: the same 66 errors and 11 warnings in 14 files as master. No new diagnostics.

## Minecraft game-code verification

The `java-26.2` and `java-26.3` folders contain Java verification sources, generated commands, modifier data, server download metadata, and successful output. These run Mojang's actual command parser, SNBT/loot codecs, and `SetNameFunction` against a real `ItemStack`. No server world or client is started.

Both versions accept the generated command syntax. The modifier changes the name to Emberblade, then the check removes that new name and compares the entire resulting stack to the original. Enchantments, damage, lore, custom data with a 64-bit serial, and count remain equal.

This caught the Java 26.3 loot-function discriminator change from `function` to `type`. The version selector generates the appropriate key. The new-item and imported-item commands are also parsed by each version.

To reproduce either version with Java 25:

1. Download its official server bundle from the URL in `server.json` and verify the SHA-1.
2. Extract the nested `.jar` files from the bundle's `META-INF/libraries` and `META-INF/versions` into a temporary directory.
3. Copy that version's `Verify.java`, `commands.txt`, and `modifier.snbt` into the temporary directory.
4. From that directory, run `javac -cp '*' Verify.java`, then `java -cp '*:.' Verify commands.txt modifier.snbt`.

Older versions have serializer and browser tests, not this game-code verification. Snapshots after 26.3 are not claimed as supported.

## Scope

Modern Java can rename the held item directly. Java 1.16 through 1.20.4 instead uses a name-only data edit on the nearest dropped item, with instructions to isolate that item. Player NBT is never edited directly.

Pasted input accepts a complete item stack or its tag/components compound in the selected version. The output retains supplied values, including numeric types and large integers, and changes only the name. It does not migrate between item formats. Unknown top-level fields are rejected rather than silently discarded. The generated `/give` creates a copy; the updated SNBT is also available separately.

The reporters' edition, version, plugins, and exact NBT remain unknown. This implements their existing-weapon and existing-data workflows for vanilla Java. It does not add Bedrock commands or recolor weapon textures.
