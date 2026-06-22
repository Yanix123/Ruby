import type { Metadata } from "next";
import "@/config/styles/global.css";
import { geistSans, geistMono } from "@/config/fonts";
import { QueryProvider } from "@/pkg/query";
import { SiteHeader } from "@/widgets/site-header";

export const metadata: Metadata = {
  title: "Movie Catalog",
  description: "A mini full-stack movie catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
