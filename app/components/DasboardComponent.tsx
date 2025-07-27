"use client";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/stateful-button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { VideoTile } from "./VideoTile";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import YouTubeIFrameCtrl from "youtube-iframe-ctrl";

export const DashboardComponent = ({
  creatorId,
  playVideo,
}: {
  creatorId: string;
  playVideo: boolean;
}) => {
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pnLoading, setPnLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [url, setUrl] = useState("");
  const videoPlayerRef = useRef(null);
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
        error: e,
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
        return (
          new Date(a.atCreated).getTime() - new Date(b.atCreated).getTime()
        );
      });
      setStreams(sortedStreams);
      setCurrentVideo((video: any) => {
        const newVideo = response.data.activeStream?.stream;
        if (!newVideo) return video;
        if (video?.id === newVideo.id) {
          return video;
        }
        return response.data.activeStream.stream;
      });
      setLoading(false);
    } catch (e) {
      console.log("Error fetching streams");
      console.error(e);
    }
  }

  async function playNext() {
    try {
      setPnLoading(true);
      const videoContent = await axios.get("api/streams/next");
      setCurrentVideo(videoContent.data.stream);
      setPnLoading(false);
      refreshStreams();
    } catch (e) {
      setPnLoading(false);
      toast("No more songs to play", {
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
      console.log(e);
    }
  }

  useEffect(() => {
    const iframeElement = document.getElementById("youtube-player");
    if (iframeElement && iframeElement instanceof HTMLIFrameElement) {
      const youTubeIFrameCtrl = new YouTubeIFrameCtrl(iframeElement);

      async function play() {
        await youTubeIFrameCtrl.play();
      }
      play();
      const handleStateChange = (event: any) => {
        if (event.detail === "ENDED") {
          const upcomingStreams = streams.filter(
            (stream) => stream.id !== currentVideo?.id
          );
          if (upcomingStreams.length > 0) {
            playNext();
          } else {
            toast("No more songs to play", {
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
          }
        }
      };
      iframeElement.addEventListener("ytstatechange", handleStateChange);
      return () => {
        iframeElement.removeEventListener("ytstatechange", handleStateChange);
      };
    }
  }, [currentVideo, videoPlayerRef]);

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, 20 * 1000);
    return () => clearInterval(interval);
  }, [creatorId]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-screen pt-28">
        <div className="ml-28 mb-4">
          <div className="text-xl font-medium text-orange-100">
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
                      thumbnail={stream.smallImg}
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
            <div className="w-full h-64 mt-2 rounded-2xl">
              {currentVideo ? (
                <div>
                  {playVideo ? (
                    <div ref={videoPlayerRef}>
                      <iframe
                        id="youtube-player"
                        width={"100%"}
                        height={250}
                        src={`https://www.youtube.com/embed/${currentVideo.extractedId}?enablejsapi=1`}
                      ></iframe>
                    </div>
                  ) : (
                    <div>
                      <Image
                        src={currentVideo.smallImg}
                        alt="Thumbnail"
                        width={100}
                        height={90}
                        className="rounded-2xl w-full"
                      />
                      <p className="text-center text-orange-100 mt-2">
                        {currentVideo.title}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center flex-col text-xl text-orange-100 opacity-50 w-full h-64 rounded-2xl text-center bg-[#031c26]">
                  No video is playing
                </div>
              )}
            </div>
            <div className="mt-3">
              <ShimmerButton
                shimmerDuration="4s"
                className={`w-full text-orange-100 ${
                  session?.data?.user?.id === creatorId
                    ? "visible"
                    : "invisible"
                }`}
                onClick={playNext}
              >
                {pnLoading ? "Loading..." : "Play Next"}
              </ShimmerButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
