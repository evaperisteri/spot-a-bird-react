import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonHome } from "../components/ui/ButtonHome";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner.tsx";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Spot A Bird App Home Page";

    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // If user is authenticated, don't render the home page content
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-purple">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-offwhite/80 sm:px-6 lg:px-8">
      <h1 className="pt-8 pl-8 text-2xl md:text-4xl font-logo text-sage">
        Welcome to
      </h1>
      <h2 className="text-purple text-2xl md:text-4xl font-logo pl-8 ">
        Spot A Bird App
      </h2>
      <div className="p-6">
        <img
          src="/images/Chat5.png"
          className="h-40 w-40 md:h-60 md:w-60 shadow-heavy rounded-full border-2 border-lilac/80 hover-glow "
          alt="Logo"
        />
      </div>
      <p className="text-lg md:text-xl text-sage font-sans mb-8 text-center mx-auto ">
        Spot and log bird species in Greece.
      </p>

      <div className="text-center mx-auto">
        <ButtonHome to="/login" type="button">
          Let's go...
        </ButtonHome>
      </div>
    </div>
  );
};

export default HomePage;
