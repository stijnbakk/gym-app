import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import {
	createServerPbWithAuth,
	validatePbAuth,
	savePbAuthCookie,
	clearPbAuthCookie,
	type PbUser
} from '$lib/server/pocketbase';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handlePbAuth: Handle = async ({ event, resolve }) => {
	const pb = createServerPbWithAuth(event);
	const user = await validatePbAuth(pb);

	if (user) {
		event.locals.pbUser = {
			id: user.id,
			email: user.email as string,
			username: user.username as string | undefined,
			verified: user.verified as boolean,
			created: user.created as string,
			updated: user.updated as string
		} satisfies PbUser;
		savePbAuthCookie(event, pb);
	} else {
		event.locals.pbUser = null;
		clearPbAuthCookie(event);
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAuth, handlePbAuth);
