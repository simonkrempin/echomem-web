<script lang="ts">
    export let text: string;
</script>

<div>
    <hr>
    <p>{text}</p>
    <hr>
</div>

<style>
    div {
        width: 100%;
        display: flex;
        align-items: center;
    }

    hr {
        flex: 1;
        background-color: black;
        height: 2px;
        border: none;
    }

    p {
        margin: 0 8px;
    }
</style>