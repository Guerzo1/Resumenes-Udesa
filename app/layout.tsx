import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "UdeSA Resúmenes",
  description: "Resúmenes, parciales y material de estudio compartido por estudiantes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
