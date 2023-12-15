import { writable } from "svelte/store";
import {createCard, getCards} from "$lib/services/directory";
import type {CardDTO} from "$lib/models/card";

const createCardStore = () => {
    const { subscribe, update } = writable(false);

    return {
        subscribe,
        get: getCards,
        add: async (cardDTO: CardDTO) => {
            await createCard(cardDTO);
            update((value) => {
                return value = !value;
            });
        }
    }
}

export const cardStore = createCardStore();