import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest){

    const session = await getServerSession(NEXT_AUTH);

    const user = await prismaClient.user.findFirst({
        where: {
            id: session?.user?.id || ""
        }
    });
    console.log(user);

    if(!user){
        return NextResponse.json({
            message: "User not found"
        },{
            status: 403
        })
    }

    try{
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        });
        return NextResponse.json({
            message: "Upvote successful"
        })
    }catch(e){
        console.error(e);
        return NextResponse.json({
            message: "Error while upvoting"
        },{
            status: 403
        },)
    }

}