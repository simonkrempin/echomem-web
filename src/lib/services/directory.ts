import { ROOT_FOLDER_ID } from "$lib";
import type { NavigationItem } from "$lib/types/navigation-types";
import console from "console";
import Cookies from "js-cookie";
import type {
	Card,
	CardDTO,
} from "../models/card";
import type {
	Deck,
	DeckDTO,
} from "../models/deck";

enum Indexes {
	id = "id",
	parentDeck = "parentDeck",
	deckId = "deckId",
	repetitionDate = "repetitionDate",
}

const DECK_STORE = "deckStore";
const CARD_STORE = "cardStore";

let _databasePromise: Promise<boolean> | null;
let _database: IDBDatabase | null;
const cardCache: Record<string, Card[]> = {};
const deckCache: Record<string, Deck[]> = {};


export const connectToIDB = async (): Promise<void> => {
	const openRequest = indexedDB.open("echomemDB", 1);

	openRequest.onupgradeneeded = (event) => {
		_database = (event.target as IDBOpenDBRequest).result;

		if (!_database.objectStoreNames.contains(DECK_STORE)) {
			const store = _database.createObjectStore(DECK_STORE, { keyPath: "id" });
			store.createIndex(Indexes.parentDeck, Indexes.parentDeck, { unique: false });
		}

		if (!_database.objectStoreNames.contains(CARD_STORE)) {
			const store = _database.createObjectStore(CARD_STORE, { keyPath: "id" });
			store.createIndex(Indexes.deckId, Indexes.deckId, { unique: false });
			store.createIndex(Indexes.repetitionDate, Indexes.repetitionDate, { unique: false });
		}
	};

	_databasePromise = new Promise((resolve, reject) => {
		openRequest.onerror = (event) => {
			console.error("Error", (event.target as IDBOpenDBRequest).error);
			reject(false);
		};

		openRequest.onsuccess = (event) => {
			Cookies.set("store-type", "local");
			_database = (event.target as IDBOpenDBRequest).result;
			resolve(true);
		};
	});
};

export const getDatabase = async (): Promise<IDBDatabase> => {
	if (!_database) {
		if (!_databasePromise) {
			await connectToIDB();
		}
		await _databasePromise;
	}

	return _database!; // if this would be null, then an error would be thrown before
};

const queryDB = async (storeKey: string, storeIndex: string, queryValue?: string, resultCount?: number): Promise<IDBRequest> => {
	const db = await getDatabase();
	const transaction = db.transaction([storeKey], "readonly");
	const store = transaction.objectStore(storeKey);
	if (store.keyPath === storeIndex) {
		return store.getAll(queryValue, resultCount);
	}
	const index = store.index(storeIndex);
	return index.getAll(queryValue, resultCount);
};

export const getDecks = async (deckId: string): Promise<Deck[]> => {
	const cachedData = deckCache[deckId];
	if (cachedData) {
		return cachedData;
	}

	const request = await queryDB(DECK_STORE, Indexes.parentDeck, deckId);
	return new Promise((resolve, reject) => {
		request.onsuccess = (event) => {
			resolve((event.target! as IDBRequest).result);
		};

		request.onerror = () => {
			console.error("Error in retrieving data", request.error);
			reject();
		};
	});
};

export const getDeck = async (deckId: string): Promise<Deck> => {
	const request = await queryDB(DECK_STORE, Indexes.id, deckId);

	return new Promise((resolve, reject) => {
		request.onsuccess = (event) => {
			resolve((event.target! as IDBRequest).result[0]);
		};

		request.onerror = () => {
			console.error("Error in retrieving data", request.error);
			reject();
		};
	});
};

export const getCards = async (deckId: string): Promise<Card[]> => {
	const cachedData = cardCache[deckId];
	if (cachedData) {
		return cachedData;
	}

	const request = await queryDB(CARD_STORE, Indexes.deckId, deckId);

	return await new Promise((resolve, reject) => {
		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			console.error("Error in retrieving data", request.error);
			reject();
		};
	});
};

