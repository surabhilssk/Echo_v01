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

async function getVideoDetailsFromOEmbed(videoId: string) {
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (!response.ok) {
            throw new Error('Failed to fetch from oEmbed');
        }
        const data = await response.json();
        return {
            title: data.title,
            thumbnail: {
                thumbnails: [
                    { url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, width: 1280 },
                    { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, width: 480 },
                    { url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, width: 320 },
                    { url: `https://img.youtube.com/vi/${videoId}/default.jpg`, width: 120 }
                ]
            }
        };
    } catch (error) {
     
        return {
            title: "YouTube Video",
            thumbnail: {
                thumbnails: [
                    { url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, width: 1280 },
                    { url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, width: 480 },
                    { url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, width: 320 },
                    { url: `https://img.youtube.com/vi/${videoId}/default.jpg`, width: 120 }
                ]
            },
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

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
        
        let videoDetails;
        try {
            
            videoDetails = await GetVideoDetails(extractedId);
            console.log("Video details from youtube-search-api:", videoDetails);
            
            
            if (!videoDetails || !videoDetails.thumbnail || !videoDetails.thumbnail.thumbnails) {
                throw new Error("Invalid response structure from youtube-search-api");
            }
        } catch (error) {
            console.log("youtube-search-api failed, trying fallback method:", error);
          
            videoDetails = await getVideoDetailsFromOEmbed(extractedId);
        }

     
        const thumbnails = videoDetails.thumbnail?.thumbnails || [];
        console.log("Thumbnails:", thumbnails);
        
        
        thumbnails.sort((a: {width: number}, b: {width: number}) =>  b.width - a.width);

      
        const largeImg = thumbnails[0]?.url || `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`;
        const smallImg = thumbnails[thumbnails.length - 1]?.url || `https://img.youtube.com/vi/${extractedId}/default.jpg`;

        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId: extractedId,
                type: "Youtube",
                title: videoDetails.title || "Unknown Title",
                smallImg: smallImg,
                largeImg: largeImg,
            }
        })
        
        return NextResponse.json({
            message: "Stream added successfully",
            id: stream.id
        })
    }catch(e){
        console.log("Error in POST /api/streams:", e);
        return NextResponse.json({
            message: "Error while adding a stream",
            error: e instanceof Error ? e.message : "Unknown error"
        },{
            status: 500
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
        const [streams, activeStream] = await Promise.all([
            prismaClient.stream.findMany({
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
            error: e instanceof Error ? e.message : "Unknown error"
        },{
            status: 500
        });
    }
}