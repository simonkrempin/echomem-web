<script>
    import "./global.css";
    import {connectToIDB} from "$lib/services/directory";
    import {onMount} from "svelte";

    onMount(() => {
        connectToIDB();
    })
</script>

<slot/>