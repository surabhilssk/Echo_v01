"use client";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/stateful-button";
import { useEffect, useState } from "react";
import axios from "axios";
import { VideoTile } from "./VideoTile";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export const DashboardComponent = ({ creatorId }: { creatorId: string }) => {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const session = useSession();

  async function handleVote(streamId: string) {
    try {
      const stream = streams.find((stream: any) => stream.id === streamId);
      if (!stream) {
        return JSON.stringify({
          message: "Stream not found",
        });
      }
      const endpoint = stream.haveUpvoted
        ? "/api/streams/downvote"
        : "/api/streams/upvote";
      await axios.post(endpoint, {
        streamId,
      });
      setStreams((prevStreams: any) =>
        prevStreams.map((stream: any) =>
          stream.id === streamId
            ? {
                ...stream,
                upvotes: stream.haveUpvoted
                  ? stream.upvotes - 1
                  : stream.upvotes + 1,
              }
            : stream
        )
      );
      await refreshStreams();
      return JSON.stringify({
        message: "Voting successful",
      });
    } catch (e) {
      return JSON.stringify({
        message: "Voting failed",
      });
    }
  }

  async function handleShare() {
    const shareableUrl = `${window.location.hostname}/creator/${creatorId}`;
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success("Link copied to clipboard", {
        style: {
          border: "1px solid #713200",
          borderRadius: "100px",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    });
  }

  async function refreshStreams() {
    try {
      const response = await axios.get(`/api/streams/?creatorId=${creatorId}`, {
        withCredentials: true,
      });
      const sortedStreams = response.data.streams.sort((a: any, b: any) => {
        if (a.upvotes !== b.upvotes) {
          return b.upvotes - a.upvotes;
        }
        return a.creatorId - b.creatorId;
      });
      setStreams(sortedStreams);
      setLoading(false);
    } catch (e) {
      console.log("Error fetching streams");
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, 20 * 1000);
    return () => clearInterval(interval);
  }, [creatorId]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 h-screen pt-28">
        <div className="ml-28 mb-4">
          <div className="text-2xl font-medium text-orange-100">
            Upcoming Songs
          </div>
          <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
            {loading === true ? (
              <div className="text-orange-200 font-medium text-xl text-center mt-56">
                Loading...
              </div>
            ) : (
              <div>
                {streams.length > 0 ? (
                  streams.map((stream: any) => (
                    <VideoTile
                      key={stream.id}
                      title={
                        stream.title.length > 32
                          ? stream.title.slice(0, 32) + "..."
                          : stream.title
                      }
                      thumbnail={stream.largeImg}
                      votes={stream.upvotes}
                      onClick={() => handleVote(stream.id)}
                      haveUpvoted={stream.haveUpvoted}
                    />
                  ))
                ) : (
                  <div className="text-orange-200 font-medium text-xl text-center mt-56">
                    No upcoming songs
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mr-48">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center text-xl text-orange-100">
              Add a song
            </div>
            <ShimmerButton
              shimmerSize="0"
              shimmerDuration="0s"
              className="py-2 text-orange-100 px-3.5"
              onClick={handleShare}
            >
              <div className="flex">
                <div className="flex flex-col justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 mr-1"
                  >
                    <path d="M12 6a2 2 0 1 0-1.994-1.842L5.323 6.5a2 2 0 1 0 0 3l4.683 2.342a2 2 0 1 0 .67-1.342L5.995 8.158a2.03 2.03 0 0 0 0-.316L10.677 5.5c.353.311.816.5 1.323.5Z" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center mt-0.5">Share</div>
              </div>
            </ShimmerButton>
          </div>
          <div>
            <Input
              placeholder="Paste YouTube link here"
              type="text"
              className="rounded-full border-orange-100 mt-6"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <Button
              className="bg-[#031c26] text-orange-100 w-full mt-2"
              onClick={async () => {
                try {
                  await axios.post("/api/streams", {
                    creatorId: creatorId,
                    url: url,
                  });
                  refreshStreams();
                } catch (e) {
                  return JSON.stringify({
                    error: e,
                    message: "Error while adding aa stream",
                  });
                }
              }}
            >
              Add to queue
            </Button>
          </div>
          <div className="text-orange-100 font-medium text-2xl mt-6">
            Now Playing
          </div>
          <div>
            <div className="w-full h-64 bg-[#031c26] mt-2 rounded-2xl"></div>
            <div className="mt-3">
              <ShimmerButton
                shimmerDuration="4s"
                className={`w-full ${
                  session?.data?.user?.id === creatorId
                    ? "visible"
                    : "invisible"
                }`}
              >
                Play Next
              </ShimmerButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
