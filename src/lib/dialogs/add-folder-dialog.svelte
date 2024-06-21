<script lang="ts">
	import type { Deck } from "$lib/models/deck";
	import { onMount } from "svelte";
	import WithTitle from "../components/with-title.svelte";
	import CloseIcon from "$lib/icons/close.svelte";
	import IconButton from "$lib/components/icon-button.svelte";
	import { generateRandomString } from "../utils/generateRandomString";
	import { deckStore } from "$lib/stores/deck-store";
	import { navigationStore } from "$lib/stores/navigation-store";
	import Button from "$lib/components/button.svelte";

	export let show: boolean;
	export let title: string = "Dialog";
	export let folderId: string;
	export let editMode: boolean;
	export let deck: Deck | undefined;

	let folderName: string = editMode && !!deck ? deck.name : "";

	let folderInput: HTMLInputElement;
	let folderInputFocused: boolean = false;

	const onCloseClicked = () => {
		folderName = "";
		show = false;
		editMode = false;
	};

	const onSaveClicked = () => {
		if (editMode && deck !== undefined) {
			const updatedDeck = {
				name: folderName,
				parentDeck: deck.parentDeck,
				id: deck.id,
			};

			deckStore.update(updatedDeck);
			navigationStore.updateLastEntry(updatedDeck);
        } else {
			deckStore.add({
				name: folderName,
				parentDeck: folderId,
				id: generateRandomString(8),
			});
        }

		onCloseClicked();
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (!show) {
			return;
		}

		switch (event.key) {
			case "Escape":
				event.preventDefault();
				onCloseClicked();
				break;
			case "Enter":
				if (!folderInputFocused) {
					return;
				}

				event.preventDefault();
				onSaveClicked();
				break;
		}
	};

	onMount(() => {
		folderInput.focus();
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="backdrop">
    <div class="dialog">
        <header>
            <h3>{title}</h3>
            <IconButton
                icon={CloseIcon}
                on:click={onCloseClicked}
            />
        </header>
        <div class="content">
            <WithTitle title="Ordner Name">
                <input
                        bind:value={folderName}
                        bind:this={folderInput}
                        on:focus={() => folderInputFocused = true}
                        on:blur={() => folderInputFocused = false}
                />
            </WithTitle>
        </div>
        <footer>
            <Button
                on:click={onCloseClicked}
                text={"Abbrechen"}
                type={"text"}
            />
            <Button
                on:click={onSaveClicked}
                text={"Speichern"}
                type={"primary"}
            />
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
