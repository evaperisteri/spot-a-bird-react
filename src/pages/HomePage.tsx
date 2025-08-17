import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    document.title = "Spot A Bird App Home Page";
  }, []);
  return (
    <>
      <h1 className="text-bold font-logo text-sage text-center mt-8 bg-offwhite">
        Home Page
      </h1>
    </>
  );
};
export default HomePage;
