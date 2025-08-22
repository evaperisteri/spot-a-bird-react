import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ButtonHome } from "../ui/ButtonHome";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center min-h-screen">
      <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <div className="bg-offwhite/70 h-20">
          <Header />
        </div>
        <div className=" overflow-auto ">
          <div className="mt-4 mx-auto w-full max-w-7xl sm:px-6 lg:px-8 ">
            <div className="mt-4 p-4 md:p-8 rounded-xl shadow-soft border-2 border-lilac/60 bg-offwhite grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[80vh]">
              {/* Sidebar */}
              <div className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-4 rounded-xl shadow-soft border-2 border-purple/80 p-4 items-center text-center justify-center">
                <ButtonHome type="button" to="/savelog">
                  New Log
                </ButtonHome>
                <ButtonHome type="button" to="/mylogs">
                  My logs
                </ButtonHome>
                <ButtonHome type="button" to="/stats">
                  Stats
                </ButtonHome>
                <ButtonHome type="button" to="/myinfo">
                  Profile
                </ButtonHome>
                <ButtonHome type="button" to="/birds">
                  All Birds
                </ButtonHome>
              </div>
              {/* Main content */}
              <div className="md:col-span-10 flex flex-col">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
}
