# Item name color output

Browser captures from local Chrome on October 19, 2026. Red outlines mark the copied output. These show the web generator, not an in-game Minecraft session.

- `before.png`: master at e8b6063. The Name preview renders colors, but Copy puts the literal `&c&lDaemon's Blade` plugin codes on the clipboard.
- `after.png`: Java item command and name-only value, with the existing Name preview.
- `gradient.png`: gradient item output and the command-block guidance for commands longer than chat's 256-character limit.
- `mobile.png`: the same controls at 390px, with stacked version and item fields.

Validation:

- `bun test tests/item-name.test.ts`: 10 passing tests covering formatting resets, version syntax, quoting, Unicode, empty components, and invalid item IDs.
- Local Chrome: actual clipboard equals the displayed command and name value for all three versions. Invalid item IDs disable command copying. Both generators fit at 320px and 390px. Changing the gradient message updates the command immediately. No page errors.
- `bun run build`: passes. Existing Cloudflare adapter warning about route exclusion limits remains.
- `bun run check`: same 66 errors and 11 warnings in the same 14 files as master. No new diagnostics.

The reporters did not provide their Minecraft edition, version, server plugins, or item data. This fixes the reproduced vanilla-Java output mismatch; it does not establish the exact cause on their servers. Bedrock, anvil formatting, weapon textures, and automatically merging arbitrary item NBT are outside this change.
