import type {PageServerLoad} from './$types';
import type {Deck} from "../../../../models/deck";
import type {Card} from "../../../../models/card";

interface ReturnData {
    cards: Card[],
    decks: Deck[]
}

export const load: PageServerLoad = async ({cookies}): Promise<ReturnData> => {
    const storeType = cookies.get("store-type");

    switch (storeType) {
        case "account":
            return {
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
                cards: [],
                decks: []
            }
    }
};