import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { GetVideoDetails } from "youtube-search-api";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/lib/auth";
const YT_REGEX = new RegExp(/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/);

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
})

export async function POST(req: NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt){
            return NextResponse.json({
                message: "Wrong url format"
            },{
                status: 411
            });
        }

        const extractedId = data.url.split("v=")[1];
        const videoDetails = await GetVideoDetails(extractedId);
        const thumbnails = videoDetails.thumbnail.thumbnails;
        console.log(thumbnails);
        thumbnails.sort((a: {width: number}, b: {width: number}) =>  a.width < b.width ? 1 : -1);


        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId: extractedId,
                type: "Youtube",
                title: videoDetails.title || "Unknown Title",
                smallImg: thumbnails[thumbnails.length - 1].url || "https://www.billboard.com/wp-content/uploads/2023/07/SZA-SOS-album-art-billboard-1240.jpg?w=800",
                largeImg: thumbnails[thumbnails.length - 2].url || "https://www.billboard.com/wp-content/uploads/2023/07/SZA-SOS-album-art-billboard-1240.jpg?w=800",
            }
        })
        return NextResponse.json({
            message: "Stream added successfully",
            id: stream.id
        })
    }catch(e){
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream",
            error: e
        },{
            status: 411
        })
    }
}

export async function GET(req: NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
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
    try{
        const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
            where: {
                userId: creatorId || "",
                played: false
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes:{
                    where: {
                        userId: user.id || ""
                    }
                }
            }
        }),
        prismaClient.currentStream.findFirst({
            where: {
                userId: creatorId || "",
            },
            include:{
                stream: true
            }
        })
    ]);
    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    });
    }catch(e){
        return NextResponse.json({
            message: "Error while fetching streams",
            error: e
        });
    }
}

