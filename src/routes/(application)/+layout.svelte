<section>
    <h2>Echomem</h2>
    <button>Folder</button>
    <button>Learn</button>
    <button>Explore</button>
</section>

<main>
    <slot/>
</main>

<style>
    section {
        background-color: #f5f5f5;
        padding: 20px;
        width: 250px;
        height: calc(100% - 40px);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    button {
        padding: 16px 0;
        border-radius: 8px;
        border: none;
        text-align: left;
    }

    button:hover {
        background: #e0e0e0;
    }
</style>
