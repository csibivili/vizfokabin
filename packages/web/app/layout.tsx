import type { Metadata } from "next"
import type { Viewport } from "next"

// These styles apply to every route in the application
import "./globals.css"

export const metadata: Metadata = {
  title: "Vízfő Cabin",
  description: "Bükk is waiting for you with all of its beauty",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
