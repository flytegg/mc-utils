<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    const components = import.meta.glob(`/src/lib/util/component/*.svelte`);
    const component = components[`/src/lib/util/component/${data.util.path}.svelte`];
</script>

{#if data.status === 200}
    {#await component()}
        <!-- TODO: cool spinny loader thing -->
        <h1>Loading...</h1>
    {:then module}
        <!-- TODO: look cooler, some spacing maybe -->
        <h1 class="text-white font-bold">{data.util.name}</h1>
        <h2 class="text-[#3C414B]">{data.util.description}</h2>
        <!-- TODO: how the fuck do i type this shit -->
        <svelte:component this={module.default} />
    {/await}
{:else}
    <!-- TODO: proper error page with thing about suggesting new util and joining discord -->
    <h1>No util</h1>
{/if}