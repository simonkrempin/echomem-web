<script lang="ts">
	import HomeIcon from "$lib/icons/home.svelte";
	import HomeIconActive from "$lib/icons/home-active.svelte";

    let homeHovered: boolean = false;
</script>

<div class="breadcrumb">
    <button
            id={"home_button"}
            on:mouseenter={() => homeHovered = true}
            on:mouseleave={() => homeHovered = false}
    >
        {#if homeHovered}
            <HomeIconActive />
        {:else}
            <HomeIcon />
        {/if}
    </button>
    {#each }
</div>

<style>
    .breadcrumb {
        display: flex;
        width: 100%;
        border-radius: 100px;
        background-color: #f5f5f5;
        padding: 8px;
    }

    #home_button {
        background-color: transparent;
        border: none;
        width: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #home_button:hover {
        background-color: #e2e2e6;
        border-radius: 50%;
    }
</style>