export const createDeck = async (deckToCreate: DeckDTO): Promise<void> => {
	const store = await getSaveStore(DECK_STORE);
	const request = store.add(deckToCreate);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			delete deckCache[deckToCreate.parentDeck!];
			resolve();
		};
		request.onerror = () => {
			window.console.log("Error in creating deck", request.error);
			reject();
		};
	});
};

async function getSaveStore(storeKey: string) {
	const db = await getDatabase();
	const transaction = db.transaction([storeKey], "readwrite");
	return transaction.objectStore(storeKey);
}

export const createCard = async (cardToCreate: CardDTO): Promise<void> => {
	cardToCreate.repetitionDate = new Date().toISOString().split("T")[0];
	cardToCreate.lastRepetition = 0;

	const store = await getSaveStore(CARD_STORE);
	const request = store.add(cardToCreate);

	return new Promise((resolve) => {
		request.onsuccess = () => {
			delete cardCache[cardToCreate.deckId!];
			resolve();
		};

		request.onerror = () => {
			console.error("Error in creating deck", request.error);
			throw new Error("weren't able to create card");
		};
	});
};

export const updateCard = async (cardToUpdate: CardDTO): Promise<void> => {
	const store = await getSaveStore(CARD_STORE);
	const request = store.put(cardToUpdate);

	return new Promise((resolve) => {
		request.onsuccess = () => {
			delete cardCache[cardToUpdate.deckId!];
			resolve();
		};

		request.onerror = () => {
			console.error("Error in creating deck", request.error);
			throw new Error("weren't able to update card");
		};
	});
};

export const getFolderPath = async (folderId: string): Promise<NavigationItem[]> => {
	const result: NavigationItem[] = [];

	if (folderId === ROOT_FOLDER_ID) {
		return result;
	}

	let folder: Deck | undefined;

	do {
		folder = await getDeck(folderId);
		result.push({
			folderId: folder.id,
			name: folder.name,
		});
		folderId = folder.parentDeck;
	} while (folderId !== ROOT_FOLDER_ID);

	return result.reverse();
};

export const getQuestionsToLearn = async (): Promise<Card[]> => {
	const store = await getSaveStore(CARD_STORE);
	const index = store.index(Indexes.repetitionDate);

	const result: Card[] = [];
	let count = 0;

	const keyRange = IDBKeyRange.upperBound(new Date().toISOString().split("T")[0]);

	return new Promise((resolve, reject) => {
		const request = index.openCursor(keyRange);

		request.onsuccess = (event: any) => {
			const cursor = event.target!.result;

			if (cursor && count < 10) {
				result.push(cursor.value);
				count += 1;
				cursor.continue();
			} else {
				resolve(result);
			}
		};

		request.onerror = () => {
			console.error("Error in retrieving data", request.error);
			reject();
		};
	});
};

async function updateEntry(storeKey: string, storeIndex: string, newValue: unknown): Promise<void> {
	const db = await getDatabase();
	const transaction = db.transaction([storeKey], "readwrite");
	const store = transaction.objectStore(storeKey);
	const request = store.put(newValue);

	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			resolve();
		}

		request.onerror = () => {
			console.error("Error in updating data", request.error);
			reject();
		}
	})
}

export const cardCorrect = async (card: Card): Promise<void> => {
	card.lastRepetition += 1;

	window.console.log(card.lastRepetition);

	const newDate = new Date();
	newDate.setDate(newDate.getDate() + card.lastRepetition);
	card.repetitionDate = newDate.toISOString().split("T")[0];

	return updateEntry(CARD_STORE, Indexes.id, card);
}

export const cardIncorrect = async (card: Card): Promise<void> => {
	card.repetitionDate = new Date().toISOString().split("T")[0];
	card.lastRepetition = 0;
	return updateEntry(CARD_STORE, Indexes.id, card);
}
