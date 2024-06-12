<script lang="ts">
	import type { Card } from "$lib/models/card";
	import { getQuestionsToLearn } from "$lib/services/directory";
	import { onMount } from "svelte";

	let showSolution = false;
	let currentQuestion: Card | undefined;
	let questionBacklog: Card[] = [];

	onMount(() => {
		getQuestionsToLearn()
			.then(questions => {
				questionBacklog = questions;
				if (questionBacklog.length > 0) {
					currentQuestion = questionBacklog.shift();
				}
			})
			.catch(error => console.error(error));
	});

	function getNextQuestion() {
		// shift is a slow operation, maybe needs improvement in the future by reversing the array.
		const questionItem = questionBacklog.shift();

		// I wonder what will happen if the shift happens after this.
		if (questionBacklog.length === 3) {
			getQuestionsToLearn()
				.then(questions => questionBacklog.push(...questions))
				.catch(error => console.error("uncaught error, please fix", error));
		}

		return questionItem;
	}

	function onSolutionWrong() {
		showSolution = false;
		currentQuestion = getNextQuestion();
	}

	function onSolutionCorrect() {
		showSolution = false;
		currentQuestion = getNextQuestion();
	}
</script>

<section>
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
</style>
