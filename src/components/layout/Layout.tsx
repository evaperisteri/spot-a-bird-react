import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[url('/images/ssspot.svg')] bg-cover bg-center min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Main content area with proper responsive padding */}
        <main className="flex-grow overflow-auto">
          <div className="my-6 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        {/* Footer at the bottom */}
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
