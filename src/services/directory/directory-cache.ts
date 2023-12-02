import type {Deck} from "../../models/deck";
import type {Card} from "../../models/card";

export class DirectoryCache {
    private _cardCache: Record<string, Card[]> = {}
    private _deckCache: Record<string, Deck[]> = {}

    public getDecks(deckId: string): Deck[] | undefined{
        return this._deckCache[deckId];
    }

    public getCards(deckId: string): Card[] {
        return this._cardCache[deckId];
    }

    public addedDeck(deckId: string): void {
        delete this._deckCache[deckId];
    }

    public addedCard(deckId: string): void {
        delete this._cardCache[deckId];
    }
}