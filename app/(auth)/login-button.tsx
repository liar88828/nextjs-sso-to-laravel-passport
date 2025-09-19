import { getSessionCookies } from "@/action/session-action";
import { redirect } from "next/navigation";

export default async function LoginButton() {
    const session = await getSessionCookies()
    // console.log(session)
    // ✅ If session exists, redirect to /home
    if (session) {
        redirect("/home");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="p-8 rounded-2xl shadow-lg bg-white max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Sign in with SSO
                </h1>
                <p className="text-gray-600 mb-6">
                    Use your identity provider account to continue
                </p>
                <a
                    href="/api/sso/authorize"
                    className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
                >
                    Sign in with Identity Provider
                </a>
            </div>
        </div>
    );
}
