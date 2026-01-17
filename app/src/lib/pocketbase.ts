import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Store for current user state (client-side)
export const currentUser = writable(pb.authStore.record);

// Update store when auth state changes
pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.record);
});
