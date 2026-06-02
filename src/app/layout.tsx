import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PGM Academy",
    template: "%s | PGM Academy",
  },
  description:
    "Plataforma independente de preparacao para estudantes que desejam competir no Programa Ganhe o Mundo.",
  applicationName: "PGM Academy",
  keywords: [
    "PGM Academy",
    "Ganhe o Mundo",
    "Programa Ganhe o Mundo",
    "intercambio",
    "Pernambuco",
    "simulados",
  ],
  authors: [{ name: "PGM Academy" }],
  creator: "PGM Academy",
  openGraph: {
    title: "PGM Academy",
    description:
      "Preparacao independente para o processo seletivo do Programa Ganhe o Mundo.",
    type: "website",
    locale: "pt_BR",
    siteName: "PGM Academy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
