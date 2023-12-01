<script>
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import BackArrow from "$lib/icons/back-arrow.svelte";

    const onReturnClick = () => {
        Cookies.remove("store-type");
        goto("/");
    }
</script>

<button class="text-button" on:click={onReturnClick}>
    <BackArrow/>
    Zurück
</button>

<style>
    button {
        position: absolute;
        top: 24px;
        left: 24px;
        display: flex;
        align-items: center;
    }
</style>

<slot />