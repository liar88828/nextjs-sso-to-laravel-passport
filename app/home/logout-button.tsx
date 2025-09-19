"use client";

import { useRouter } from "next/navigation";

export default function HomePageClient({ user }: { user: { name: string; email: string } }) {
	const router = useRouter();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/"); // redirect to login/landing page
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="p-6 rounded-xl shadow bg-white">
				<h1 className="text-2xl font-bold">Welcome, {user.name} 🎉</h1>
				<p className="text-gray-600 mt-2">{user.email}</p>

				<button
					onClick={handleLogout}
					className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
				>
					Logout
				</button>
			</div>
		</div>
	);
}
