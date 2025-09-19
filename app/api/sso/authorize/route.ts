import { authorize } from "@/action/auth-action";
import { NextRequest } from 'next/server';


export async function GET() {
    return authorize()
}
