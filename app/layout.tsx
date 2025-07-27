import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider";
import { myRecoleta } from "./fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Echo",
  description: "Universal streaming platform for your workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${myRecoleta.className} antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" reverseOrder={true} />
        </Providers>
      </body>
    </html>
  );
}
