<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let icon: any;
	export let hoveredIcon: any = icon;

	const dispatch = createEventDispatcher();

	let hovered: boolean = false;
</script>

<button
        on:click={() => dispatch("click")}
        on:mouseenter={() => hovered = true}
        on:mouseleave={() => hovered = false}
>
    {#if hovered}
        <svelte:component this={hoveredIcon} />
    {:else}
        <svelte:component this={icon} />
    {/if}
</button>

<style>
    button {
        border: none;
        height: 34px;
        width: 34px;
        background-color: transparent;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button:hover {
        background-color: #e2e2e6;
    }
</style>
