import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voltra E-Mail-Signatur",
  description:
    "Angaben eingeben und eine fertige Voltra E-Mail-Signatur herunterladen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // German is the default language; the switcher marks its choice further down
  // the tree, since the locale is chosen in the browser.
  return (
    <html lang="de" className="h-full antialiased">
      <head>
        {/*
          Loaded by their real family names rather than via next/font, because
          the signature markup asks for 'Sora' and 'Manrope' literally in its
          inline styles — the preview has to resolve the same names an email
          client would.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this is the App Router root layout, so the stylesheet applies to every page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
