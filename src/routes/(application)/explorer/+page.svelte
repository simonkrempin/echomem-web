<script lang="ts">
    import type {PageServerData} from './$types';
    import FolderActive from '$lib/icons/folder-active.svelte';

    export let data: PageServerData;

    const onDeckClicked = (deckId: string) => {
        console.log(deckId);
    }
</script>

<section>
    {#if data?.decks}
        <div id="decks">
            {#each data.decks as deck (deck.id)}
                <button class="deck" on:click={() => onDeckClicked(deck.id)}>
                    <FolderActive/>
                    {deck.name}
                </button>
            {/each}
        </div>
    {/if}
    {#if data?.cards}
        <div id="cards">
            <div class="list-header">
                <button class="list-header-item">Front</button>
                <button class="list-header-item">Back</button>
                <button class="list-header-item">Next Repetition</button>
            </div>
            <hr/>
            {#each data.cards as card (card.id)}
                <div class="list-item">
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                </div>
            {/each}
        </div>
    {/if}
</section>

<style>
    section {
        padding: 0 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }

    .deck {
        border: none;
        background: #f5f5f5;
        border-radius: 16px;
        width: 240px;
        height: 240px;
    }

    #cards {
        background: #f5f5f5;
        border-radius: 16px;
        width: 100%;
        flex: 1;
    }

    .list-item {
        display: flex;
    }

    hr {
        margin: 0;
    }

    .list-header {
        display: flex;
        width: 100%;
        gap: 20px;
        padding: 8px;
    }

    .list-header-item {
        border: none;
        background-color: transparent;
        padding: 8px 32px;
        flex: 1;
        text-align: left;
        transition: all 0.2s ease-in-out;
        border-radius: 100px;
    }

    .list-header-item:hover {
        background-color: #c4c4c4;
    }
</style>