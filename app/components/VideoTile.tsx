"use client";

import Image from "next/image";

interface VideoTitleProps {
  title: string;
  thumbnail: string;
  votes: number;
  onClick: () => void;
  haveUpvoted: boolean;
}

export const VideoTile = ({
  title,
  thumbnail,
  votes,
  onClick,
  haveUpvoted,
}: VideoTitleProps) => {
  return (
    <div className="h-28 mr-9 rounded-md bg-[#031c26] mt-3">
      <div className="p-2 flex gap-3">
        <div>
          <Image
            src={thumbnail}
            alt="Thumbnail"
            width={170}
            height={130}
            className="rounded-md"
          />
        </div>
        <div className="mt-3">
          <div className="text-lg font-medium text-orange-100">{title}</div>
          <div className="flex">
            <div className="mt-2">
              {haveUpvoted === false ? (
                <button onClick={onClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-7 text-orange-100 hover:fill-orange-200 hover:text-black cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              ) : (
                <button onClick={onClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-7 text-orange-100 hover:fill-orange-200 hover:text-black cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-col justify-center font-medium pt-1 px-2 text-orange-100">
              {votes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
