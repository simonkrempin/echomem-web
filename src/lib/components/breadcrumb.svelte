<script lang="ts">
	import { goto } from "$app/navigation";
	import ChevronRightIcon from "$lib/icons/chevron-right.svelte";
	import HomeIconActive from "$lib/icons/home-active.svelte";
	import HomeIcon from "$lib/icons/home.svelte";
	import {
		type NavigationItem,
		navigationStore,
	} from "$lib/stores/navigation-store";
	import { onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";

	let homeHovered: boolean = false;

	let unsubscribeNavigationStore: Unsubscriber;
	let segments: NavigationItem[] = [];

	onMount(() => {
		const handlePopState = () => {
			navigationStore.pop();
		};

		unsubscribeNavigationStore = navigationStore.subscribe((value) => {
			segments = value;
		});

		window.addEventListener("popstate", handlePopState);

		return () => {
			unsubscribeNavigationStore();
			window.removeEventListener("popstate", handlePopState);
        };
	});
</script>

<div class="breadcrumb">
    <button
            id="home_button"
            on:mouseenter={() => homeHovered = true}
            on:mouseleave={() => homeHovered = false}
            on:click={() => {
                navigationStore.home();
                goto("/explorer");
            }}
    >
        {#if homeHovered}
            <HomeIconActive />
        {:else}
            <HomeIcon />
        {/if}
    </button>
    {#each segments as segment}
        <div class="segment">
            <ChevronRightIcon />
            <button
                class="navigate_button"
                on:click={() => {
                    navigationStore.navigateBackTo(segment.folderId);
                    goto(`/explorer/${segment.folderId}`);
                }}
            >
                {segment.name}
            </button>
        </div>
    {/each}
</div>

<style>
    .breadcrumb {
        display: flex;
        width: 100%;
        border-radius: 100px;
        background-color: #f5f5f5;
        padding: 8px;
        align-items: center;
    }

    #home_button {
        background-color: transparent;
        border: none;
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #home_button:hover {
        background-color: #e2e2e6;
        border-radius: 50%;
    }

    .segment {
        display: flex;
    }

    .navigate_button {
        background-color: transparent;
        border: none;
    }

    .navigate_button:hover {
        background-color: #e2e2e6;
        border-radius: 100px;
        cursor: pointer;
        transform: scale(1.02);
    }
</style>
