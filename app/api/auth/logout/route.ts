import { NextResponse } from "next/server";

export async function POST() {
	const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL));
	res.cookies.delete("token");
	res.cookies.delete("user");
	return res;
}
