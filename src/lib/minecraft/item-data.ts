import { itemNameOutput, type ItemVersion } from './item-name';

type Entry = { key: string; value: Node };
type Node = { raw: string; start: number; end: number; entries?: Entry[]; string?: string };

// Keep original SNBT values intact: JSON.parse would lose typed numbers, arrays,
// and long integer precision. Only the name field is rewritten.
function parseSnbt(source: string): Node {
    if (source.length > 100_000) throw new Error('Item data must be under 100,000 characters.');
    let pos = 0;
    const whitespace = () => { while (/\s/.test(source[pos] ?? '') && pos < source.length) pos++; };
    const fail = (): never => { throw new Error(`Invalid item SNBT near character ${pos + 1}. Paste only the item data, without the chat message around it.`); };
    function quoted() {
        const quote = source[pos++];
        let result = '';
        while (pos < source.length) {
            const char = source[pos++];
            if (char === quote) return result;
            if (char === '\\') {
                const next = source[pos++];
                if (next === undefined) fail();
                result += next;
            } else result += char;
        }
        return fail();
    }
    function token() {
        const token = source.slice(pos).match(/^[A-Za-z0-9_.+\-]+/)?.[0];
        if (!token) return fail();
        pos += token.length;
        return token;
    }
    function node(depth: number): Node {
        if (depth > 64) throw new Error('Item data is nested too deeply.');
        whitespace();
        const start = pos;
        let entries: Entry[] | undefined;
        let string: string | undefined;
        if (source[pos] === '{') {
            pos++; whitespace(); entries = [];
            while (source[pos] !== '}') {
                const key = /['"]/.test(source[pos] ?? '') ? quoted() : token();
                if (entries.some(entry => entry.key === key)) throw new Error(`Duplicate field: ${key}. Remove the duplicate before continuing.`);
                whitespace(); if (source[pos++] !== ':') fail();
                entries.push({ key, value: node(depth + 1) }); whitespace();
                if (source[pos] === '}') break;
                if (source[pos++] !== ',') fail();
                whitespace();
            }
            pos++;
        } else if (source[pos] === '[') {
            pos++; whitespace();
            if (/^[BIL];/i.test(source.slice(pos, pos + 2))) { pos += 2; whitespace(); }
            while (source[pos] !== ']') {
                node(depth + 1); whitespace();
                if (source[pos] === ']') break;
                if (source[pos++] !== ',') fail();
                whitespace();
            }
            pos++;
        } else if (source[pos] === '"' || source[pos] === "'") string = quoted();
        else string = token();
        return { start, end: pos, raw: source.slice(start, pos), entries, string };
    }
    const result = node(0); whitespace();
    if (pos !== source.length || !result.entries) fail();
    return result;
}

function field(node: Node, key: string) { return node.entries?.find(entry => entry.key === key)?.value; }
function setField(node: Node, key: string, value: string): string {
    if (!node.entries) throw new Error(`${key} must be inside an SNBT compound.`);
    const existing = field(node, key);
    if (existing) return node.raw.slice(0, existing.start - node.start) + value + node.raw.slice(existing.end - node.start);
    const body = node.raw.slice(0, -1).trimEnd();
    return `${body}${node.entries.length && !body.endsWith(',') ? ',' : ''}${JSON.stringify(key)}:${value}}`;
}

/** Commands are pasted on one line; keep whitespace inside strings unchanged. */
function commandSnbt(value: string): string {
    let result = '';
    let quote = '';
    let escaped = false;
    for (const char of value) {
        if (quote) {
            result += char;
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === quote) quote = '';
        } else if (char === '"' || char === "'") {
            quote = char;
            result += char;
        } else if (!/\s/.test(char)) result += char;
    }
    return result;
}

export function renameItemData(source: string, input: string, version: ItemVersion, fallbackId: string) {
    const root = parseSnbt(source.trim());
    const id = field(root, 'id');
    const fullStack = !!id;
    if (id && id.string === undefined) throw new Error('The item id must be a string.');
    const itemId = id?.string ?? fallbackId;
    if (!/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(itemId)) throw new Error('Enter a valid item ID, such as minecraft:diamond_sword.');
    const legacy = version === 'legacy';
    if (fullStack) {
        const allowed = new Set(['id', 'Slot', legacy ? 'Count' : 'count', legacy ? 'tag' : 'components']);
        const unknown = root.entries!.find(entry => !allowed.has(entry.key));
        if (unknown) throw new Error(`Unexpected item field "${unknown.key}". Check that the selected version matches this data. No fields have been removed.`);
    }
    const containerKey = legacy ? 'tag' : 'components';
    let container = fullStack ? field(root, containerKey) ?? parseSnbt('{}') : root;
    if (!container.entries) throw new Error(`${containerKey} must be an SNBT compound.`);
    const output = itemNameOutput(input, version, itemId);
    let updated: string;
    if (legacy) {
        const display = field(container, 'display') ?? parseSnbt('{}');
        updated = setField(container, 'display', setField(display, 'Name', output.value));
    } else {
        for (const { key, value } of container.entries) {
            if (key.startsWith('!') && (!value.entries || value.entries.length)) throw new Error('Removed components must have an empty compound value.');
            if (!/^!?(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(key)) throw new Error('Invalid component key. Paste a components compound or a complete item stack.');
        }
        // Setting a name intentionally replaces a prior name-removal marker.
        if (container.entries.some(({ key }) => key === '!minecraft:custom_name' || key === '!custom_name')) {
            container = parseSnbt('{' + container.entries.filter(({ key }) => key !== '!minecraft:custom_name' && key !== '!custom_name').map(({ key, value }) => `${JSON.stringify(key)}:${value.raw}`).join(',') + '}');
        }
        // An unqualified key has the same meaning as minecraft:custom_name.
        if (field(container, 'custom_name') && field(container, 'minecraft:custom_name')) throw new Error('The item has two custom_name fields. Remove the duplicate before continuing.');
        updated = setField(container, field(container, 'custom_name') ? 'custom_name' : 'minecraft:custom_name', output.value);
    }
    const countNode = fullStack ? field(root, legacy ? 'Count' : 'count') : undefined;
    const count = countNode ? Number(countNode.raw.replace(/[bBsSlL]$/, '')) : 1;
    if (!Number.isInteger(count) || count < 1 || count > 99) throw new Error('Item count must be an integer between 1 and 99.');
    const suffix = legacy ? updated : `[${parseSnbt(updated).entries!.map(({ key, value }) => key.startsWith('!') ? key : `${key}=${value.raw}`).join(',')}]`;
    return {
        data: fullStack ? setField(root, containerKey, updated) : updated,
        command: `/give @s ${itemId}${commandSnbt(suffix)} ${count}`
    };
}
