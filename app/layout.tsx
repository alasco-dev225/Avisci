import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { createServerClient } from "@/lib/supabase-server";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AvisCI - Les avis clients en Côte d'Ivoire",
  description: "Trouvez les meilleures entreprises en Côte d'Ivoire",
  manifest: "/manifest.json",
};

// ✅ themeColor déplacé ici dans viewport
export const viewport: Viewport = {
  themeColor: "#1B2B4B",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}