<script>
    import {toast} from "@zerodevx/svelte-toast";

    function onFileSelected(e) {
        let imageFile = e.target.files[0];
        let reader = new FileReader();
        reader.onload = e => {
            let image = new Image();
            image.src = e.target.result;

            image.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 64;
                canvas.height = 64;
                ctx.drawImage(image, 0, 0, 64, 64);
                resizedImage = canvas.toDataURL('image/png'); // Use 'image/png' to preserve transparency

                // Set the src attribute of the <img> element to the resized image data URL
                document.getElementById('resizedImage').src = resizedImage;
            };
        };
        reader.readAsDataURL(imageFile);
    }

    function downloadToast() {
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })
    }

    let fileInput, resizedImage
</script>

<main class="w-[90%] lg:w-[60%] mt-5 flex-col flex justify-center items-center">

    <h3 class="font-medium text-white text-20px text-left mb-2.5">
        Upload an image
    </h3>
    <input type="file" accept=".jpg, .jpeg, .png" class="button w-[300px] md:w-[500px]" on:change={(e)=>onFileSelected(e)}
           bind:this={fileInput}>

    <h3 class="font-medium text-white text-[20px] text-center mt-12">Preview</h3>
    <p class="text-gray-400 text-lg mb-3 text-center">Resized to 64x64 and renamed to server-icon.png.</p>

    <div class="self-center relative w-[650px] transition-transform transform scale-[55%] sm:scale-[80%] md:scale-[100%] lg:scale-[100%] xl:scale-100">
        <img src="/display/dirt.svg" alt="dirt" class="w-[100%]">
        <div class="text-left mr-auto mc-server-content overflow-y-hidden">
            <p class="minecraft-server text-white">{"Minecraft Server"}</p>
        </div>
        <div class="text-left mr-auto players-content overflow-y-hidden">
            <p class="players text-white">0/0</p>
        </div>
        <div class="mr-auto text-start motd-content overflow-y-hidden">
            <p class="motd-text text-start text-[#AAAAAA]"><br>A Minecraft Server</p>
        </div>
        <img src={resizedImage ? resizedImage : '/display/packpng.svg'} alt="Server Favicon" class="favicon-content h-24">
    </div>

    <div class="flex gap-6 mt-8">
        <a href={resizedImage} download="server-icon.png" on:click={downloadToast} class="button">Download</a>
    </div>

</main>

<style>
    .motd-content {
        position: absolute;
        top: 4px;
        left: 128px;
        right: 30px;
        bottom: 10px;
        display: flex;
    }

    .motd-text {
        margin-top: 13px;
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: left;
        max-height: calc(100% - 20px);
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .minecraft-server {
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .mc-server-content {
        position: absolute;
        top: 15px;
        left: 130px;
        right: 0px;
        bottom: 10px;
        display: flex;
    }

    .players {
        font-family: 'Minecraft', monospace;
        font-size: 22px;
        line-height: 1.3;
        text-align: right;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .players-content {
        position: absolute;
        top: 15px;
        left: auto;
        right: 14px;
        text-align: right;
        bottom: 0px;
        display: flex;
    }

    .favicon-content {
        position: absolute;
        top: 11px;
        left: 17px;
        right: 33px;
        bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

