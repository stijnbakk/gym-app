import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createServerPbWithAuth,
	clearPbAuthCookie,
	validatePbAuth,
	savePbAuthCookie
} from '$lib/server/pocketbase';

export const load: PageServerLoad = async (event) => {
	console.log('Profile load - checking auth');
	const pb = createServerPbWithAuth(event);
	console.log('Profile load - pb.authStore.isValid:', pb.authStore.isValid);
	console.log('Profile load - pb.authStore.token:', pb.authStore.token?.substring(0, 20) + '...');
	const user = await validatePbAuth(pb);
	console.log('Profile load - validated user:', user?.id);

	if (!user) {
		console.log('Profile load - no user, redirecting to login');
		redirect(302, '/auth/login');
	}

	// Save refreshed auth state
	savePbAuthCookie(event, pb);

	return {
		user: {
			id: user.id,
			email: user.email,
			username: user.username || null,
			verified: user.verified,
			created: user.created,
			updated: user.updated
		}
	};
};

export const actions: Actions = {
	logout: async (event) => {
		clearPbAuthCookie(event);
		redirect(302, '/auth/login');
	}
};
