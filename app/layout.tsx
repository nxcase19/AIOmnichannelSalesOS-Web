import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AI Omnichannel Sales OS",
  description: "SaaS Web UI for AI Omnichannel Sales OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
