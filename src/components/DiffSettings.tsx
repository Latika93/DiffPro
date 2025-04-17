import React from "react";
import {
  useDiff,
  DiffSettings as DiffSettingsType,
} from "../context/DiffContext";

type DiffOption = {
  id: keyof DiffSettingsType;
  label: string;
  description: string;
};

const diffOptions: DiffOption[] = [
  {
    id: "ignoreWhitespace",
    label: "Ignore Whitespace",
    description: "Ignore whitespace changes when comparing content",
  },
  {
    id: "ignoreCase",
    label: "Ignore Case",
    description: "Ignore case differences when comparing content",
  },
  {
    id: "contextLines",
    label: "Context Lines",
    description: "Number of context lines to show around changes",
  },
  {
    id: "showLineNumbers",
    label: "Show Line Numbers",
    description: "Display line numbers in the diff view",
  },
  {
    id: "highlightSyntax",
    label: "Syntax Highlighting",
    description: "Apply syntax highlighting to code in the diff view",
  },
];

const DiffSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings, computeDiff } = useDiff();

  const handleToggleSetting = (id: keyof DiffSettingsType) => {
    if (typeof settings[id] === "boolean") {
      updateSettings({ [id]: !settings[id] });
    }
  };

  const handleContextLinesChange = (value: string) => {
    const lines = parseInt(value);
    if (!isNaN(lines) && lines >= 0) {
      updateSettings({ contextLines: lines });
    }
  };

  const handleApplySettings = () => {
    // Recompute with current settings
    computeDiff();
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Diff Settings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure how differences are displayed and compared
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Comparison Options
            </h3>
            <div className="space-y-4">
              {diffOptions.map((option) =>
                option.id === "contextLines" ? (
                  <div key={option.id} className="flex items-start">
                    <div className="flex-1">
                      <label
                        htmlFor={option.id}
                        className="block text-sm font-medium text-slate-700"
                      >
                        {option.label}
                      </label>
                      <p className="text-sm text-slate-500">
                        {option.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="number"
                        id={option.id}
                        className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        min="0"
                        max="10"
                        value={settings.contextLines}
                        onChange={(e) =>
                          handleContextLinesChange(e.target.value)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div key={option.id} className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={option.id}
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={settings[option.id] as boolean}
                        onChange={() => handleToggleSetting(option.id)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={option.id}
                        className="font-medium text-slate-700"
                      >
                        {option.label}
                      </label>
                      <p className="text-slate-500">{option.description}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={resetSettings}
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleApplySettings}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiffSettings;
