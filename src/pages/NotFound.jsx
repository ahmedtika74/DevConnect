import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4 text-center">
      <h1 className="block bg-linear-to-r from-[#D0BCFF] to-blue-500 bg-clip-text text-8xl font-black text-transparent md:text-9xl">
        404
      </h1>

      <p className="mt-6 text-2xl font-bold text-slate-200">Lost in Space?</p>
      <p className="mt-4 max-w-md text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="mt-10">
        <Button
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center justify-center gap-2">
            <Home size={20} />
            <span>Back to Home</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
