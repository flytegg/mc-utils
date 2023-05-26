<script lang="ts">
    export let text = ""
    export let click: () => void
</script>

<button on:click={click} class="text-xl font-medium border-[2px] rounded-xl py-2 px-4 border-[#626875] text-[#626875] transition duration-100 hover:bg-[#3C414B] hover:border-[#3C414B] hover:text-[#1A1B1E]">
    {text}
</button>

