<script lang="ts">
	import { goto } from "$app/navigation";
	import ChevronRightIcon from "$lib/icons/chevron-right.svelte";
	import HomeIconActive from "$lib/icons/home-active.svelte";
	import HomeIcon from "$lib/icons/home.svelte";
	import { navigationStore } from "$lib/stores/navigation-store";
	import type { NavigationItem } from "$lib/types/navigation-types";
	import { onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";
	import IconButton from "./icon-button.svelte";

	let unsubscribeNavigationStore: Unsubscriber;
	let segments: NavigationItem[] = [];

	onMount(() => {
		const handlePopState = () => {
			navigationStore.pop();
		};

		unsubscribeNavigationStore = navigationStore.subscribe((value) => {
			segments = value;
		});

		if (/\/explorer\/([a-zA-Z0-9]+)/.exec(window.location.pathname)?.[1] !== segments.at(-1)?.folderId) {
		    navigationStore.loadPathFromUrl(window.location.pathname);
        }

		window.addEventListener("popstate", handlePopState);

		return () => {
			unsubscribeNavigationStore();
			window.removeEventListener("popstate", handlePopState);
        };
	});
</script>

<div class="breadcrumb">
    <IconButton
        icon={HomeIcon}
        hoveredIcon={HomeIconActive}
        on:click={() => {
            navigationStore.home()
            goto("/explorer");
        }}
    />
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
