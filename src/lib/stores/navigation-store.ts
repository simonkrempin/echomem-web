import { getFolderPath } from "$lib/services/directory";
import type { NavigationItem } from "$lib/types/navigation-types";
import { writable } from "svelte/store";

function createNavigationStore() {
	const { subscribe, update } = writable<NavigationItem[]>([]);

	return {
		subscribe,
		async add(folder: NavigationItem) {
			update((value) => {
				return [...value, folder];
			});
		},
		async pop() {
			update((value) => {
				value.splice(value.length - 1, 1);
				return value;
			});
		},
		async navigateBackTo(folderId: string) {
			update((value) => {
				const index = value.findIndex((item) => item.folderId === folderId);

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

			const navigation = await getFolderPath(folderId);
			update(() => {
				return navigation;
			});
		}
	};
}


export const navigationStore = createNavigationStore();
