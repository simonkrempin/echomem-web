<script lang="ts">
    const selectDirectory = (dirType: string) => {
        console.log(dirType);
    }
</script>


<main>
    Bevor du forfährst, musst du einen Ort zu speichern auswählen.
    <div class="button-container">
        <button on:click={() => selectDirectory("local")}>
            <div>ICON</div>
            Lokal speichern
        </button>
        <button on:click={() => selectDirectory("google-drive")}>
            <div>ICON</div>
            Speichern in Google-Drive
        </button>
        <div class="best-offer">
            <button on:click={() => selectDirectory("account")}>
                <div>ICON</div>
                Echomem Account
            </button>
            Meisten Vorteile
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .button-container {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 24px;
    }

    button {
        width: 250px;
        height: 250px;
        border: none;
        border-radius: 16px;
        transition: all 0.2s ease-in-out;
    }

    button:hover {
        background-color: #b4b4b4;
    }

    .best-offer {
        padding: 8px;
        background-color: black;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        color: white;
        align-items: center;
        margin-top: -8px;
    }

    .best-offer > button {
        margin-bottom: 8px;
    }
</style>