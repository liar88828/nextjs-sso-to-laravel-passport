import { config } from "@/lib/costant";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function authorize() {
    // Generate a random state and store it in a cookie
    const state = crypto.randomBytes(20).toString('hex');
    const headers = new Headers();
    headers.append('Set-Cookie', `sso_state=${ state }; Path=/; HttpOnly; SameSite=Lax`);

    // Build the query string with the OAuth parameters
    const query = new URLSearchParams({
        client_id: config.SSO_CLIENT_ID,
        redirect_uri: config.SSO_REDIRECT_URI,
        response_type: 'code',
        scope: '', // Add required scopes here
        state: state,
    }).toString();

    // Redirect the user to the authorization URL
    const redirectUrl = `http://localhost:8000/oauth/authorize?${ query }`;
    return NextResponse.redirect(redirectUrl, { headers });
}


export async function callback(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    // validate state (stored previously in cookies/session)
    const storedState = req.cookies.get("sso_state")?.value;
    // console.log(storedState);

    if (!storedState || storedState !== state) {
        return NextResponse.json({ error: "Invalid state" }, { status: 400 });
    }

    // exchange authorization code for access_token
    const tokenRes = await fetch("http://localhost:8000/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: config.SSO_CLIENT_ID!,
            client_secret: config.SSO_CLIENT_SECRET!,
            redirect_uri: config.SSO_REDIRECT_URI!,
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
    // console.log(ssoUser);
    // normally, here you’d create/find a user in your DB
    // but since Next.js has no built-in ORM, connect Prisma or your DB
    // Example (pseudo):
    const user = await prisma.users.upsert({
        where: { email: ssoUser.email },
        update: {},
        create: { email: ssoUser.email, name: ssoUser.name, id: ssoUser.id },
    });

    // set cookies for session
    const response = NextResponse.redirect(new URL("/home", req.url));
    response.cookies.set("token", JSON.stringify(token), { httpOnly: true });
    response.cookies.set("user", JSON.stringify(ssoUser));

    return response;
}


export async function logout(req: NextRequest) {
    // Create redirect response
    const res = NextResponse.redirect(new URL("/home", req.url));

    // Delete cookies by setting them expired
    res.cookies.set("token", "", { path: "/", expires: new Date(0) });
    res.cookies.set("user", "", { path: "/", expires: new Date(0) });

    return res;
}

