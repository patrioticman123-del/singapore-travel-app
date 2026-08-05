import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { PwaRegister } from "./pwa-register";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") || incoming.get("host") || "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "獅城慢遊｜新加坡 5 日自由行",
    description: "五日行程、票券、導航與旅費都放在口袋裡。",
    applicationName: "獅城慢遊",
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "獅城慢遊" },
    icons: { icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }], apple: "/icon-192.png" },
    openGraph: { title: "獅城慢遊｜新加坡 5 日自由行", description: "行程・票券・導航・記帳，一支手機就帶走。", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "獅城慢遊 App" }] },
    twitter: { card: "summary_large_image", title: "獅城慢遊", description: "新加坡 5 日自由行", images: ["/og.png"] },
  };
}

export const viewport: Viewport = { themeColor: "#0d5c56", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body><PwaRegister />{children}</body></html>;
}
