import ErrorBoundary from "../components/ErrorBoundary";
import Logform from "../components/ui/Logform";

export default function NewLogPage() {
  return (
    <div className="md:col-span-9">
      <div className="mt-4 px-4 lg:px-20">
        <span className="block text-center font-semibold font-logo tracking-wider rounded-xl shadow-soft text-purple text-2xl border border-purple p-4 m-4">
          New Log Form
        </span>
      </div>

      <div className="mt-4 lg:px-20">
        <div className="text-center font-logo rounded-xl shadow-soft text-purple text-lg border border-purple md:p-10 m-4">
          <ErrorBoundary>
            <Logform />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
