"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const AppBar = () => {
  const session = useSession();
  return (
    <div className="flex justify-between p-5">
      <div>Echo</div>
      <div>
        {session.data?.user && (
          <button
            className="bg-blue-600 p-2 rounded-2xl cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </button>
        )}
        {!session.data?.user && (
          <button
            className="bg-blue-600 p-2 rounded-2xl cursor-pointer"
            onClick={() => signIn()}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};
