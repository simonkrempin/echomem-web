import {Directory} from "./directory";
import {goto} from "$app/navigation";
import Cookies from "js-cookie";
import type {Deck, DeckDTO} from "../../models/deck";
import type {Card, CardDTO} from "../../models/card";
import * as console from "console";

export class LocalDirectory extends Directory {
    private _database: IDBDatabase | null = null;
    private deckStore = "deckStore";
    private cardStore = "cardStore";

    async connectToDirectory(): Promise<void> {
        const openRequest = indexedDB.open("echomemDB", 1);

        openRequest.onerror = (event) => {
            console.error("Error", (event.target as IDBOpenDBRequest).error);
        }

        openRequest.onupgradeneeded = (event) => {
            this._database = (event.target as IDBOpenDBRequest).result;

            if (!this._database.objectStoreNames.contains(this.deckStore)) {
                this._database.createObjectStore(this.deckStore, {keyPath: "id"});
            }
        }

        openRequest.onsuccess = (event) => {
            this._database = (event.target as IDBOpenDBRequest).result;
        }

        Cookies.set("store-type", "local");
        await goto("/explorer");
    }

    disconnectDirectory(): Promise<void> {
        return Promise.resolve(undefined);
    }

    private async getDatabase(): Promise<IDBDatabase> {
        if (!this._database) {
            await this.connectToDirectory();
        }

        return this._database!;
    }

    public async getDecks(deckId: string): Promise<Deck[]> {
        const cachedData = this.cacheInstance.getDecks(deckId);
        if (cachedData) {
            return cachedData;
        }

        const db = await this.getDatabase();
        const transaction = db.transaction([this.deckStore], "readwrite");
        const store = transaction.objectStore(this.deckStore);
        const request = store.get(deckId);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            }

            request.onerror = () => {
                console.error("Error in retrieving data", request.error);
                reject();
            }
        });
    }

    public async getCards(deckId: string): Promise<Card[]> {
        const cachedData = this.cacheInstance.getCards(deckId);
        if (cachedData) {
            return cachedData;
        }

        const db = await this.getDatabase();
        const transaction = db.transaction([this.cardStore], "readwrite");
        const store = transaction.objectStore(this.cardStore);
        const request = store.get(deckId);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            }

            request.onerror = () => {
                console.error("Error in retrieving data", request.error);
                reject();
            }
        });
    }

    async createDeck(deckToCreate:DeckDTO): Promise<void> {
        const db = await this.getDatabase();
        const transaction = db.transaction([this.deckStore], "readwrite");
        const store = transaction.objectStore(this.deckStore);
        const request = store.add(deckToCreate);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                this.cacheInstance.addedDeck(deckToCreate.parentDeck!);
                resolve();
            }
            request.onerror = () => {
                console.error("Error in creating deck", request.error);
                reject();
            }
        });
    }

    async createCard(cardToCreate: CardDTO): Promise<void> {
        const db = await this.getDatabase();
        const transaction = db.transaction([this.cardStore], "readwrite");
        const store = transaction.objectStore(this.cardStore);
        const request = store.add(cardToCreate);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                this.cacheInstance.addedCard(cardToCreate.deckId!);
                resolve();
            }

            request.onerror = () => {
                console.error("Error in creating deck", request.error);
                throw new Error("weren't able to create card");
            }
        });
    }
}