import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agile Dev",
  description: "Agile Dev - Gerenciamento de Projetos Ágeis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
