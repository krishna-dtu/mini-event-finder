import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { EventProvider } from "@/context/event-context"
import { ThemeProvider } from "@/context/theme-context"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EventSphere - Discover Events Near You",
  description: "Discover, create, and explore events in your area",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <ThemeProvider>
          <EventProvider>
            <Navbar />
            {children}
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
