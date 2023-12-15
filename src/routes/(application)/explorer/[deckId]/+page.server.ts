import type {PageServerLoad} from './$types';
import type {Deck} from "$lib/models/deck";
import type {Card} from "$lib/models/card";

interface ReturnData {
    deckName: string;
    cards: Card[];
    decks: Deck[];
}

export const load: PageServerLoad = async ({cookies, url}): Promise<ReturnData> => {
    const storeType = cookies.get("store-type");
    const deckName = url.pathname.split("/").at(-1)!;

    switch (storeType) {
        case "account":
            return {
                deckName,
                decks: [{
                    id: "lasdfaufahudfliasdfhl",
                    name: "Deck 1",
                    parentDeck: "asfsdfasfasdf"
                }],
                cards: [{
                    id: "slöadfjklöasdjf",
                    front: "this is the front",
                    back: "this is the back",
                    deckId: "adsfsdfadfasf"
                }]
            }
        default:
            return {
                deckName,
                cards: [],
                decks: []
            }
    }
};
