<script lang="ts">
    // import type {PageServerData} from './$types';
    import FolderIcon from '$lib/icons/folder-active.svelte';
    import DownloadIcon from "$lib/icons/download.svelte";
    import AddIcon from "$lib/icons/add.svelte";
    import AddFolderDialog from "$lib/dialogs/add-folder-dialog.svelte";
    import AddCardDialog from "$lib/dialogs/add-card-dialog.svelte";
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";
    import {deckStore} from "$lib/stores/deck-store";
    import {cardStore} from "$lib/stores/card-store";
    import {onDestroy} from "svelte";
    import type {Deck} from "$lib/models/deck";
    import type {Unsubscriber} from "svelte/store";
    import type {Card} from "$lib/models/card";

    // export let data: PageServerData;

    $: deckId = $page.params.deckId;

    let deckQuery: Promise<Deck[]>;
    let cardQuery: Promise<Card[]>;
    let unsubscribeDeckStore: Unsubscriber;
    let unsubscribeCardStore: Unsubscriber;

    $: {
        unsubscribeDeckStore = deckStore.subscribe(value => {
            deckQuery = deckStore.get(deckId);
        });
        unsubscribeCardStore = cardStore.subscribe(() => {
            cardQuery = cardStore.get(deckId)
        })
    }

    onDestroy(() => {
        if (unsubscribeDeckStore) {
            unsubscribeDeckStore();
        }
        if (unsubscribeCardStore) {
            unsubscribeCardStore();
        }
    });

    const onDeckClicked = (deckId: string) => {
        goto(`/explorer/${ deckId }`)
    }

    const onAccountClicked = () => {
        Cookies.remove("store-type");
        Cookies.remove("session");
        goto("/");
    }

    let showAddDeckDialog = false;
    const onAddDeckClicked = () => {
        showAddDeckDialog = true;
    }

    let showAddCardDialog = false;
    const onAddCardClicked = () => {
        showAddCardDialog = true;
    }

    const onDownloadDeckClicked = () => {

    }
</script>

<section>
    <div class="account-bar">
        <button class="icon-button" on:click={onDownloadDeckClicked}>
            <DownloadIcon/>
        </button>
        <button class="account-button" on:click={onAccountClicked}></button>
    </div>

    <div id="decks">
        {#await deckQuery}
            Loading...
        {:then decks}
            {#each decks as deck (deck.id)}
                <button class="deck" on:click={() => onDeckClicked(deck.id)}>
                    <FolderIcon height={60} width={60}/>
                    {deck.name}
                </button>
            {/each}
            <button class="deck" on:click={onAddDeckClicked}>
                <AddIcon height={60} width={60}/>
                Deck hinzufügen
            </button>
        {:catch error}
            Error on fetching data
        {/await}

    </div>

    <div id="cards">
        <div class="list-header">
            <button class="list-header-item">Front</button>
            <button class="list-header-item">Back</button>
            <button class="list-header-item">Next Repetition</button>
        </div>
        <hr/>
        {#await cardQuery}
            Loading...
        {:then cards}
            {#each cards as card (card.id)}
                <div class="list-item">
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                    <p>Datum</p>
                </div>
            {/each}
        {:catch error}
            Error on fetching data
        {/await}

        <button class="add-card-fab" on:click={onAddCardClicked}>
            <AddIcon />
        </button>
    </div>
</section>

<AddFolderDialog bind:show={showAddDeckDialog} title="Deck hinzufügen" folderId={deckId}/>
<AddCardDialog bind:show={showAddCardDialog} title="Karte hinzufügen" folderId={deckId} />

<style>
    section {
        padding: 0 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
    }

    #decks {
        display: flex;
        flex-direction: row;
        gap: 12px;
        min-height: 200px;
    }

    .deck {
        border: none;
        background: #f5f5f5;
        border-radius: 16px;
        width: 200px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #cards {
        background: #f5f5f5;
        border-radius: 16px;
        width: 100%;
        flex: 1;
        position: relative;
    }

    .list-item {
        display: flex;
        padding: 0 8px;
    }

    .list-item > p {
        flex: 1;
    }

    hr {
        margin: 0;
    }

    .list-header {
        display: flex;
        width: calc(100% - 16px);
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

    .account-bar {
        display: flex;
        justify-content: right;
        width: 100%;
    }

    .account-button {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
    }

    .add-card-fab {
        border: none;
        border-radius: 12px;
        background-color: aquamarine;
        height: 52px;
        width: 52px;
        position: absolute;
        right: 16px;
        bottom: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
