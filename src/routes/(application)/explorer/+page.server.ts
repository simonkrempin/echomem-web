import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const storeType = cookies.get("store-type");

    switch(storeType) {
        case "local":
            return {
                decks: [],
                cards: []
            };
        case "google-drive":
            return {
                decks: [],
                cards: []
            };
        case "account":
            return {
                decks: [{
                    id: "lasdfaufahudfliasdfhl",
                    name: "Deck 1",
                }],
                cards: [{
                    id: "slöadfjklöasdjf",
                    front: "this is the front",
                    back: "this is the back"
                }]
            }
    }
};