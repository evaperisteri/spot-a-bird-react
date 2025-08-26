import ErrorBoundary from "../components/ErrorBoundary";
import Logform from "../components/ui/Logform";

export default function NewLogPage() {
  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Title */}
      <h1 className="w-full max-w-2xl text-center font-semibold font-logo tracking-wider rounded-xl shadow-soft text-purple text-2xl border border-purple p-2 mb-4">
        New Log Form
      </h1>

      {/* Form container */}
      <div className="w-full max-w-2xl rounded-xl shadow-soft text-purple text-lg border border-purple p-4 md:p-a bg-offwhite/80">
        <ErrorBoundary>
          <Logform />
        </ErrorBoundary>
      </div>
    </div>
  );
}
