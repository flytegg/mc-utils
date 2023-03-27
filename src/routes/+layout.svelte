<script>
    import "../app.css";
</script>

<div class="flex">
    <div class="bg-[#1D1F24] min-w-[20rem] min-h-screen">
        <!-- TODO: use /api/util-parser to retrieve list of all utils -->
    </div>
    <div class="flex flex-col justify-start items-center w-full">
        <slot/>
    </div>
</div>
