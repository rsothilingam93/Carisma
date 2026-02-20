import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Home, Package, Settings, FileText, Calendar, Drill, Bot } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carisma",
  description: "Modern inventory and invoicing for auto shops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        {/* Sidebar */}
        <nav className="bg-gray-800 text-white w-16 hover:w-48 transition-all duration-300 flex flex-col items-start py-4 group min-h-screen">
          {/* Home */}
          <Link href="/" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Home className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Home
            </span>
          </Link>

          {/* Inventory */}
          <Link href="/inventory" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Package className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Inventory
            </span>
          </Link>

          {/* Invoicing */}
          <Link href="/invoicing" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <FileText className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Invoicing
            </span>
          </Link>

          {/* Scheduling */}
          <Link href="/scheduling" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Calendar className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Scheduling
            </span>
          </Link>

          {/* Parts */}
          <Link href="/parts" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Drill className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Parts
            </span>
          </Link>

            {/* Chatbot */}
            <Link href="/chatbot" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Bot className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chatbot
            </span>
          </Link>

          {/* Settings */}
          <Link href="/settings" className="flex items-center w-full px-3 py-3 hover:bg-gray-700 rounded">
            <Settings className="w-6 h-6 flex-shrink-0" />
            <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Settings
            </span>
          </Link>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
