import React from "react";
import { useDiff } from "../context/DiffContext";

const Editor = () => {
  const {
    beforeCode,
    afterCode,
    setBeforeCode,
    setAfterCode,
    computeDiff,
    isComputing,
    error,
  } = useDiff();

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">JSX Comparison</h2>
        <p className="text-gray-500 text-sm">
          Enter two versions of your JSX code to visualize React's diffing
          algorithm in action.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="before-code"
              className="block text-sm font-medium text-gray-700"
            >
              Before (Original JSX)
            </label>
            <span className="text-xs text-gray-500 font-mono">original</span>
          </div>
          <div className="relative">
            <textarea
              id="before-code"
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
              value={beforeCode}
              onChange={(e) => setBeforeCode(e.target.value)}
              placeholder="Enter JSX code..."
            />
            <div className="absolute top-2 right-2">
              <button className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                Format
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="after-code"
              className="block text-sm font-medium text-gray-700"
            >
              After (Updated JSX)
            </label>
            <span className="text-xs text-gray-500 font-mono">updated</span>
          </div>
          <div className="relative">
            <textarea
              id="after-code"
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
              value={afterCode}
              onChange={(e) => setAfterCode(e.target.value)}
              placeholder="Enter updated JSX code..."
            />
            <div className="absolute top-2 right-2">
              <button className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                Format
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
          <svg
            className="w-5 h-5 mr-3 text-red-500 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-added mr-1"></div>
            <span>Added</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-removed mr-1"></div>
            <span>Removed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-updated mr-1"></div>
            <span>Updated</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={computeDiff}
          disabled={isComputing}
        >
          {isComputing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Compare Differences</span>
            </>
          )}
        </button>
      </div>

      <div className="divider"></div>

      <div>
        <h3 className="font-medium text-gray-700 mb-2 text-sm">Tips:</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Try changing text content to see updates
          </li>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Add or remove elements to see DOM changes
          </li>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Change attributes to see attribute updates
          </li>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Add/remove key props to see reconciliation changes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Editor;
