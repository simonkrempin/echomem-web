export interface Card {
    front: string;
    back: string;
    id: string;
    deckId: string;
}

export interface CardDTO {
    front?: string;
    back?: string;
    deckId?: string;
    id?: string;
}