import type { Deck } from "$lib/models/deck";
import { getDeckPath } from "$lib/services/directory";
import { writable } from "svelte/store";

function createNavigationStore() {
	const { subscribe, update } = writable<Deck[]>([]);

	return {
		subscribe,
		async add(deck: Deck) {
			update((value) => {
				return [...value, deck];
			});
		},
		async pop() {
			update((value) => {
				value.splice(value.length - 1, 1);
				return value;
			});
		},
		async navigateBackTo(deckId: string) {
			update((value) => {
				const index = value.findIndex((item) => item.id === deckId);

				if (index === -1) {
					return value;
				}

				return value.slice(0, index + 1);
			});
		},
		async home() {
			update(() => {
				return [];
			});
		},
		async loadPathFromUrl(url: string) {
			const folderId = /\/explorer\/([a-zA-Z0-9]+)/.exec(url)?.[1];

			if (folderId === undefined) {
				return;
			}

			const navigation = await getDeckPath(folderId);
			update(() => {
				return navigation;
			});
		},
		async updateLastEntry(deck: Deck): Promise<void> {
			update((value) => {
				return [...value.slice(0, value.length - 1), deck];
			});
		}
	};
}


export const navigationStore = createNavigationStore();
