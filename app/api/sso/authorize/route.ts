import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';


export async function GET(request: NextRequest) {
	// Generate a random state and store it in a cookie
	const state = crypto.randomBytes(20).toString('hex');
	const headers = new Headers();
	headers.append('Set-Cookie', `sso_state=${ state }; Path=/; HttpOnly; SameSite=Lax`);

	// Build the query string with the OAuth parameters
	const query = new URLSearchParams({
		client_id: process.env.SSO_CLIENT_ID || '',
		redirect_uri: process.env.SSO_REDIRECT_URI || '',
		response_type: 'code',
		scope: '', // Add required scopes here
		state: state,
	}).toString();

	// Redirect the user to the authorization URL
	const redirectUrl = `http://localhost:8000/oauth/authorize?${ query }`;
	return NextResponse.redirect(redirectUrl, { headers });
}
