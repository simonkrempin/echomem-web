<script lang="ts">
	import type { Card } from "$lib/models/card";
	import type { Deck } from "$lib/models/deck";
	import {
		cardCorrect,
		cardIncorrect,
		getAllDecks,
		getQuestionsToLearn,
	} from "$lib/services/directory";
	import { onMount } from "svelte";
	import TuneIcon from "$lib/icons/tune.svelte";
	import Button from "$lib/components/button.svelte";

	let showSolution = false;
	let currentQuestion: Card | undefined;
	let questionBacklog: Card[] = [];

	let selectedFilter: string | undefined = undefined;
	let selectFilter: boolean = false;
	let possibleFilters: Deck[] = [];

	onMount(() => {
		getAllDecks()
			.then(decks => possibleFilters = decks)
			.catch(() => {
				console.error("Error in getting all decks");
			});
	});

	$: {
		getQuestionsToLearn(selectedFilter)
			.then(questions => {
				questionBacklog = questions;
				currentQuestion = questionBacklog.length > 0 ? questionBacklog.shift() : undefined;
			})
			.catch(error => console.error(error));
	}

	function getNextQuestion() {
		// shift is a slow operation, maybe needs improvement in the future by reversing the array.
		const questionItem = questionBacklog.shift();

		// I wonder what will happen if the shift happens after this.
		if (questionBacklog.length <= 3) {
			getQuestionsToLearn(selectedFilter)
				.then(questions => questionBacklog.push(...questions))
				.catch(error => console.error("uncaught error, please fix", error));
		}

		return questionItem;
	}

	function onSolutionWrong() {
		showSolution = false;

		if (currentQuestion === undefined) {
			return;
		}

		void cardIncorrect(currentQuestion);
		currentQuestion = getNextQuestion();
	}

	function onSolutionCorrect() {
		showSolution = false;

		if (currentQuestion === undefined) {
			return;
		}

		void cardCorrect(currentQuestion);
		currentQuestion = getNextQuestion();
	}
</script>

<section>
    <div class="filter_container">
        <Button
            on:click={() => selectFilter = !selectFilter}
            icon={TuneIcon}
            text={"Filter"}
            type="secondary"
        />
        {#if selectFilter}
            <div class="filter_selection">
                {#each possibleFilters as filter}
                    <button
                            class="filter_selection_button"
                            on:click={() => {
                                selectedFilter = filter.id;
                                selectFilter = false;
                            }}
                    >
                        {filter.name}
                    </button>
                {:else}
                    <p>Keine Filter</p>
                {/each}
                {#if selectedFilter !== undefined}
                    <button
                            class="filter_selection_button"
                            on:click={() => {
                                selectedFilter = undefined;
                                selectFilter = false;
                            }}
                    >
                        Filter löschen
                    </button>
                {/if}
            </div>
        {/if}
    </div>
    {#if currentQuestion !== undefined}
        <button
                class="unknown_button"
                on:click={onSolutionWrong}
        >
            X
        </button>
        <div class="main_content">
            <div>
                <h3>{currentQuestion.front}</h3>
            </div>
            {#if showSolution}
                <div>
                    <p>{currentQuestion.back}</p>
                </div>
            {/if}
            <button on:click={() => showSolution = !showSolution}>
                {showSolution ? "Verstecke die Lösung" : "Zeige die Lösung an"}
            </button>
        </div>
        <button
                class="unknown_button"
                on:click={onSolutionCorrect}
        >
            C
        </button>
    {:else}
        <div>
            Heute sind alle Fragen gelöst!
        </div>
    {/if}
</section>

<style>
    section {
        flex: 1;
        width: 100%;
        display: flex;
        padding: 10% 5%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        background-color: white;
    }

    div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .main_content {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        background-color: #f5f5f5;
        margin: 0 5%;
        padding: 24px;
        flex-direction: column;
        justify-content: end;
    }

    button {
        width: fit-content;
        padding: 8px 20px;
        border-radius: 100px;
        border: none;
        background-color: #eee;
    }

    .unknown_button {
        background-color: #f5f5f5;
        height: 50px;
        width: 50px;
        border: none;
        border-radius: 50%;
        padding: 0;
    }

    button:hover {
        background-color: #b4b4b4;
        transform: scale(1.05);
    }

    .filter_container {
        position: absolute;
        top: 32px;
        right: 32px;
        display: flex;
        flex-direction: column;
        align-items: end;
    }

    .filter_selection {
        display: flex;
        background-color: #f5f5f5;
        border-radius: 12px;
        width: 150px;
        padding: 8px;
        flex-direction: column;
        gap: 8px;
    }

    .filter_selection_button {
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 8px;
        background-color: transparent;
    }
</style>
