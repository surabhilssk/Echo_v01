import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(NEXT_AUTH);
    const user = await prismaClient.user.findFirst({
        where: {
            id: session?.user?.id || ""
        }
    });
    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        },{
            status: 403
        });
    }
    

}