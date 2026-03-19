// src/components/layout/main.tsx
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,_#fff7ed_0%,_#f8fafc_36%,_#eff6ff_100%)]">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
