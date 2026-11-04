export const COLORS: Record<string, string> = {
    '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
    '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
    '8': '#555555', '9': '#5555FF', a: '#55FF55', b: '#55FFFF',
    c: '#FF5555', d: '#FF55FF', e: '#FFFF55', f: '#FFFFFF'
};

const decorations = { k: 'obfuscated', l: 'bold', m: 'strikethrough', n: 'underlined', o: 'italic' } as const;
const plain = { bold: false, italic: false, underlined: false, strikethrough: false, obfuscated: false };
export type TextRun = typeof plain & { text: string; color: string };

/** Parse the generator's & codes. Unknown codes remain literal text. */
export function parseColoredText(input: string, baseColor = '#FFFFFF'): TextRun[] {
    const runs: TextRun[] = [];
    let style = { ...plain, color: baseColor };
    let buffer = '';
    const flush = () => {
        if (buffer) runs.push({ text: buffer, ...style });
        buffer = '';
    };
    for (let i = 0; i < input.length; i++) {
        if (input[i] === '&') {
            const hex = input.slice(i).match(/^&#([0-9a-f]{6})/i);
            const code = input.charAt(i + 1).toLowerCase();
            if (hex || COLORS[code] || code === 'r') {
                flush();
                style = { ...plain, color: hex ? `#${hex[1]}` : COLORS[code] ?? baseColor };
                i += hex ? 7 : 1;
                continue;
            }
            if (Object.prototype.hasOwnProperty.call(decorations, code)) {
                flush();
                style = { ...style, [decorations[code as keyof typeof decorations]]: true };
                i++;
                continue;
            }
        }
        buffer += input[i];
    }
    flush();
    return runs;
}

export type ItemVersion = 'legacy' | 'json-components' | 'snbt-components' | '26.3';

// JSON is also valid compound SNBT for these string and boolean fields.
export function itemNameComponent(input: string): string {
    const extra = parseColoredText(input).map(({ text, color, ...styles }) => ({
        text, color,
        ...Object.fromEntries(Object.entries(styles).filter(([, enabled]) => enabled))
    }));
    return JSON.stringify({ text: '', color: '#FFFFFF', italic: false, ...(extra.length ? { extra } : {}) });
}

/** Quote a JSON component as an SNBT string, escaping both nesting layers. */
export function quoteSnbt(value: string): string {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

export function itemNameOutput(input: string, version: ItemVersion, itemId: string) {
    const component = itemNameComponent(input);
    const value = version === 'snbt-components' || version === '26.3' ? component : quoteSnbt(component);
    const field = version === 'legacy' ? `Name:${value}` : `minecraft:custom_name=${value}`;
    const validItem = /^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(itemId);
    const suffix = version === 'legacy' ? `{display:{${field}}}` : `[${field}]`;
    return { value, field, command: validItem ? `/give @s ${itemId}${suffix} 1` : '' };
}

/** Inline item modifiers are supported from Java 1.20.5 onward. */
export function renameHeldItem(input: string, version: ItemVersion): string {
    if (version === 'legacy') {
        // Player NBT cannot be edited with /data. Edit a dropped item instead.
        return `/data modify entity @e[type=minecraft:item,sort=nearest,limit=1,distance=..3] Item.tag.display.Name set value ${quoteSnbt(itemNameComponent(input))}`;
    }
    return `/item modify entity @s weapon.mainhand ${JSON.stringify({
        [version === '26.3' ? 'type' : 'function']: 'minecraft:set_name',
        name: JSON.parse(itemNameComponent(input))
    })}`;
}
