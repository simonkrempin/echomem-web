// src/routes/explorer/+page.server.ts
import { redirect } from '@sveltejs/kit';

export async function load() {
    // Perform the database check here
    const rootDeckId = "qwerqwerqwre";
    throw redirect(302, `/explorer/${rootDeckId}`);
}