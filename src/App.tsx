import React, { useState } from "react";
import DiffViewer from "./components/DiffViewer";
import FileInput from "./components/FileInput";
import DiffStatistics from "./components/DiffStatistics";
import DiffSettings from "./components/DiffSettings";
import { DiffProvider } from "./context/DiffContext";
import Navbar from "./components/Navbar";
import DiffHistory from "./components/DiffHistory";

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<
    "compare" | "history" | "settings"
  >("compare");

  return (
    <DiffProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar setActivePage={setActivePage} activePage={activePage} />

        <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          {activePage === "compare" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <FileInput
                    side="left"
                    label="Original File"
                    description="Upload or paste the original version of your file"
                  />
                </div>
                <div>
                  <FileInput
                    side="right"
                    label="Modified File"
                    description="Upload or paste the modified version of your file"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200">
                  <div className="border-b border-slate-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-slate-900">
                        Diff Comparison
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-slate-500">
                        Line-by-line comparison between the two files
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <DiffViewer />
                  </div>
                </div>

                <DiffStatistics />
              </div>
            </>
          )}

          {activePage === "history" && <DiffHistory />}
          {activePage === "settings" && <DiffSettings />}
        </main>

        <footer className="bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} DiffViewer Pro
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  Documentation
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  Privacy
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-500">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DiffProvider>
  );
};

export default App;
