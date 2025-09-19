// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("token");

    // Jika tidak ada token di cookie → redirect ke /auth
    if (!tokenCookie) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    let token: any;
    try {
        token = JSON.parse(tokenCookie.value);
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Jika ada error di token → redirect ke /auth
    if (token.error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Cek token ke identity provider
    const response = await fetch("http://localhost:8000/api/token/check", {
        headers: {
            Authorization: `Bearer ${ token.access_token }`,
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Simpan user info ke cookies (karena session di Next.js pakai cookies)
    const data = await response.json();
    // console.log(data)
    const res = NextResponse.next();
    res.cookies.set("user", JSON.stringify(data.user), {
        httpOnly: true,
        sameSite: "lax",
    });

    return res;
}


// Tentukan route mana saja yang diproteksi
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/user/:path*",
        "/profile/:path*",
        "/product/:path*",

    ], // hanya apply ke route tertentu
};
