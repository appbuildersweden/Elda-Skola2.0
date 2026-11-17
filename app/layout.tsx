import type { Metadata } from "next";
import type { ReactNode } from "react";
import ErrorReporter from "@/components/error-reporter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elda Skola 2.0",
  description: "Lärplattform för lärare och elever.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ErrorReporter />
      </body>
    </html>
  );
}
