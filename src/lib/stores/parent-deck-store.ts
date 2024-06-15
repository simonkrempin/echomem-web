import { writable } from "svelte/store";
import type { Deck } from "$lib/models/deck";

export const parentDeckStore = writable<Deck | null>(null);
