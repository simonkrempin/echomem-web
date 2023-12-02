import {Directory} from "./directory";
import {goto} from "$app/navigation";
import Cookies from "js-cookie";
import type { Card, CardDTO } from "../../models/card";
import type { Deck, DeckDTO } from "../../models/deck";

export class EchomemDirectory extends Directory {
    public disconnectDirectory(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public getDecks(deckId: string): Promise<Deck[]> {
        throw new Error("Method not implemented.");
    }
    public getCards(deckId: string): Promise<Card[]> {
        throw new Error("Method not implemented.");
    }
    public createDeck(deckToCreate: DeckDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public createCard(cardToCreate: CardDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async connectToDirectory() {
        Cookies.set("store-type", "account");
        await goto("/login");
    }

}