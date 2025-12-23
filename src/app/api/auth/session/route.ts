import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const {idToken} = await req.json()
    
}