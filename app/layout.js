import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import ClientSessionWrapper from "./ClientSessionWrapper";
import Notication from "./components/Notication";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static metadata for the app
export const metadata = {
  title: "Compare My Survey",
  description: "Find and compare local surveyor quotes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>
          <ClientSessionWrapper>
            {children}
            <Notication />
          </ClientSessionWrapper>
        </LayoutWrapper>
      </body>
    </html>
  );
}
