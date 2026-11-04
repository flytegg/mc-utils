import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { itemNameComponent, itemNameOutput, parseColoredText, quoteSnbt } from '../src/lib/minecraft/item-name';

// Decode the surrounding SNBT string independently of the encoder.
function readSnbtString(value: string) {
    assert.equal(value[0], "'");
    assert.equal(value.at(-1), "'");
    return value.slice(1, -1).replace(/\\([\\'])/g, '$1');
}

describe('item name formatting', () => {
    it('converts legacy colors and resets decorations on colors and reset codes', () => {
        const runs = parseColoredText('&c&lFire &9Ice&r Sword');
        assert.deepEqual(runs.map(({ text, color, bold }) => ({ text, color, bold })), [
            { text: 'Fire ', color: '#FF5555', bold: true },
            { text: 'Ice', color: '#5555FF', bold: false },
            { text: ' Sword', color: '#FFFFFF', bold: false }
        ]);
    });
    it('supports hex, uppercase codes, all decorations, and preview base colors', () => {
        const [run, reset] = parseColoredText('&#12abEF&K&L&M&N&OX&rY', '#000000');
        assert.deepEqual(run, { text: 'X', color: '#12abEF', bold: true, italic: true, underlined: true, strikethrough: true, obfuscated: true });
        assert.equal(reset.color, '#000000');
        assert.equal(reset.obfuscated, false);
    });
    it('preserves unknown codes, Unicode, quotes, backslashes, and newlines', () => {
        const name = `Daemon's "Blade" \\ 👨‍👩‍👧‍👦 é\n&z &#oops <tag>`;
        const component = JSON.parse(itemNameComponent(name));
        assert.equal(component.extra[0].text, name);
        assert.equal(component.italic, false);
        for (const version of ['legacy', 'json-components'] as const) {
            const { value } = itemNameOutput(name, version, 'diamond_sword');
            assert.deepEqual(JSON.parse(readSnbtString(value)), component);
        }
    });
    it('does not make reset text inherit the preceding sibling decorations', () => {
        const component = JSON.parse(itemNameComponent('&lBold&rPlain'));
        assert.equal(component.text, '');
        assert.equal(component.extra[0].bold, true);
        assert.equal(component.extra[1].bold, undefined);
        assert.equal(component.extra[1].color, '#FFFFFF');
        assert.equal(component.italic, false);
    });
    it('emits an empty component without an invalid empty extra list', () => {
        assert.deepEqual(JSON.parse(itemNameComponent('&c')), { text: '', color: '#FFFFFF', italic: false });
    });
});

describe('versioned item commands', () => {
    const json = '{"text":"","color":"#FFFFFF","italic":false,"extra":[{"text":"Blade","color":"#FF5555"}]}';
    it('uses display.Name before 1.20.5', () => {
        assert.equal(itemNameOutput('&cBlade', 'legacy', 'diamond_sword').command,
            `/give @s diamond_sword{display:{Name:'${json}'}} 1`);
    });
    it('uses a JSON string component in 1.20.5 through 1.21.4', () => {
        assert.equal(itemNameOutput('&cBlade', 'json-components', 'diamond_sword').command,
            `/give @s diamond_sword[minecraft:custom_name='${json}'] 1`);
    });
    it('uses a structured SNBT component in 1.21.5+', () => {
        const result = itemNameOutput('&cBlade', 'snbt-components', 'minecraft:diamond_sword');
        assert.equal(result.command, `/give @s minecraft:diamond_sword[minecraft:custom_name=${json}] 1`);
        assert.equal(result.value, json);
    });
    it('rejects item IDs that could break out of the command', () => {
        for (const id of ['', 'Diamond_Sword', 'minecraft:', 'stone 64', 'stone[foo=1]', 'stone\n/give @a diamond']) {
            assert.equal(itemNameOutput('Blade', 'legacy', id).command, '');
        }
        assert.ok(itemNameOutput('Blade', 'legacy', 'custom:weapons/blade').command);
    });
    it('round trips consecutive backslashes and apostrophes through SNBT', () => {
        const value = JSON.stringify({ text: "\\\\'\"\n" });
        assert.equal(readSnbtString(quoteSnbt(value)), value);
    });
});
