import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownvoteSchema = z.object({
    streamId: z.string()
})


export async function POST(req: NextRequest){
    const session = await getServerSession(NEXT_AUTH);

    const user = await prismaClient.user.findFirst({
        where: {
            id: session?.token?.sub
        }
    });
    if(!user){
        return NextResponse.json({
            message: "User not found"
        },{
            status: 403
        });
    }

    try{
        const data = DownvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where: {
                userId_streamId: {
                    userId: user.id,
                    streamId: data.streamId
                }
            }
        })
    }catch(e){
        return NextResponse.json({
            message: "Error while downvoting"
        }, {
            status: 403
        })
    }

}