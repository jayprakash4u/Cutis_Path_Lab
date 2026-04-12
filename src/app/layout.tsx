import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cutis Path Lab",
  description: "Medical Laboratory Services",
  icons: {
    icon: "/cutis.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
