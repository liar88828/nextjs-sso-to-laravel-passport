import { getSessionCookies } from "@/action/session-action";
import LogoutButton from "@/app/(auth)/logout-button";
import { Spinner } from "@/components/mini/spinner";
import React from 'react';


async function Page() {
    const session = await getSessionCookies()
    return (
        <div>
            { !session ? <Spinner/> :
                <LogoutButton session={ session }/>
            }
        </div>
    );
}


export default Page;