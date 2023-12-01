<script>
    import WithTitle from "../../../components/with-title.svelte";
    import SeparatorWithText from "../../../components/seperator-with-text.svelte";
</script>

<main>
    <section>
        <form>
            <WithTitle title="E-Mail">
                <input>
            </WithTitle>
            <WithTitle title="Password">
                <input>
            </WithTitle>
            <button>Anmelden</button>
            <SeparatorWithText text="oder"/>
            <a href="/register">Registrieren</a>
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
        gap: 24px;
        background-color: #c4c4c4;
        padding: 52px 24px;
        border-radius: 8px;
        height: calc(100% - 52px);
        width: calc(100% - 48px);
        align-items: center;
    }

    form > button {
        padding: 8px 16px;
    }

    .social-button {
        width: 60px;
        height: 60px;
    }

    button {
        border: none;
        border-radius: 8px;
        width: 100%;
    }

    input {
        border: 1px solid #f5f5f5;
        border-radius: 8px;
        padding: 12px 4px;
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
    }
</style>