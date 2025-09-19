import { logout } from "@/action/auth-action";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    return logout(req)
}
