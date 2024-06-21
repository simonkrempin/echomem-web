<script lang="ts">
	export let icon: any = undefined;
	export let hoveredIcon: any = icon;
	export let text: string;
	export let type: "primary" | "secondary" | "text" = "secondary";

	let hovered: boolean = false;
</script>

<button
    class={type}
    on:click
    on:mouseenter={() => hovered = true}
    on:mouseleave={() => hovered = false}
>
    <svelte:component
        this={hovered ? hoveredIcon : icon}
    />
    {text}
</button>

<style>
    button {
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px 16px;
        gap: 6px;
        border-radius: 100px;
    }

    .primary {
        background-color: aquamarine;
    }

    .secondary {
        background-color: #e2e2e6;
    }

    .text {
        background-color: transparent;
    }

    button:hover {
        cursor: pointer;
    }

    button:hover.primary {
        background-color: #4daa8b;
    }

    button:hover.secondary {
        background-color: #bbbbc1;
    }

    button:hover.text{
        background-color: #e2e2e6;
    }
</style>
