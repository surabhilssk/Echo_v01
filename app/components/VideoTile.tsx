"use client";

import Image from "next/image";

interface VideoTitleProps {
  key: string;
  title: string;
  thumbnail: string;
  votes: number;
}

export const VideoTile = ({
  key,
  title,
  thumbnail,
  votes,
}: VideoTitleProps) => {
  return (
    <div className="h-28 mr-9 rounded-md bg-[#031c26] mt-3">
      <div className="p-2 flex gap-3">
        <div>
          <Image
            src={thumbnail}
            alt="Thumbnail"
            width={170}
            height={170}
            className="rounded-md"
          />
        </div>
        <div className="mt-3">
          <div className="text-lg font-medium text-orange-100">{title}</div>
          <div className="flex">
            <div className="mt-2">
              <button onClick={() => {}}>
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
            </div>
            <div className="flex flex-col justify-center pt-1 pl-1 text-orange-100">
              {votes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
