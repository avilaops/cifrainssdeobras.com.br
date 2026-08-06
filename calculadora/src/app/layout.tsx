import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import { AppSidebar } from "@/components/layout/sidebar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CIFRA — Sistema de Planejamento Tributário",
  description: "Painel administrativo interno da CIFRA Consultoria Tributária de Obra.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${display.variable} h-full antialiased`}>
      <body className="flex h-full min-h-screen bg-[#f5f5ef]">
        <AppSidebar />
        {/* Main content — takes the remaining space, scrollable */}
        <div className="flex min-w-0 flex-1 flex-col md:h-screen md:overflow-y-auto">
          <main id="conteudo" className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
