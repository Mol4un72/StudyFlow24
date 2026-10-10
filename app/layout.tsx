import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "StudyFlow — Coursework Organization & Assignment Automation",
  description:
    "Organize programming and technical coursework, prepare AI-assisted solutions, publish changes to GitHub, and generate lab reports in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-[#0B0D12] text-[#F3F4F6] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

