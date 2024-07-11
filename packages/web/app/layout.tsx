import type { Metadata } from "next"
import type { Viewport } from "next"

// These styles apply to every route in the application
import "./globals.css"

export const metadata: Metadata = {
  title: "Vízfő Kabin",
  description: "Tarts egy kis szünetet, és lazíts egyet a Bükkben",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
