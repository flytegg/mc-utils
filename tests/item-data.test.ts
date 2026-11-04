import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renameItemData } from '../src/lib/minecraft/item-data';
import { renameHeldItem } from '../src/lib/minecraft/item-name';

describe('rename existing weapons', () => {
    it('uses an inline name-only modifier for modern held items', () => {
        for (const version of ['json-components', 'snbt-components'] as const) {
            const command = renameHeldItem('&c&lEmberblade', version);
            assert.ok(command.startsWith('/item modify entity @s weapon.mainhand '));
            const modifier = JSON.parse(command.slice(command.indexOf('{')));
            assert.deepEqual(Object.keys(modifier).sort(), ['function', 'name']);
            assert.equal(modifier.function, 'minecraft:set_name');
            assert.equal(modifier.name.extra[0].text, 'Emberblade');
            assert.equal(modifier.name.extra[0].bold, true);
        }
    });
    it('targets only the nearest dropped item name in old versions, never player NBT', () => {
        const command = renameHeldItem('&cBlade', 'legacy');
        assert.ok(command.startsWith('/data modify entity @e[type=minecraft:item,sort=nearest,limit=1,distance=..3] Item.tag.display.Name set value '));
    });
});

describe('existing item data', () => {
    it('preserves legacy enchantments, lore, typed arrays, longs, damage, and count byte-for-byte', () => {
        const data = `{id:"minecraft:diamond_sword",Count:2b,tag:{Damage:17,Enchantments:[{id:"minecraft:sharpness",lvl:5s}],display:{Name:'"Old"',Lore:['"Keep me"']},UUID:[I;1,-2,3,4],serial:9223372036854775807L}}`;
        const result = renameItemData(data, '&cBlade', 'legacy', 'stone');
        const before = data.split("Name:'\"Old\"'");
        assert.ok(result.data.startsWith(before[0] + 'Name:'));
        assert.ok(result.data.endsWith(before[1]));
        assert.ok(result.command.startsWith('/give @s minecraft:diamond_sword{Damage:17,Enchantments:'));
        assert.ok(result.command.endsWith(' 2'));
        assert.ok(result.data.includes('serial:9223372036854775807L'));
    });
    it('preserves modern components and uses the item ID and count from the data', () => {
        const data = '{id:"minecraft:netherite_sword",count:1,components:{"minecraft:damage":17,"minecraft:enchantments":{"minecraft:sharpness":5},"minecraft:custom_data":{serial:9223372036854775807L},"minecraft:custom_name":{text:"Old"},"minecraft:lore":[{text:"Keep me"}]}}';
        const result = renameItemData(data, '&cBlade', 'snbt-components', 'stone');
        assert.ok(result.command.startsWith('/give @s minecraft:netherite_sword[minecraft:damage=17,minecraft:enchantments={"minecraft:sharpness":5}'));
        assert.ok(result.command.includes('minecraft:custom_data={serial:9223372036854775807L}'));
        assert.ok(result.command.includes('minecraft:lore=[{text:"Keep me"}]'));
        assert.ok(!result.data.includes('Old'));
        assert.ok(result.data.includes('"minecraft:custom_name":{"text":""'));
    });
    it('inserts missing compounds and handles tag-only and component-only data', () => {
        assert.ok(renameItemData('{id:"stone",Count:1b}', 'Rock', 'legacy', '').data.includes('"tag":{"display":{"Name":'));
        assert.ok(renameItemData('{Damage:8}', 'Blade', 'legacy', 'diamond_sword').command.includes('diamond_sword{Damage:8,"display":'));
        assert.ok(renameItemData('{"minecraft:damage":8}', 'Blade', 'snbt-components', 'diamond_sword').command.includes('diamond_sword[minecraft:damage=8,minecraft:custom_name='));
        assert.ok(renameItemData('{id:"stone",count:1}', 'Rock', 'snbt-components', '').data.includes('"components":{"minecraft:custom_name":'));
    });
    it('replaces the unqualified name alias instead of adding a second name component', () => {
        const result = renameItemData('{custom_name:{text:"Old"},damage:2}', 'New', 'snbt-components', 'stone');
        assert.ok(result.command.includes('[custom_name='));
        assert.ok(!result.command.includes('minecraft:custom_name='));
    });
    it('handles quoted JSON names in the 1.20.5 through 1.21.4 format', () => {
        const result = renameItemData(`{id:"diamond_sword",count:1,components:{"minecraft:custom_name":'"Old"',"minecraft:damage":2}}`, "Daemon's Blade", 'json-components', 'stone');
        assert.ok(result.command.includes("minecraft:custom_name='{"));
        assert.ok(result.command.includes("Daemon\\'s Blade"));
        assert.ok(result.command.includes('minecraft:damage=2'));
    });
    it('preserves delimiters inside strings and whitespace in untouched data', () => {
        const data = `{ Damage : 8 , display : { Lore : ['braces } ], comma, and \\'quote'] } }`;
        const result = renameItemData(data, 'New', 'legacy', 'stone');
        assert.ok(result.data.includes("Lore : ['braces } ], comma, and \\'quote']"));
        assert.ok(result.data.startsWith('{ Damage : 8 , display : '));
    });
    it('rejects invalid, duplicate, mismatched, or unsupported full-stack fields without producing lossy output', () => {
        for (const data of ['{', '{} trailing', '{a:}', '{a:1,a:2}', '{id:"stone",tag:{}}', '{id:"stone",count:0}', '{id:"stone",count:100}', '{id:"stone",unexpected:4}', '{custom_name:{},"minecraft:custom_name":{}}', '{"bad key":1}']) {
            assert.throws(() => renameItemData(data, 'Name', 'snbt-components', 'stone'), Error, data);
        }
        assert.throws(() => renameItemData('{display:3}', 'Name', 'legacy', 'stone'));
        assert.throws(() => renameItemData('{}', 'Name', 'legacy', 'stone 64'));
    });
    it('bounds input size and nesting', () => {
        assert.throws(() => renameItemData('{x:"' + 'a'.repeat(100_000) + '"}', 'Name', 'legacy', 'stone'));
        assert.throws(() => renameItemData('{a:'.repeat(70) + '1' + '}'.repeat(70), 'Name', 'legacy', 'stone'));
    });
});

