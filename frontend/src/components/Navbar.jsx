import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold">TinyLink</h1>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-6 items-center">
          <a className="hover:text-gray-300" href="/">Dashboard</a>
          <button className="block py-2 px-2 rounded hover:bg-gray-800" onClick={() => navigate("/health")} >Healthz</button>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="sm:hidden mt-2 px-2 pb-4">
          <a className="block py-2 px-2 rounded hover:bg-gray-800" href="/">Dashboard</a>
          <button className="block py-2 px-2 rounded hover:bg-gray-800" onClick={() => navigate("/health")} >Healthz</button>
        </div>
      )}
    </nav>
  );
}
