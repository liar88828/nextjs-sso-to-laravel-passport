'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export interface SSOToken {
//     access_token: string;
//     refresh_token: string;
//     token_type: string;
//     expires_in: number;
//
//
//     [key: string]: any;
// }
//
//
// export interface SSOUser {
//     id: string;
//     name: string;
//     email: string;
//
//
//     [key: string]: any;
// }

export interface SSOToken {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}


export interface SSOUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}


export interface SSOSession {
    user: SSOUser
    token: SSOToken
}


export async function getSessionCookies(): Promise<SSOSession | null> {
    const cookieStore = await cookies();

    const userCookie = cookieStore.get("user")?.value;
    const tokenCookie = cookieStore.get("token")?.value;

    try {
        if (!userCookie || !tokenCookie) {
            throw new Error("Cookie not found.");
            // return null;
        }

        const user = JSON.parse(userCookie) as SSOUser;
        const token = JSON.parse(tokenCookie) as SSOToken;

        return { user, token };
    } catch {
        return null;
        // return {
        //     user: null,
        //     token: null
        // };
        // redirect('/home');
    }
}


// 1. Get token from cookies
export async function getSessionValid(): Promise<SSOToken | null> {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token")?.value;
    if (!tokenCookie) return null;

    try {
        const data = JSON.parse(tokenCookie) as SSOToken;
        await validateToken(data.access_token)
        // console.log({ response })
        return data
    } catch {
        // console.error("Cookie not found.");
        return null;
    }
}


// 2. Refresh token
export async function refreshToken(refresh_token: string): Promise<SSOToken | null> {
    const res = await fetch("http://localhost:8000/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "refresh_token",
            client_id: process.env.SSO_CLIENT_ID,
            client_secret: process.env.SSO_CLIENT_SECRET,
            refresh_token,
        }),
    });

    if (!res.ok) return null;
    return res.json();
}


// 3. Validate access token
export async function validateToken(access_token?: SSOToken['access_token']): Promise<SSOSession> {
    // console.log(`execute validateToken : ${ access_token }`)
    const res = await fetch("http://localhost:8000/api/token/check", {
        headers: {
            Authorization: `Bearer ${ access_token }`,
            Accept: "application/json",
        },
    });

    // if (!res.ok) {
    //     redirect('/home')
    // }
    const data = await res.json()
    // console.log(data)
    if (data.message) {
        if (!data.message.includes("Token is valid")) {
            redirect('/home');
        }
    }

    return data as SSOSession
}


