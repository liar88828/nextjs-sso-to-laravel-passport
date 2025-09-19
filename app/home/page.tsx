import { cookies } from "next/headers";
import HomePageClient from "@/app/home/logout-button";

export default async function HomePage() {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get("user")?.value;

	let user: { name: string; email: string } | null = null;
	if (userCookie) {
		try {
			user = JSON.parse(userCookie);
		} catch {
			user = null;
		}
	}

	// If no user → show login prompt
	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="p-6 rounded-xl shadow bg-white">
					<h1 className="text-xl font-semibold">You are not logged in</h1>
					<a
						href="/public"
						className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
					>
						Go to Login
					</a>
				</div>
			</div>
		);
	}

	// If user exists → show home page
	return <HomePageClient user={ user } />
}
