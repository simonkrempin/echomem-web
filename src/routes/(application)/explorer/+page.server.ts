import type {PageServerLoad} from './$types';

interface Deck {
    id: string;
    name: string;
}

interface Card {
    id: string;
    front: string;
    back: string;
}

export const load: PageServerLoad = async () => {
    const data: { decks: Deck[], cards: Card[] } = {
        decks: [{
            id: "lasdfaufahudfliasdfhl",
            name: "Deck 1",
        }],
        cards: [{
            id: "slöadfjklöasdjf",
            front: "this is the front",
            back: "this is the back"
        }]
    };

    return data;
};