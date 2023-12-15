export interface Deck {
    name: string;
    parentDeck: string;
    id: string
}

export interface DeckDTO {
    name?: string;
    parentDeck?: string;
    id?: string;
}