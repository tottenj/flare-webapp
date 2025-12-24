import { signUpAction } from "@/lib/auth/signUpAction";
import { AuthErrors } from "@/lib/errors/authError";
import fail from "@/lib/errors/fail";
import { NextRequest } from "next/server";

export default async function POST(req: NextRequest){
    const {idToken} = await req.json()
    if(!idToken) return fail(AuthErrors.InvalidInput())

    await signUpAction({idToken})

}