<script lang="ts">
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";
    import ComputerIcon from "$lib/icons/computer.svelte";
    import GoogleDriveIcon from "$lib/icons/google-drive.svelte";
    import AccountIcon from "$lib/icons/account.svelte";
    import {directoryFactory} from "../services/directory/directory-factory";

    const selectDirectory = (dirType: string) => {
        const directory = directoryFactory(dirType);
        directory.connectToDirectory();
    }

    const ICON_SIZE = 50;
</script>


<main>
    Bevor du forfährst, musst du einen Ort zu speichern auswählen.
    <div class="button-container">
        <button on:click={() => selectDirectory("local")}>
            <ComputerIcon height={ICON_SIZE} width={ICON_SIZE}/>
            Lokal speichern
        </button>
        <button on:click={() => selectDirectory("google-drive")}>
            <GoogleDriveIcon height={ICON_SIZE} width={ICON_SIZE}/>
            Speichern in Google-Drive
        </button>
        <div class="best-offer">
            <button on:click={() => selectDirectory("account")}>
                <AccountIcon height={ICON_SIZE} width={ICON_SIZE}/>
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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