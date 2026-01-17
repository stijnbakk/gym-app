import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createServerPb,
	savePbAuthCookie,
	pbCookieName
} from '$lib/server/pocketbase';

export const load: PageServerLoad = async ({ cookies }) => {
	const cookie = cookies.get(pbCookieName);
	if (cookie) {
		const pb = createServerPb();
		pb.authStore.loadFromCookie(cookie);
		if (pb.authStore.isValid) {
			redirect(302, '/auth/profile');
		}
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		console.log('Login action called');
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		console.log('Login attempt for:', email);

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { error: 'Invalid form data' });
		}

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const pb = createServerPb();

		try {
			const authData = await pb.collection('users').authWithPassword(email, password);
			console.log('Auth successful, token:', pb.authStore.token?.substring(0, 20) + '...');
			console.log('Auth record:', authData.record.id);
			savePbAuthCookie(event, pb);
			console.log('Cookie saved');
		} catch (err) {
			console.error('Login error:', err);
			return fail(400, { error: 'Invalid email or password' });
		}

		console.log('Redirecting to profile');
		redirect(302, '/auth/profile');
	},

	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const passwordConfirm = formData.get('passwordConfirm');

		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof passwordConfirm !== 'string'
		) {
			return fail(400, { error: 'Invalid form data' });
		}

		if (!email || !password || !passwordConfirm) {
			return fail(400, { error: 'All fields are required' });
		}

		if (password !== passwordConfirm) {
			return fail(400, { error: 'Passwords do not match' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		const pb = createServerPb();

		try {
			await pb.collection('users').create({
				email,
				password,
				passwordConfirm
			});

			// Auto-login after registration
			await pb.collection('users').authWithPassword(email, password);
			savePbAuthCookie(event, pb);
		} catch (err) {
			console.error('Registration error:', err);
			return fail(400, { error: 'Registration failed. Email may already be in use.' });
		}

		redirect(302, '/auth/profile');
	}
};
