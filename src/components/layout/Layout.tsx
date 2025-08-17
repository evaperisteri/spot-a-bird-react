import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center h-screen">
      <div className="bg-offwhite/70">
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
