"use client";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen text-orange-100">
        <div className="text-4xl sm:text-7xl font-bold text-center">
          <div>
            Unleash your{" "}
            <LineShadowText shadowColor="white" as={"span"}>
              Ears
            </LineShadowText>
            ,
          </div>
          <div className="flex">
            Ignite your
            <SparklesText
              className="sm:flex sm:flex-col hidden justify-center ml-1.5 sm:ml-3 text-4xl sm:text-7xl"
              sparklesCount={5}
            >
              mind
            </SparklesText>
            <div className="ml-1 sm:hidden">mind</div>
          </div>
        </div>
        <div>
          <div className="hidden sm:flex bg-red-40 max-w-xs sm:max-w-xl sm:mr-39 mt-5">
            Sync up, vibe out With Echo, you and your friends can stream music
            <br />
            together in realtime, creating the perfect soundtrack for work,
            <br />
            workouts, or chill sessions. Stay focused, stay connected,
            <br /> and let the music flow.
          </div>
          <div className="flex sm:hidden max-w-xs sm:max-w-xl sm:mr-39 mt-2 text-sm">
            Sync up, vibe out With Echo, you and your friends can stream music
            together in realtime. Stay focused, stay connected, and let the
            music flow.
          </div>
          <div className="flex gap-2.5 sm:gap-5 mt-4">
            <ShimmerButton
              shimmerSize="0rem"
              className="text-orange-100"
              onClick={() => {
                {
                  signIn("google");
                }
              }}
            >
              Get Started
            </ShimmerButton>
            <ShimmerButton
              shimmerSize="0rem"
              className="text-orange-100"
              onClick={() => {
                router.push("/features");
              }}
            >
              Learn More
            </ShimmerButton>
          </div>
        </div>
      </div>
    </>
  );
};
