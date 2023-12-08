<script lang="ts">
    import type {PageServerData} from './$types';
    import FolderIcon from '$lib/icons/folder-active.svelte';
    import DownloadIcon from "$lib/icons/download.svelte";
    import AddFolderDialog from "../../../../dialogs/add-folder-dialog.svelte";
    import AddIcon from "$lib/icons/add.svelte";
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import type {Card} from "../../../../models/card";
    import type {Deck} from "../../../../models/deck";
    import {getCards, getDecks} from "../../../../services/directory/directory";

    export let data: PageServerData;

    const cookie: string | undefined = Cookies.get("store-type");

    $: deckQuery = new Promise((resolve, reject) => {
        if (cookie === "local") {
            getDecks(data.deckName)
                .then(result => resolve(result))
                .catch(error => reject(error));
        } else {
            resolve(data.decks);
        }
    }) as Promise<Deck[]>;
    $: cardQuery = new Promise((resolve, reject) => {
        if (cookie === "local") {
            getCards(data.deckName)
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        } else {
            resolve(data.cards);
        }
    }) as Promise<Card[]>;

    // const fetchData = (slug: string) => {
    //     cardQuery =
    //     deckQuery
    // }

    const onDeckClicked = (deckId: string) => {
        goto(`/explorer/${deckId}`)
    }

    const onAccountClicked = () => {
        Cookies.remove("store-type");
        Cookies.remove("session");
        goto("/");
    }

    let showAddDeckDialog = false;
    const onDeckAddClicked = () => {
        showAddDeckDialog = true;
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
            <button class="deck" on:click={onDeckAddClicked}>
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
                </div>
            {/each}
        {:catch error}
            Error on fetching data
        {/await}
    </div>
</section>

<AddFolderDialog bind:show={showAddDeckDialog} title="Deck hinzufügen" folderId={data.deckName}/>

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
</style>
