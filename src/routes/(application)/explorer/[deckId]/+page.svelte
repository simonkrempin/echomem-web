<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Breadcrumb from "$lib/components/breadcrumb.svelte";
	import AddCardDialog from "$lib/dialogs/add-card-dialog.svelte";
	import AddFolderDialog from "$lib/dialogs/add-folder-dialog.svelte";
	import AddIcon from "$lib/icons/add.svelte";
	import DownloadIcon from "$lib/icons/download.svelte";
	import FolderIcon from "$lib/icons/folder-active.svelte";
	import SettingsIcon from "$lib/icons/settings.svelte";
	import IconButton from "$lib/components/icon-button.svelte";
	import type { Card } from "$lib/models/card";
	import type { Deck } from "$lib/models/deck";
	import { cardStore } from "$lib/stores/card-store";
	import { deckStore } from "$lib/stores/deck-store";
	import { navigationStore } from "$lib/stores/navigation-store";
	import { getReadableDate } from "$lib/utils/valueFormatters";
	import Cookies from "js-cookie";
	import { onMount } from "svelte";
	import type { Unsubscriber } from "svelte/store";

	$: deckId = $page.params.deckId;

	let deckQuery: Promise<Deck[]>;
	let cardQuery: Promise<Card[]>;
	let unsubscribeDeckStore: Unsubscriber;
	let unsubscribeCardStore: Unsubscriber;
	let unsubscribeNavigationStore: Unsubscriber;

	let selectedCard: Card | null = null;
	let deckToEdit: Deck | undefined = undefined;
	let editDeck: boolean = false;

	$: {
		unsubscribeDeckStore = deckStore.subscribe(() => {
			deckQuery = deckStore.get(deckId);
		});
		unsubscribeCardStore = cardStore.subscribe(() => {
			cardQuery = cardStore.get(deckId);
		});
		unsubscribeNavigationStore = navigationStore.subscribe((value) => {
			deckToEdit = value.at(-1);
		});
    }

	onMount(() => {
		const shortCuts = (event: KeyboardEvent) => {
			if (
				!event.altKey
                || showAddCardDialog
                || showAddDeckDialog
            ) {
				return;
            }

			switch (event.key) {
                case "n":
					onAddDeckClicked();
					break;
                case "m":
					onAddCardClicked();
					break;
            }
        }

		window.addEventListener("keydown", shortCuts)

		return () => {
			unsubscribeDeckStore();
			unsubscribeCardStore();
			unsubscribeNavigationStore();
			window.removeEventListener("keydown", shortCuts);
        }
    });

	const onDeckClicked = (deck: Deck) => {
		navigationStore.add(deck);
		goto(`/explorer/${deck.id}`);
	};

	const onAccountClicked = () => {
		Cookies.remove("store-type");
		Cookies.remove("session");
		goto("/");
	};

	let showAddDeckDialog = false;
	const onAddDeckClicked = () => {
		showAddDeckDialog = true;
	};

	let showAddCardDialog = false;
	const onAddCardClicked = () => {
		showAddCardDialog = true;
	};

	const onSettingsClicked = () => {
        editDeck = true;
		showAddDeckDialog = true;
    }

	const onDownloadDeckClicked = () => {

	};

	const onRowItemClicked = (clickedRowItem: Card) => {
		selectedCard = clickedRowItem;
		showAddCardDialog = true;
	};
</script>

<section>
    <div class="account-bar">
        <Breadcrumb />
        {#if deckToEdit != null}
            <IconButton
                    icon={SettingsIcon}
                    on:click={onSettingsClicked}
            />
        {/if}
        <IconButton
                icon={DownloadIcon}
                on:click={onDownloadDeckClicked}
        />
        <button
                class="account-button"
                on:click={onAccountClicked}
        ></button>
    </div>
    <div class="content">
        <div id="decks">
            {#await deckQuery}
                Loading...
            {:then decks}
                {#each decks as deck (deck.id)}
                    <button
                        class="deck"
                        on:click={() => onDeckClicked(deck)}
                    >
                        <FolderIcon
                            height={60}
                            width={60}
                        />
                        {deck.name}
                    </button>
                {/each}
                <button
                    class="deck"
                    on:click={onAddDeckClicked}
                >
                    <AddIcon
                        height={60}
                        width={60}
                    />
                    Deck hinzufügen
                </button>
            {:catch error}
                Error on fetching data {error}
            {/await}
        </div>
        <div class="cut_scrollbar">
            <div class="cards">
                <table>
                    <thead>
                    <tr>
                        <th scope="col">Front</th>
                        <th scope="col">Back</th>
                        <th
                            scope="col"
                            id="next-repetition"
                        >Next Repetition
                        </th>
                    </tr>
                    </thead>
                    {#await cardQuery}
                        Loading...
                    {:then cards}
                        {#each cards as card (card.id)}
                            <tr
                                on:click={() => onRowItemClicked(card)}
                            >
                                <td>{card.front}</td>
                                <td>{card.back}</td>
                                <td>{getReadableDate(card.repetitionDate)}</td>
                            </tr>
                        {/each}
                    {:catch error}
                        Error on fetching data {error}
                    {/await}
                    <button
                        class="add-card-fab"
                        on:click={onAddCardClicked}
                    >
                        <AddIcon />
                    </button>
                </table>
            </div>
        </div>
    </div>
</section>

{ #if showAddDeckDialog }
    <AddFolderDialog
            bind:show={showAddDeckDialog}
            bind:editMode={editDeck}
            title="Deck hinzufügen"
            folderId={deckId}
            deck={deckToEdit}
    />
{/if}
{ #if showAddCardDialog }
    <AddCardDialog
            bind:show={showAddCardDialog}
            title={selectedCard ? "Karte bearbeiten" : "Karte hinzufügen"}
            folderId={deckId}
            editMode={selectedCard !== null}
            bind:selectedCard={selectedCard}
    />
{/if}

<style>
    section {
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
        background: var(--background-color);
        border-radius: 12px;
        width: 200px;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .cards {
        flex: 1;
        overflow-y: auto;
        background: var(--background-color);
        border-radius: 12px;
    }

    .cut_scrollbar {
        overflow: hidden;
        display: flex;
        flex: 1;
        border-radius: 12px;
    }

    table {
        width: 100%;
        flex: 1;
        position: relative;
        table-layout: fixed;
    }

    table > tr {
        height: 50px;
    }

    table > tr:hover {
        background-color: #f0f0f5;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
        transform: translateY(-2px);
        cursor: pointer;
    }

    td {
        padding-left: 10px;
    }

    #next-repetition {
        width: 150px
    }

    .account-bar {
        display: flex;
        justify-content: right;
        width: 100%;
        align-items: center;
        gap: 8px;
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
        position: fixed;
        right: 48px;
        bottom: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        border-radius: 12px;
        background-color: white;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 12px;
        gap: 12px;
    }
</style>
