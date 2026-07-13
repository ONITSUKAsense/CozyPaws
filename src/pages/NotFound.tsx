import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-serif-display text-[#1a3d1a] mb-4">
          404
        </h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2a5a2a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
