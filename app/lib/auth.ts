import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const NEXT_AUTH = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],
    secret: "secret",
    callbacks: {
        async session({session, token, user}: any){
            // console.log({session})
            // console.log({token})
            session.user.id = token.sub;
            return session;
        },
        async signIn({user, account, profile}:any){
          if(!user.email){
            return false;
          }
          try{
            await prismaClient.user.create({
              data: {
                email: user.email,
                provider: account.provider,
              }
          });}catch(e){
            console.error(e);
          }
        return true;
    },
}}