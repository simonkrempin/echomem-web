<script lang="ts">
    import WithTitle from "../components/with-title.svelte";
    import CloseIcon from "$lib/icons/close.svelte";
    import {cardStore} from "$lib/stores/card-store";
    import {generateRandomString} from "$lib/utils/generateRandomString";

    export let show: boolean;
    export let title: string = "Dialog";
    export let folderId: string;

    let cardFront: string = "";
    let cardBack: string = "";

    const onCloseClicked = () => {
        cardFront = "";
        cardBack = "";
        show = false;
    };

    const onSaveClicked = () => {
        cardStore.add({
            front: cardFront,
            back: cardBack,
            deckId: folderId,
            id: generateRandomString(8),
        })
        onCloseClicked();
    }

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
                event.preventDefault();
                onSaveClicked();
                break;
        }
    }
</script>

<svelte:window on:keydown={onKeyDown}/>

{#if show}
    <div class="backdrop">
        <div class="dialog">
            <header>
                <h3>{title}</h3>
                <button class="icon-button" on:click={onCloseClicked}>
                    <CloseIcon/>
                </button>
            </header>
            <div class="content">
                <WithTitle title="Vorderseite">
                    <input bind:value={cardFront}/>
                </WithTitle>
                <WithTitle title="Rückseite">
                    <input bind:value={cardBack}/>
                </WithTitle>
            </div>
            <footer>
                <button class="text-button" on:click={onCloseClicked}>Abbrechen</button>
                <button class="primary-button" on:click={onSaveClicked}>Speichern</button>
            </footer>
        </div>
    </div>
{/if}

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
