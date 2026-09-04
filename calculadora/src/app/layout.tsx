import type { Metadata, Viewport } from "next";
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

// viewportFit "cover" libera o env(safe-area-inset-*) no iPhone; sem ele o
// conteúdo fica atrás da barra do Safari e o indicador de home cobre o rodapé.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f5ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${display.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      {/* No celular a barra do menu fica em cima e o conteúdo embaixo (coluna).
          Com flex em linha, a barra virava uma coluna vazia de 40% à esquerda. */}
      <body className="flex min-h-screen flex-col bg-[#f5f5ef] md:h-full md:flex-row">
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
