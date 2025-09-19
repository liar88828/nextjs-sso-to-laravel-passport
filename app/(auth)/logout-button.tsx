"use client";

import { SSOSession } from "@/action/session-action";
import { Spinner } from "@/components/mini/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransition } from "react";

export default function LogoutButton({ session }: { session: SSOSession }) {
    const [ isPending, startTransition ] = useTransition()
    const handleLogout = async () => {
        startTransition(async () => {
            const response = await fetch("/api/sso/logout", { method: "POST" });

            // If server sent a redirect, you can manually navigate
            if (response.redirected) {
                window.location.href = response.url; // go to /home
            } else {
                // fallback
                console.log("Logged out, but no redirect from server");
                window.location.href = "/home";
            }
        });
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    { !session?.user ? <Spinner/> : <>
                        <CardTitle>Welcome, { session?.user.name } 🎉</CardTitle>
                        <CardDescription>{ session.user.email }</CardDescription>
                    </>
                    }
                </CardHeader>
                <CardContent>


                    <button
                        disabled={ isPending }
                        onClick={ handleLogout }
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Logout
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
