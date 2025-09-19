// app/api/sso/callback/route.ts
import { callback } from "@/action/auth-action";
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
    return callback(req)
}
