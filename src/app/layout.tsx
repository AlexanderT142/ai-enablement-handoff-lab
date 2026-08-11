import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-enablement-handoff-lab.vercel.app"),
  title: {
    default: "AI Enablement Handoff Lab",
    template: "%s | AI Enablement Handoff Lab",
  },
  description:
    "A public work sample showing how one recurring business task becomes a safe, tested and team-owned AI-assisted workflow.",
  applicationName: "AI Enablement Handoff Lab",
  authors: [{ name: "Alexander Tian", url: "https://github.com/AlexanderT142" }],
  openGraph: {
    title: "AI Enablement Handoff Lab",
    description:
      "Turn one recurring business task into a safe AI-assisted workflow, test its limits and hand ownership back.",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f2ed",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
