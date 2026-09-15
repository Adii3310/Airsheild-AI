import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { DemoModeModal } from "@/components/demo/DemoModeModal";

export const metadata: Metadata = {
  title: "Airsheild AI | Smart Pollution Reduction Grid",
  description: "IoT-Based Smart Air-Pollution Monitoring & Filtration Network Control Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 min-h-screen font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 mb-16 md:mb-0 max-w-7xl mx-auto w-full space-y-6">
                {children}
                <DemoModeModal />
              </main>
            </div>
            <MobileNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