it('uses the new modifier discriminator in Java 26.3', () => {
    const command = renameHeldItem('&cBlade', '26.3');
    const modifier = JSON.parse(command.slice(command.indexOf('{')));
    assert.equal(modifier.type, 'minecraft:set_name');
    assert.equal(modifier.function, undefined);
    assert.ok(renameHeldItem('&cBlade', 'snbt-components').includes('"function":"minecraft:set_name"'));
    assert.ok(renameItemData('{"minecraft:damage":3}', 'Blade', '26.3', 'diamond_sword').command.includes('minecraft:custom_name={'));
});

it('keeps removed components removed, while replacing a removed name', () => {
    const result = renameItemData('{"!minecraft:lore":{},"!minecraft:custom_name":{},"minecraft:damage":2}', 'Blade', '26.3', 'diamond_sword');
    assert.ok(result.command.includes('[!minecraft:lore,minecraft:damage=2,minecraft:custom_name='));
    assert.ok(result.data.includes('"!minecraft:lore":{}'));
    assert.ok(!result.data.includes('!minecraft:custom_name'));
    assert.throws(() => renameItemData('{id:{wrong:1}}', 'Blade', '26.3', 'diamond_sword'));
});

it('copies formatted SNBT as one command line without changing quoted text', () => {
    const source = `{\n  id: "diamond_sword",\n  Count: 1b,\n  tag: { display: { Lore: ['"Won in battle"'] }, Damage: 2 }\n}`;
    const result = renameItemData(source, 'Ember Blade', 'legacy', 'stone');
    assert.ok(!result.command.includes('\n'));
    assert.ok(result.command.includes('Won in battle'));
    assert.ok(result.command.includes('Ember Blade'));
    assert.ok(result.data.includes('\n  Count: 1b,'));
});
