"use client";

import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export const AppBar = () => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.replace("/");
    });
  };

  return (
    <div className="absolute w-full">
      <div className="flex justify-between px-2.5 sm:px-9 py-3 sm:py-4">
        <div className="flex px-2">
          <div className="flex flex-col justify-center pr-1 sm:pr-2.5">
            <Image
              src={"/echo_logo.png"}
              alt="Echo Logo"
              width={50}
              height={50}
              className="w-10 h-10 sm:w-14 sm:h-14"
            />
          </div>
          <div className="flex flex-col justify-center font-bold text-2xl sm:text-3xl text-orange-100">
            Echo
          </div>
        </div>

        <div className="flex">
          {!session.data?.user && pathname !== "/features" && (
            <div className="hidden sm:flex sm:flex-col sm:justify-center mr-12 text-lg text-orange-100">
              <div
                className="cursor-pointer hover:text-orange-200"
                onClick={() => {
                  router.push("/features");
                }}
              >
                Features
              </div>
            </div>
          )}

          <div>
            {session.data?.user && (
              <ShimmerButton
                shimmerColor="wheat"
                shimmerSize="0rem"
                className="text-orange-100"
                onClick={handleLogout}
              >
                Logout
              </ShimmerButton>
            )}
            {!session.data?.user && (
              <ShimmerButton
                shimmerColor="wheat"
                shimmerSize="0.08rem"
                className="text-orange-100"
                onClick={() => {
                  signIn("google");
                }}
              >
                <Image
                  src={"/google.png"}
                  alt="Google logo"
                  width={15}
                  height={15}
                  className="mr-2 mb-0.5"
                />
                Login
              </ShimmerButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
