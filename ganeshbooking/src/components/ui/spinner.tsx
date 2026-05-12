export default function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div
      aria-label="Loading"
      className={`${className} animate-spin rounded-full border-2 border-amber-200 border-t-amber-800`}
    />
  );
}