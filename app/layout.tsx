import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damola & João Wedding",
  description: "Join us as we embark on a journey of love, joy, and eternal happiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}


