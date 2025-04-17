import React, { useState } from "react";

type NavbarProps = {
  activePage: string;
  setActivePage: (page: "compare" | "history" | "settings") => void;
};

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  D
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Diff<span className="text-indigo-600">Pro</span>
                </span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActivePage("compare")}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activePage === "compare"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "border-b-2 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                Compare
              </button>
              <button
                onClick={() => setActivePage("history")}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activePage === "history"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "border-b-2 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActivePage("settings")}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activePage === "settings"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "border-b-2 border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                Settings
              </button>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Share Diff
            </button>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 pb-3 pt-2">
          <button
            onClick={() => {
              setActivePage("compare");
              setMobileMenuOpen(false);
            }}
            className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              activePage === "compare"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => {
              setActivePage("history");
              setMobileMenuOpen(false);
            }}
            className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              activePage === "history"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            History
          </button>
          <button
            onClick={() => {
              setActivePage("settings");
              setMobileMenuOpen(false);
            }}
            className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              activePage === "settings"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Settings
          </button>
        </div>
        <div className="border-t border-slate-200 pb-3 pt-4">
          <div className="flex items-center px-4">
            <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
              Share Diff
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
