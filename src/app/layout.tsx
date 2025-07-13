import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import MainContent from "@/components/navigation/mainContent";
import { Toaster } from "@/components/ui/toaster";
import ClientProvider from "@/components/clientProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "USD Calculator",
  description:
    "Calculator to estimate profits in USD buy/sell transactions, including fees and earnings based on parallel exchange rates",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn("font-sans antialiased h-screen", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="h-full flex justify-center items-center">
                <Spinner />
              </div>
            }
          >
            <ClientProvider>
              <Header />
              <MainContent>{children}</MainContent>
              <Footer />
              <Toaster />
            </ClientProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
