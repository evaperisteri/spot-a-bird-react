export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      <p className="mt-4 text-purple/70">Loading...</p>
    </div>
  );
}
