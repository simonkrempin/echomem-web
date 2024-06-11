<script lang="ts">
	import { onMount } from "svelte";
	import WithTitle from "../components/with-title.svelte";
	import CloseIcon from "$lib/icons/close.svelte";
	import { generateRandomString } from "../utils/generateRandomString";
	import { deckStore } from "$lib/stores/deck-store";

	export let show: boolean;
	export let title: string = "Dialog";
	export let folderId: string;

	let folderName: string = "";

	let folderInput: HTMLInputElement;
	let folderInputFocused: boolean = false;

	const onCloseClicked = () => {
		folderName = "";
		show = false;
	};

	const onSaveClicked = () => {
		deckStore.add({
			name: folderName,
			parentDeck: folderId,
			id: generateRandomString(8),
		});
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
            <button
                class="icon-button"
                on:click={onCloseClicked}
            >
                <CloseIcon />
            </button>
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
