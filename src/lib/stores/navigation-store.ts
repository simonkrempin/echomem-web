import { writable } from "svelte/store";

interface NavigationItem {
	name: string;
	folderId: string;
}

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
				return value.splice(value.length - 1, 1);
			});
		},
		async navigateBackTo(folderId: string) {
			update((value) => {
				const index = value.findIndex((item) => item.folderId === folderId);

				if (index === -1) {
					return value;
				}

				return value.slice(0, index);
			});
		},
	}
}


export const navigationStore = createNavigationStore();