import {writable} from "svelte/store";
import type {Deck, DeckDTO} from "$lib/models/deck";
import {createDeck, getDecks} from "$lib/services/directory";


function createDeckStore() {
    const { subscribe, update } = writable(false);

    return {
        subscribe,
        async get(deckId: string): Promise<Deck[]> {
            return await getDecks(deckId);
        },
        async add(deckDTO: DeckDTO) {
            await createDeck(deckDTO);
            update((value) => {
                return value = !value;
            });
        },
    };
}

export const deckStore = createDeckStore();