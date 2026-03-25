import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { AuthProvider } from "@/components/auth-provider";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Conbiz | Cotizador de agentes",
  description:
    "Cotizador público para agentes conversacionales Conbiz con pricing modular, términos comerciales y resumen imprimible.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={plusJakarta.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
