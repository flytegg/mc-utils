<script lang="ts">
  import { gzip } from 'pako';

  type Node = {
    type: 'prefix' | 'weight' | 'permission';
    key: string;
    value: boolean;
  };

  type Group = {
    name: string;
    prefix: string; // full key: e.g. "prefix.1.&7&lMEMBER&r "
    weight?: number; // required before export
    permissions: string[]; // e.g. ['essentials.fly']
  };

  // Required field
  let author = '';

  // Editable groups
  let groups: Group[] = [
    { name: 'default', prefix: 'prefix.1.&7&lMEMBER&r ', weight: undefined, permissions: [] }
  ];

  // Validation helpers
  $: authorError = author.trim().length === 0 ? 'Author is required' : '';
  function groupWeightError(g: Group): string | '' {
    return typeof g.weight === 'number' && Number.isFinite(g.weight) ? '' : 'Weight is required';
  }
  $: anyGroupMissingWeight = groups.some((g) => !groupWeightError(g) ? false : (g.name.trim().length > 0 || g.prefix.trim().length > 0 || g.permissions.length > 0));
  $: hasDefault = groups.some((g) => g.name.trim() === 'default');
  $: defaultGroup = groups.find((g) => g.name.trim() === 'default');
  $: defaultWeightError = defaultGroup ? groupWeightError(defaultGroup) : 'Default group is required';

  // Build payload
  function nowPretty(): string {
    try {
      return new Date().toLocaleString(undefined, { hour12: false, timeZoneName: 'short' });
    } catch {
      return new Date().toISOString();
    }
  }

  function buildJsonPayload(emptyBase = false) {
    const metadata = {
      generatedBy: author.trim(),
      generatedAt: nowPretty()
    };

    if (emptyBase) {
      return {
        metadata,
        groups: {},
        tracks: {},
        users: {}
      };
    }

    const groupsObj: Record<string, { nodes: Node[] }> = {};

    for (const g of groups) {
      const name = g.name.trim();
      if (!name) continue;

      // enforce weight
      if (!(typeof g.weight === 'number' && Number.isFinite(g.weight))) {
        continue; // skip invalid groups
      }

      const nodes: Node[] = [];
      if (g.prefix && g.prefix.trim()) {
        nodes.push({ type: 'prefix', key: g.prefix.trim(), value: true });
      }
      nodes.push({ type: 'weight', key: `weight.${g.weight}`, value: true });
      for (const perm of g.permissions) {
        const p = (perm || '').trim();
        if (!p) continue;
        nodes.push({ type: 'permission', key: p, value: true });
      }

      groupsObj[name] = { nodes };
    }

    return {
      metadata,
      groups: groupsObj,
      tracks: {},
      users: {}
    };
  }

  function downloadGz(filename: string, jsonObj: unknown) {
    const json = JSON.stringify(jsonObj, null, 2);
    const compressed = gzip(json);
    // Copy into a fresh Uint8Array to avoid SharedArrayBuffer typing issues
    const u8 = new Uint8Array(compressed.byteLength);
    u8.set(compressed);
    const blob = new Blob([u8], { type: 'application/gzip' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const canExportFilled = () => authorError === '' && !anyGroupMissingWeight && hasDefault && defaultWeightError === '';
  const canExportEmpty = () => authorError === '';

  function addGroup() {
    groups = [
      ...groups,
      { name: '', prefix: 'prefix.1.&7&lRANK&r ', weight: undefined, permissions: [] }
    ];
  }
  function removeGroup(idx: number) {
    const g = groups[idx];
    if (g && g.name.trim() === 'default') return; // cannot remove default
    groups = groups.filter((_, i) => i !== idx);
  }
  function addPermission(idx: number) { groups[idx].permissions = [...groups[idx].permissions, 'example.permission']; }
  function removePermission(gidx: number, pidx: number) { groups[gidx].permissions = groups[gidx].permissions.filter((_, i) => i !== pidx); }

  function exportFilled() { if (canExportFilled()) downloadGz('luckperms.json.gz', buildJsonPayload(false)); }
  function exportEmptyBase() { if (canExportEmpty()) downloadGz('luckperms-base.json.gz', buildJsonPayload(true)); }
</script>

<style>
  .card { border: 1px solid #333; border-radius: 8px; padding: 12px; margin: 8px 0; background: #111; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; }
  .col { display: flex; flex-direction: column; gap: 6px; }
  input { background: #1b1b1b; color: #e0e0e0; border: 1px solid #333; border-radius: 6px; padding: 8px; }
  label { font-size: 0.9rem; color: #bbb; }
  button { background: #2d6cdf; color: white; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; }
  button.secondary { background: #444; }
  button.danger { background: #d94a4a; }
  .muted { color: #8a8a8a; font-size: 0.9rem; }
  .error { color: #ff6b6b; font-size: 0.85rem; }
  .disabled { opacity: 0.6; cursor: not-allowed; }
</style>

<svelte:head>
  <title>LuckPerms Prefix/Groups Builder</title>
  <meta name="description" content="Create LuckPerms groups with prefix, weight, and permissions. Export as .json.gz" />
</svelte:head>

<div class="col" style="gap:12px">
  <div class="row" style="align-items:center; gap:12px; margin-top:8px">
    <img src="/component/icon/luck-perms.svg" alt="LuckPerms" style="height:32px" />
    <h1>LuckPerms Prefix/Groups Builder</h1>
  </div>

  <div class="row">
    <div class="col" style="flex:1; min-width:260px">
      <label for="author">Author (required)</label>
      <input id="author" bind:value={author} placeholder="Your name or team" />
      {#if authorError}<span class="error">{authorError}</span>{/if}
      <span class="muted">Will be set to <code>metadata.generatedBy</code>.</span>
    </div>
  </div>

  <div class="row" style="align-items:center; gap:12px; margin-top:8px">
    <button on:click={addGroup}>+ Add group</button>
    <button class="secondary {canExportEmpty() ? '' : 'disabled'}" on:click={exportEmptyBase} disabled={!canExportEmpty()}>Export empty base (.json.gz)</button>
    <button class="{canExportFilled() ? '' : 'disabled'}" on:click={exportFilled} disabled={!canExportFilled()}>Export with groups (.json.gz)</button>
  </div>

  {#each groups as g, i}
    <div class="card">
      <div class="row">
        <div class="col" style="flex:1; min-width:200px">
          <label for={`group-name-${i}`}>Group name</label>
          <input id={`group-name-${i}`} bind:value={g.name} placeholder="owner, admin, default, ..." disabled={g.name.trim()==='default'} readonly={g.name.trim()==='default'} />
        </div>
        <div class="col" style="flex:2; min-width:300px">
          <label for={`group-prefix-${i}`}>Prefix (full key)</label>
          <input id={`group-prefix-${i}`} bind:value={g.prefix} placeholder="prefix.1.&7&lMEMBER&r " />
          <span class="muted">Full syntax required: <code>prefix.&lt;priority&gt;.&lt;formatted text&gt;</code></span>
        </div>
        <div class="col" style="width:160px">
          <label for={`group-weight-${i}`}>Weight (required)</label>
          <input id={`group-weight-${i}`} type="number" bind:value={g.weight} placeholder="100" />
          {#if groupWeightError(g)}<span class="error">{groupWeightError(g)}</span>{/if}
        </div>
      </div>

      <div class="col" style="margin-top:8px">
        <h3 class="muted">Permissions</h3>
        {#each g.permissions as p, pidx}
          <div class="row" style="align-items:center">
            <input style="flex:1" aria-label="Permission" bind:value={g.permissions[pidx]} placeholder="e.g. essentials.fly" />
            <button class="danger" on:click={() => removePermission(i, pidx)}>Remove</button>
          </div>
        {/each}
        <div>
          <button class="secondary" on:click={() => addPermission(i)}>+ Add permission</button>
        </div>
      </div>

      {#if g.name.trim() !== 'default'}
        <div style="margin-top:8px">
          <button class="danger" on:click={() => removeGroup(i)}>Remove group</button>
        </div>
      {/if}
    </div>
  {/each}

  <div class="card">
    <h3>Export format (empty base preview)</h3>
    <pre class="muted" style="overflow:auto; max-height:240px">{JSON.stringify(buildJsonPayload(true), null, 2)}</pre>
    <span class="muted">The exported base has <code>groups</code> and <code>users</code> empty so you can fill it in the LuckPerms site.</span>
  </div>
</div>
