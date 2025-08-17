import { useEffect } from "react";
import { Button } from "../components/Button.tsx";

const HomePage = () => {
  useEffect(() => {
    document.title = "Spot A Bird App Home Page";
  }, []);

  return (
    <div className="sm:px-6 lg:px-8 h-60 flex flex-col items-center justify-center bg-offwhite/80">
      <h1 className="text-3xl md:text-4xl font-logo text-sage mb-6">
        Welcome to <span className="text-purple">Spot A Bird</span>
      </h1>
      <p className="text-lg md:text-xl text-sage font-sans mb-8 max-w-3xl mx-auto">
        Spot and log bird sightings in Greece.
      </p>
      <Button to="/login">Let's go...</Button>
    </div>
  );
};
export default HomePage;
