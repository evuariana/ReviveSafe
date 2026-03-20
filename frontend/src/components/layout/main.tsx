// src/components/layout/main.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors duration-500 dark:bg-[#050505] dark:text-zinc-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
