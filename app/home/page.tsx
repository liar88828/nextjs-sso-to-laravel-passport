import { getSessionCookies } from "@/action/session-action";
import Link from "next/link";

export default async function HomePage() {
const data=await getSessionCookies()
    // console.log(data)
    // If user exists → show home page
    return <div>
        <h1>Home page</h1>
        <Link
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
            Go to Login
        </Link>
    </div>
}
