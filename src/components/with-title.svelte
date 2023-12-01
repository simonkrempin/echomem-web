<script lang="ts">
    export let title: string;
</script>

<div>
    {title}
    <slot></slot>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>