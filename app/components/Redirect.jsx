"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
export const Redirect = () => {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();
    
      useEffect(() => {
        if (session.status === "authenticated") {
          router.push("/dashboard");
        } else if (
          session.status === "unauthenticated" &&
          pathname === "/dashboard"
        ) {
          router.replace("/");
        }
      }, [session.status, router, pathname]);
      return null;
}