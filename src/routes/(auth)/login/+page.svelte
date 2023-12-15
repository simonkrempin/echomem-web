<script>
    import WithTitle from "$lib/components/with-title.svelte";
    import SeparatorWithText from "$lib/components/seperator-with-text.svelte";
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";

    const onLoginClicked = async () => {
        Cookies.set("session", "78234z5kluiahfhilahaufilhdil");
        requestAnimationFrame(() => goto("/explorer"));
    }
</script>

<main>
    <section>
        <h2>Anmelden</h2>
        <form>
            <div>
                <WithTitle title="E-Mail">
                    <input type="email">
                </WithTitle>
                <WithTitle title="Password">
                    <input type="password">
                </WithTitle>
            </div>
            <div>
                <button on:click={onLoginClicked}>Anmelden</button>
                <SeparatorWithText text="oder"/>
                <a href="/register">Registrieren</a>
            </div>
        </form>
        <div class="socials">
            <button class="social-button"></button>
            <button class="social-button"></button>
            <button class="social-button"></button>
        </div>
    </section>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 24px;
        height: 60%;
        min-height: 250px;
        max-height: 800px;
        width: 40%;
        max-width: 400px;
        min-width: 200px;
        align-items: center;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #c4c4c4;
        padding: 26px 24px;
        border-radius: 8px;
        height: calc(100% - 52px);
        width: calc(100% - 48px);
    }

    form > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    form > div > button {
        padding: 12px 16px;
    }

    .social-button {
        width: 60px;
        height: 60px;
    }

    button {
        border: none;
        border-radius: 8px;
        width: 100%;
        font-size: 16px;
    }

    .socials {
        width: 100%;
        display: flex;
        gap: 24px;
        justify-content: center;
    }

    a {
        text-decoration: none;
        color: black;
        font-size: 14px;
    }
</style>