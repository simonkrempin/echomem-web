import console from "console";
import Cookies from "js-cookie";
import type {Card, CardDTO} from "../models/card";
import type {Deck, DeckDTO} from "../models/deck";

enum Indexes {
    id = "id",
    parentDeck = "parentDeck",
    deckId = "deckId",
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
            const store = _database.createObjectStore(DECK_STORE, {keyPath: "id"});
            store.createIndex(Indexes.parentDeck, Indexes.parentDeck, { unique: false });
        }

        if (!_database.objectStoreNames.contains(CARD_STORE)) {
            const store = _database.createObjectStore(CARD_STORE, {keyPath: "id"});
            store.createIndex(Indexes.deckId, Indexes.deckId, { unique: false });
        }
    }

    _databasePromise = new Promise((resolve, reject) => {
        openRequest.onerror = (event) => {
            console.error("Error", (event.target as IDBOpenDBRequest).error);
            reject(false);
        }

        openRequest.onsuccess = (event) => {
            Cookies.set("store-type", "local");
            _database = (event.target as IDBOpenDBRequest).result;
            resolve(true);
        }
    });
}

export const getDatabase = async (): Promise<IDBDatabase> => {
    if (!_database) {
        if (!_databasePromise) {
            await connectToIDB();
        }
        await _databasePromise;
    }

    return _database!; // if this would be null, then an error would be thrown before
}

const queryDB = async (storeKey: string, storeIndex: string, queryValue: string): Promise<IDBRequest> => {
    const db = await getDatabase();
    const transaction = db.transaction([storeKey], "readonly");
    const store = transaction.objectStore(storeKey);
    const index = store.index(storeIndex);
    window.console.log(index);
    return index.getAll(queryValue);
}

export const getDecks = async (deckId: string): Promise<Deck[]> => {
    const cachedData = deckCache[deckId];
    if (cachedData) {
        return cachedData;
    }

    const request = await queryDB(DECK_STORE, Indexes.parentDeck, deckId)
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve((event.target! as IDBRequest).result);
        }

        request.onerror = () => {
            console.error("Error in retrieving data", request.error);
            reject();
        }
    });
}

export const getCards = async (deckId: string): Promise<Card[]> => {
    const cachedData = cardCache[deckId];
    if (cachedData) {
        return cachedData;
    }

    const request = await queryDB(CARD_STORE, Indexes.deckId, deckId);
    window.console.log(request);

    return await new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        }

        request.onerror = () => {
            console.error("Error in retrieving data", request.error);
            reject();
        }
    });
}

export const createDeck = async (deckToCreate: DeckDTO): Promise<void> => {
    const store = await getSaveStore(DECK_STORE);
    const request = store.add(deckToCreate);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            delete deckCache[deckToCreate.parentDeck!];
            resolve();
        }
        request.onerror = () => {
            console.log("Error in creating deck", request.error);
            reject();
        }
    });
}

async function getSaveStore(storeKey: string) {
    const db = await getDatabase();
    const transaction = db.transaction([storeKey], "readwrite");
    return transaction.objectStore(storeKey);
}

export const createCard = async (cardToCreate: CardDTO): Promise<void> => {
    const store = await getSaveStore(CARD_STORE);
    const request = store.add(cardToCreate);

    return new Promise((resolve) => {
        request.onsuccess = () => {
            delete cardCache[cardToCreate.deckId!];
            resolve();
        }

        request.onerror = () => {
            console.error("Error in creating deck", request.error);
            throw new Error("weren't able to create card");
        }
    });
}