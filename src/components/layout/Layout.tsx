import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center bg-white/80 h-screen">
      <Header />
      <div className="mt-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
