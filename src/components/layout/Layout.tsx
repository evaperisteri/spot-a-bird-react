import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center flex flex-col min-h-screen">
      <div className="bg-offwhite/70 h-20">
        <Header />
      </div>
      <div className="h-75 flex-auto">
        <Outlet />
      </div>
      <div className="h-6">
        <Footer />
      </div>
    </div>
  );
}
