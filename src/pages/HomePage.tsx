import { useEffect } from "react";
import { ButtonHome } from "../components/ui/ButtonHome.tsx";

const HomePage = () => {
  useEffect(() => {
    document.title = "Spot A Bird App Home Page";
  }, []);

  return (
    <div className="items-center justify-center bg-offwhite/80 sm:px-6 lg:px-8">
      <h1 className="pt-8 pl-8 text-2xl md:text-4xl font-logo text-sage">
        Welcome to
      </h1>
      <h2 className="text-purple text-2xl md:text-4xl font-logo mb-6 pl-8 ">
        Spot A Bird App
      </h2>
      <p className="text-lg md:text-xl text-sage font-sans mb-8 text-center mx-auto ">
        Spot and log bird sightings in Greece.
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
