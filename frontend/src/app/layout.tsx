import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "CineMatch AI - Find your next obsession",
  description: "Production-grade AI movie recommendation and discovery platform powered by Scikit-Learn hybrid ML and Google Gemini.",
  keywords: ["AI Movie Recommendation", "Film Discovery", "Machine Learning", "CineMatch AI", "TMDB", "Gemini AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cinema-bg text-zinc-100 flex flex-col antialiased selection:bg-brand-500/30 selection:text-brand-300">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
