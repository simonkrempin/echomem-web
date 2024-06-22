<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import ExploreActive from "$lib/icons/explore-active.svelte";
	import Explore from "$lib/icons/explore.svelte";
	import FolderActive from "$lib/icons/folder-active.svelte";
	import Folder from "$lib/icons/folder.svelte";
	import LearnActive from "$lib/icons/learn-active.svelte";
	import Learn from "$lib/icons/learn.svelte";
	import LeftPanelClose from "$lib/icons/left_panel_close.svelte";
	import LeftPanelOpen from "$lib/icons/left_panel_open.svelte";

	const tabs = ["explorer", "learn", "school"];

	let selectedTab: number = tabs.indexOf($page.url.pathname.split("/")[1]);

	const onTabSelected = (tab: number) => {
		selectedTab = tab;
	};

	let isMinimized = false;
</script>

<main>
    <section
            class:section__collapsed={isMinimized}
    >
        <h2>{isMinimized ? "E" : "Echomem"}</h2>
        <button
                class="tab_button"
                class:minimize_button={isMinimized}
                class:minimized_button={isMinimized}
                on:click={() => {
                onTabSelected(0);
                goto("/explorer");
            }}
        >
            {#if selectedTab === 0}
                <FolderActive />
            {:else}
                <Folder />
            {/if}
            { isMinimized ? "" : "Folder"}
        </button>
        <button
                class="tab_button"
                class:minimize_button={isMinimized}
                class:minimized_button={isMinimized}
                on:click={() => {
                onTabSelected(1);
                goto("/learn");
            }}
        >
            {#if selectedTab === 1}
                <LearnActive />
            {:else}
                <Learn />
            {/if}
            { isMinimized ? "" : "Learn"}
        </button>
        <button
                class="tab_button"
                class:minimize_button={isMinimized}
                class:minimized_button={isMinimized}
                on:click={() => {
                onTabSelected(2);
                goto("/school");
            }}
        >
            {#if selectedTab === 2}
                <ExploreActive />
            {:else}
                <Explore />
            {/if}
            { isMinimized ? "" : "Explore"}
        </button>
        <div style="flex: 1;" />
        <button
                class="minimize_button"
                class:minimized_button={isMinimized}
                on:click={() => {isMinimized = !isMinimized;}}
        >
            {#if isMinimized}
                <LeftPanelOpen />
            {:else}
                Sidebar einklappen
                <LeftPanelClose />
            {/if}
        </button>
    </section>
    <slot />
</main>

<style>
    main {
        height: 100%;
        display: flex;
    }

    section {
        background-color: var(--background-color);
        padding: 12px;
        min-width: 250px;
        height: calc(100% - 24px);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .section__collapsed {
        align-items: center;
        min-width: 42px;
        max-width: 42px;
    }

    .tab_button {
        padding: 12px 16px;
        border-radius: 50px;
        border: none;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .tab_button:hover {
        background: #e0e0e0;
    }

    .minimize_button {
        width: 100%;
        background-color: transparent;
        border: none;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        height: 48px;
    }

    .minimized_button {
        width: 48px;
        border-radius: 8px;
        padding: 0;
    }

    .minimized_button:hover {
        background-color: #e0e0e0;
    }
</style>
