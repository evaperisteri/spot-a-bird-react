import { useEffect } from "react";
import { Button } from "../components/Button.tsx";

const HomePage = () => {
  useEffect(() => {
    document.title = "Spot A Bird App Home Page";
  }, []);

  return (
    <div className="sm:px-6 lg:px-8 h-60 flex flex-col items-center justify-center">
      <h1 className="font-logo text-bold text-4xl text-sage mb-8 bg-offwhite">
        Home Page
      </h1>
      <Button to="/login">Let's go...</Button>
    </div>
  );
};
export default HomePage;
