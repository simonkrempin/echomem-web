<script lang="ts">
	import type { CardDTO } from "$lib/models/card";
	import WithTitle from "../components/with-title.svelte";
	import CloseIcon from "$lib/icons/close.svelte";
	import { cardStore } from "$lib/stores/card-store";
	import { generateRandomString } from "$lib/utils/generateRandomString";
	import { onMount } from "svelte";

	export let show: boolean;
	export let title: string = "Dialog";
	export let folderId: string;
	export let editMode: boolean = false;

	export let selectedCard: CardDTO | null = null;
	let cardFront: string = selectedCard?.front ?? "";
	let cardBack: string = selectedCard?.back ?? "";
	let cardId: string = selectedCard?.id ?? generateRandomString(8);

	let frontInputElement: HTMLInputElement;
	let frontInputElementFocused: boolean = false;
	let backInputElement: HTMLInputElement;
	let backInputElementFocused: boolean = false;

	onMount(() => {
		frontInputElement.focus();
	});

	const onCloseClicked = () => {
		cardFront = "";
		cardBack = "";
		editMode = false;
		selectedCard = null;
		show = false;
	};

	const onSaveClicked = () => {
		if (editMode) {
			cardStore.update({
				front: cardFront,
				back: cardBack,
				deckId: folderId,
				id: cardId,
			});
		}

		cardStore.add({
			front: cardFront,
			back: cardBack,
			deckId: folderId,
			id: cardId,
		});

		onCloseClicked();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "Escape":
				event.preventDefault();
				onCloseClicked();
				break;
			case "Enter":
				if (!(frontInputElementFocused || backInputElementFocused)) {
					return;
				}

				event.preventDefault();
				onSaveClicked();
				break;
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="backdrop">
    <div class="dialog">
        <header>
            <h3>{title}</h3>
            <button
                    class="icon-button"
                    on:click={onCloseClicked}
            >
                <CloseIcon />
            </button>
        </header>
        <div class="content">
            <WithTitle title="Vorderseite">
                <input
                        bind:value={cardFront}
                        bind:this={frontInputElement}
                        on:focus={() => frontInputElementFocused = true}
                        on:blur={() => frontInputElementFocused = false}
                />
            </WithTitle>
            <WithTitle title="Rückseite">
                <input
                        bind:value={cardBack}
                        bind:this={backInputElement}
                        on:focus={() => backInputElementFocused = true}
                        on:blur={() => backInputElementFocused = false}
                />
            </WithTitle>
        </div>
        <footer>
            <button
                    class="text-button"
                    on:click={onCloseClicked}
            >Abbrechen
            </button>
            <button
                    class="primary-button"
                    on:click={onSaveClicked}
            >Speichern
            </button>
        </footer>
    </div>
</div>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog {
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        gap: 24px;
        min-width: 400px;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    footer {
        display: flex;
        justify-content: end;
        gap: 8px;
    }
</style>
