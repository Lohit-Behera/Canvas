import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Product",
  description: "Create a product and share it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <div className="w-full min-h-screen flex flex-col justify-center items-center">
            <Header />
            <main className="w-full flex-1 flex justify-center items-center my-6">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
