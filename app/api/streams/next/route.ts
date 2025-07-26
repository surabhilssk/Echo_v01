import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(NEXT_AUTH);
    const user = await prismaClient.user.findFirst({
        where:{
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

    const mostUpvotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            played: false
        },
        orderBy:{
            upvotes: {
                _count: "desc"
            }
        }
    });

    if (!mostUpvotedStream) {
        return NextResponse.json({
            message: "No unplayed streams found"
        }, { status: 404 });
    }


    await Promise.all([
        prismaClient.currentStream.upsert({
            where: {
                userId: user.id
            },
            update: {
                streamId: mostUpvotedStream?.id
            },
            create: {
                userId: user.id,
                streamId: mostUpvotedStream?.id
            }
        }),
        prismaClient.stream.update({
            where: {
                id: mostUpvotedStream?.id
            },
            data: {
                played: true,
                playedAt: new Date()
            }
        })
    ]);
    return NextResponse.json({
        stream: mostUpvotedStream
    })
}