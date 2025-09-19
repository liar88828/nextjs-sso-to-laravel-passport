// app/api/sso/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	// validate state (stored previously in cookies/session)
	const storedState = req.cookies.get("sso_state")?.value;
	console.log(storedState);

	if (!storedState || storedState !== state) {
		return NextResponse.json({ error: "Invalid state" }, { status: 400 });
	}

	// exchange authorization code for access_token
	const tokenRes = await fetch("http://localhost:8000/oauth/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			client_id: process.env.SSO_CLIENT_ID!,
			client_secret: process.env.SSO_CLIENT_SECRET!,
			redirect_uri: process.env.SSO_REDIRECT_URI!,
			code: code ?? "",
		}),
	});
	// console.log(await tokenRes.text());

	if (!tokenRes.ok) {
		return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
	}

	const token = await tokenRes.json();

	// check user detail with access_token
	const userRes = await fetch("http://localhost:8000/api/token/check", {
		headers: { Authorization: `Bearer ${ token.access_token }` },
	});

	if (!userRes.ok) {
		return NextResponse.json({ error: "User fetch failed" }, { status: 400 });
	}

	const data = await userRes.json();
	const ssoUser = data.user;

	// normally, here you’d create/find a user in your DB
	// but since Next.js has no built-in ORM, connect Prisma or your DB
	// Example (pseudo):
	// const user = await db.user.upsert({
	//   where: { email: ssoUser.email },
	//   update: {},
	//   create: { email: ssoUser.email, name: ssoUser.name },
	// });

	// set cookies for session
	const response = NextResponse.redirect(new URL("/home", req.url));
	response.cookies.set("token", JSON.stringify(token), { httpOnly: true });
	response.cookies.set("user", JSON.stringify(ssoUser));

	return response;
}
