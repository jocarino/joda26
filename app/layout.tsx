import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Damola & João's Wedding",
  description: "Join us as in our wedding celebration.",
  icons: {
    icon: "/images/JoDa Logo.svg",
    shortcut: "/images/JoDa Logo.svg",
    apple: "/images/JoDa Logo.svg",
  },
  openGraph: {
    title: "Damola & João's Wedding",
    description: "Join us as in our wedding celebration.",
    url: siteUrl,
    siteName: "Damola & João Wedding",
    images: [
      {
        url: `${siteUrl}/images/A-194.jpg`,
        width: 1200,
        height: 630,
        alt: "Damola & João Wedding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Damola & João's Wedding",
    description: "Join us as in our wedding celebration.",
    images: [`${siteUrl}/images/A-194.jpg`],
  },
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
