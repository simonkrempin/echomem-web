<script>
    import "./global.css";
    import {connectToDirectory} from "../services/directory/directory";
    import {onMount} from "svelte";

    onMount(() => {
        connectToDirectory();
    })
</script>

<slot/>