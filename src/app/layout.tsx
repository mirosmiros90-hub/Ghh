import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historical Scene Generator",
  description: "Advanced cinematic prompt studio for historically accurate Ukrainian village and Soviet-era AI video scenes.",
  applicationName: "Historical Scene Generator",
  themeColor: "#08090f"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
