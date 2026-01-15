import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast/toast-context";

export const metadata: Metadata = {
  title: "Queen Creek Chamber - Business License Management",
  description: "Queen Creek Chamber of Commerce's official business license management platform powered by Moil",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/interstate" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Interstate', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
