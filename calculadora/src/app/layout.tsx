import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
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
  title: "Simulador INSS de Obra — CIFRA",
  description: "Sistema interno de planejamento tributário de obra da CIFRA.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8f9fa] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main id="conteudo" className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
