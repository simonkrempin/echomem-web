<script lang="ts">
    import Folder from "$lib/icons/folder.svelte";
    import FolderActive from "$lib/icons/folder-active.svelte";
    import Learn from "$lib/icons/learn.svelte";
    import LearnActive from "$lib/icons/learn-active.svelte";
    import Explore from "$lib/icons/explore.svelte";
    import ExploreActive from "$lib/icons/explore-active.svelte";
    import {goto} from "$app/navigation";

    let selectedTab: number = 0;
    const onTabSelected = (tab: number) => {
        selectedTab = tab;
    }
</script>

<main>
    <section>
        <h2>Echomem</h2>
        <button on:click={() => {
            onTabSelected(0);
            goto("/explorer");
        }}>
            {#if selectedTab === 0}
                <FolderActive/>
            {:else}
                <Folder/>
            {/if}
            Folder
        </button>
        <button on:click={() => {
            onTabSelected(1);
            goto("/learn");
        }}>
            {#if selectedTab === 1}
                <LearnActive/>
            {:else}
                <Learn/>
            {/if}
            Learn
        </button>
        <button on:click={() => {
            onTabSelected(2);
            goto("/school");
        }}>
            {#if selectedTab === 2}
                <ExploreActive/>
            {:else}
                <Explore/>
            {/if}
            Explore
        </button>
    </section>
    <slot/>
</main>

<style>
    main {
        height: 100%;
        display: flex;
    }

    section {
        background-color: #f5f5f5;
        padding: 20px;
        min-width: 250px;
        height: calc(100% - 40px);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    button {
        padding: 12px 16px;
        border-radius: 50px;
        border: none;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    button:hover {
        background: #e0e0e0;
    }
</style>
