import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-sans" })
const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "Dice Up — Roll the Towers",
  description:
    "Dice Up is a premium dice-tower prototype game. Roll to build your towers, grow the multiplier, and cash out before you fail. Test-mode only, no real currency.",
  generator: "v0.app",
  applicationName: "Dice Up",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#141726",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark bg-background antialiased",
        bodyFont.variable,
        headingFont.variable,
        "font-sans"
      )}
    >
      <body className="overscroll-none">{children}</body>
    </html>
  )
}
