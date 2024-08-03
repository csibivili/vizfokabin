import type { Metadata } from "next"
import type { Viewport } from "next"
import Script from "next/script"

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
  const GTM_ID = "GTM-53P7XGLT"
  return (
    <html lang="en">
      <Script id="gtm" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
      </Script>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;" />`,
          }}
        />
        {children}
      </body>
    </html>
  )
}
