import { getSessionCookies, getSessionValid, SSOSession, SSOToken, validateToken } from "@/action/session-action";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const useSession_ = () => {
    // 1️⃣ Fetch token from cookies
    const {
        data: token,
        isLoading: isTokenLoading,
        mutate: mutateToken,
    } = useSWR<SSOToken | null>("getSessionValid", () => getSessionValid());
    // console.log({ token })
    // 2️⃣ Fetch user info only if token exists
    const {
        data: user,
        isLoading: isUserLoading,
        mutate: mutateUser,
    } = useSWR<SSOSession>(
        token && !isTokenLoading ? [ "validateToken", token.access_token ] : null, // conditional fetch
        () => validateToken(token?.access_token)
    );
    // console.log('is execute : user',user)

    // 3️⃣ Helper to refresh both token and user
    const mutateSession = async () => {
        await mutateToken();
        await mutateUser();
    };

    return {
        data: user,
        mutateSession,
        isLoading: isTokenLoading || isUserLoading,
    };
};

export const useSession = () => {
    const [ token, setToken ] = useState<SSOSession | null>(null);
    const [ isTokenLoading, setIsTokenLoading ] = useState(true);

    // Load token
    useEffect(() => {
        setIsTokenLoading(true);
        getSessionCookies()
        .then((t) => setToken(t))
        .finally(() => setIsTokenLoading(false));
    }, []);

    // console.log({ token })
    // Load user only if token exists
    const { data: user, isLoading: isUserLoading } = useSWR<SSOSession>(
        token ? [ "validateToken", token.token.access_token ] : null,
        () => validateToken(token!.token.access_token)
    );

    return {
        data: user ?? null,
        isLoading: isTokenLoading || isUserLoading,
    };
};