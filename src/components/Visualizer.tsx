import React, { useState } from "react";
import { useDiff } from "../context/DiffContext";
import TreeNode from "./TreeNode";

const Visualizer = () => {
  const { diffedTree, beforeTree, afterTree, error } = useDiff();
  const [viewMode, setViewMode] = useState<"diff" | "before-after">("diff");

  if (error) {
    return null; // Error is already displayed in the Editor component
  }

  if (!diffedTree && !beforeTree && !afterTree) {
    return (
      <div className="card h-full flex flex-col justify-center items-center p-12 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No Comparison Available
        </h3>
        <p className="text-gray-500 max-w-sm">
          Enter your JSX code in the editor and click "Compare Differences" to
          visualize the virtual DOM comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Virtual DOM Visualization
        </h2>
        <p className="text-gray-500 text-sm">
          See how React's reconciliation algorithm efficiently updates only the
          necessary parts of the DOM.
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "diff"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setViewMode("diff")}
          >
            Unified Diff
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "before-after"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setViewMode("before-after")}
          >
            Side-by-Side
          </button>
        </div>

        {viewMode === "diff" ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center overflow-x-auto">
              <div className="flex space-x-4 text-xs font-medium">
                <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                  <span>Added</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
                  <span>Removed</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Updated</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2"></div>
                  <span>Unchanged</span>
                </div>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[400px] bg-white">
              <div className="pl-4">
                {diffedTree?.map((node, index) => (
                  <TreeNode key={index} node={node} level={0} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-700">Before</h3>
                <span className="text-xs bg-gray-200 rounded-full px-2 py-1 text-gray-700">
                  Original
                </span>
              </div>
              <div className="p-4 overflow-auto max-h-[400px] bg-white">
                <div className="pl-4">
                  {beforeTree?.map((node, index) => (
                    <TreeNode
                      key={index}
                      node={{ ...node, diffStatus: "unchanged" }}
                      level={0}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-700">After</h3>
                <span className="text-xs bg-blue-100 rounded-full px-2 py-1 text-blue-700">
                  Updated
                </span>
              </div>
              <div className="p-4 overflow-auto max-h-[400px] bg-white">
                <div className="pl-4">
                  {afterTree?.map((node, index) => (
                    <TreeNode
                      key={index}
                      node={{ ...node, diffStatus: "unchanged" }}
                      level={0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 text-sm mb-3 flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          How React's Diffing Works
        </h3>
        <ol className="text-xs text-gray-600 space-y-1.5 pl-5 list-decimal">
          <li>React creates a virtual DOM representation of your components</li>
          <li>When state changes, it creates a new virtual DOM tree</li>
          <li>React compares (diffs) the previous and new virtual DOM trees</li>
          <li>
            It identifies the minimal set of changes needed to update the DOM
          </li>
          <li>Only those specific changes are applied to the actual DOM</li>
        </ol>
      </div>
    </div>
  );
};

export default Visualizer;
