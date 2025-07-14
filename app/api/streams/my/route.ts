import { NEXT_AUTH } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const session = await getServerSession(NEXT_AUTH);
    const user = await prismaClient.user.findFirst({
        where: {
            id: session?.token?.sub
        }
    });
    if(!user){
        return NextResponse.json({
            message: "Unauthenticated"
        },{
            status: 403
        });
    }

    try{
        const streams = await prismaClient.stream.findMany({
            where: {
                userId: user.id
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes:{
                    where: {
                        userId: user.id
                    }
                }
            }
        });
    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes
        }))
    });
    }catch(e){
        return NextResponse.json({
            message: "Error while fetching streams"
        });
    }
    

}