import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Vehicle Truth Home">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-white font-bold">VT</span>
      <span className="font-semibold tracking-tight gradient-text">VehicleTruth</span>
    </Link>
  );
}
