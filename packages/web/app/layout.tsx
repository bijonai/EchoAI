import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Noto_Serif_SC, Noto_Sans_TC, Comic_Neue } from "next/font/google";

export const metadata: Metadata = {
  title: "EchoAI",
  description: "Begin your learning journey with EchoAI",
};

const notoSerifSC = Noto_Serif_SC({
  // weight: ['200', '300', '400', '500'],
  subsets: ["latin"],
});
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
});
const comicNeue = Comic_Neue({
  weight: ["300"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body
        className={`antialiased ${notoSerifSC.className}`}
      >
        <div className="w-screen h-screen max-w-screen max-h-screen min-w-screen min-h-screen">
          <div className="w-full h-full flex flex-row">
            <Sidebar/>
            <div className="flex p-1 w-full h-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
