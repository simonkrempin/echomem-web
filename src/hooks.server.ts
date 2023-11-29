import type {Handle} from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const storeType = event.cookies.get("store-type");

    if (!storeType && event.url.pathname !== "/") {
        return new Response("", {
            status: 302,
            headers: {
                "Location": "/"
            }
        });
    }

    return resolve(event);
}