import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center min-h-screen">
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <div className="bg-offwhite/70 h-20">
          <Header />
        </div>
        <div className=" overflow-auto">
          <div className="mt-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
}
