import { Outlet } from "react-router-dom";
import  Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}