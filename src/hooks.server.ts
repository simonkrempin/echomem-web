import type {Handle} from "@sveltejs/kit";

const STORE_TYPES: Record<string, boolean> = {
    "local": false,
    "google-drive": true,
    "account": true
}

const storeTypeNeedsSession = (storeType: string): boolean => {
    return STORE_TYPES[storeType];
}

export const handle: Handle = async ({ event, resolve }) => {
    const storeType = event.cookies.get("store-type");

    console.log(event.url.pathname);

    if (!storeType) {
        if (event.url.pathname === "/") {
            return resolve(event);
        }

        return new Response("", {
            status: 302,
            headers: {
                "Location": "/"
            }
        });
    }

    if (storeTypeNeedsSession(storeType)) {
        const sessionToken = event.cookies.get("session");

        if (!sessionToken && event.url.pathname !== "/login") {
            return new Response("", {
                status: 302,
                headers: {
                    "Location": "/login"
                }
            })
        }
    }

    return resolve(event);
}