export const FONT_URL = "https://assets.mcasset.cloud/latest/assets/minecraft/font/include/default.json"

export type UnicodeGroup = {
    name: string
    chars: string[]
}

/** Formats a character as "U+XXXX". */
export function toCodePoint(char: string): string {
    return "U+" + char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")
}

// Control characters, whitespace and invisible/format characters can't be shown as a symbol
const INVISIBLE = /[\p{Cc}\p{Cf}\p{Z}]/u

function groupName(file: string): string {
    const base = file.split("/").pop()!.replace(/\.\w+$/, "")
    return base
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/** Fetches Minecraft's default font definition and returns the displayable characters, grouped by font sheet. */
export async function fetchMinecraftSymbols(): Promise<UnicodeGroup[]> {
    const response = await fetch(FONT_URL)
    if (!response.ok) throw new Error(`Failed to load font data (${response.status})`)

    // JSON.parse converts the "\uXXXX" escapes into the actual characters (surrogate pairs included)
    const providers = (await response.json()).providers as { type: string; file?: string; chars?: string[] }[]

    const seen = new Set<string>()
    const groups: UnicodeGroup[] = []

    for (const provider of providers) {
        if (provider.type !== "bitmap" || !provider.chars) continue

        const chars: string[] = []
        for (const char of provider.chars.join("")) {
            if (INVISIBLE.test(char) || seen.has(char)) continue
            seen.add(char)
            chars.push(char)
        }
        if (chars.length) groups.push({ name: groupName(provider.file ?? "Other"), chars })
    }

    return groups
}
