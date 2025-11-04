import type { Metadata } from "next";
import { Providers } from "./providers";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Safety - Plataforma SHST",
  description: "Plataforma de Gestão de Segurança, Higiene e Saúde no Trabalho",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>
        <Providers>
          {children}
          <ConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
