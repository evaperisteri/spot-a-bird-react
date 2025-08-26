import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ButtonHome } from "../ui/ButtonHome";
import { Menu, X } from "lucide-react";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center min-h-screen flex flex-col">
      <Header />

      {/* Mobile sidebar toggle button */}
      <button
        className="lg:hidden fixed top-28 left-4 z-50 bg-sage text-offwhite p-2 rounded-md shadow-heavy hover:bg-sage/90 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle navigation menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main content area */}
      <div className="flex flex-1 pt-4 pb-8">
        {/* Sidebar for desktop - always visible */}
        <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:px-4">
          <div className="w-full flex flex-col gap-4 rounded-xl shadow-soft border border-purple/80 p-4 bg-offwhite/80 h-fit">
            <ButtonHome type="button" to="/savelog" className="w-full">
              New Log
            </ButtonHome>
            <ButtonHome
              type="button"
              to="/dashboard?showMyLogs=true"
              className="w-full"
              onClick={(e) => {
                if (window.location.pathname === "/dashboard") {
                  e.preventDefault();
                  // Toggle logic here
                }
              }}
            >
              My logs
            </ButtonHome>
            <ButtonHome type="button" to="/statistics" className="w-full">
              Stats
            </ButtonHome>
            <ButtonHome type="button" to="/myinfo" className="w-full">
              Profile
            </ButtonHome>
            <ButtonHome type="button" to="/birds" className="w-full">
              All Birds
            </ButtonHome>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div
              className="fixed left-0 top-0 h-full w-64 bg-offwhite/95 z-50 transform transition-transform duration-300 ease-in-out lg:hidden pt-16 px-4 overflow-y-auto"
              style={{
                transform: isSidebarOpen
                  ? "translateX(0)"
                  : "translateX(-100%)",
              }}
            >
              <button
                className="absolute top-4 right-4 text-purple p-1"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col gap-4 mt-8">
                <ButtonHome
                  type="button"
                  to="/savelog"
                  className="w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  New Log
                </ButtonHome>
                <ButtonHome
                  type="button"
                  to="/dashboard?showMyLogs=true"
                  className="w-full"
                  onClick={(e) => {
                    if (window.location.pathname === "/dashboard") {
                      e.preventDefault();
                      // Toggle logic here
                    }
                    setIsSidebarOpen(false);
                  }}
                >
                  My logs
                </ButtonHome>
                <ButtonHome
                  type="button"
                  to="/statistics"
                  className="w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Stats
                </ButtonHome>
                <ButtonHome
                  type="button"
                  to="/myinfo"
                  className="w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Profile
                </ButtonHome>
                <ButtonHome
                  type="button"
                  to="/birds"
                  className="w-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  All Birds
                </ButtonHome>
              </div>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="bg-offwhite/50 rounded-xl shadow-soft border-2 border-lilac/60 p-4 md:p-8 min-h-[70vh]">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
