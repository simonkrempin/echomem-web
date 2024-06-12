// src/routes/explorer/+page.server.ts
import { ROOT_FOLDER_ID } from "$lib";
import { redirect } from '@sveltejs/kit';

export async function load() {
    // Perform the database check here
    throw redirect(302, `/explorer/${ROOT_FOLDER_ID}`);
}
