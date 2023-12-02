import type {Deck, DeckDTO} from "../../models/deck";
import type {Card, CardDTO} from "../../models/card";
import {DirectoryCache} from "./directory-cache";

export abstract class Directory {
    protected cacheInstance: DirectoryCache = new DirectoryCache();
    public abstract connectToDirectory(): Promise<void>;
    public abstract disconnectDirectory(): Promise<void>;
    public abstract getDecks(deckId: string): Promise<Deck[]>;
    public abstract getCards(deckId: string): Promise<Card[]>;
    public abstract createDeck(deckToCreate: DeckDTO): Promise<void>;
    public abstract createCard(cardToCreate: CardDTO): Promise<void>;
}