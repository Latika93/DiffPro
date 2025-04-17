import React, { useContext, useState } from "react";
import { DiffContext } from "../context/DiffContext";

type DiffNodeProps = {
  node: any;
  depth?: number;
  showLineNumbers: boolean;
  highlightSyntax: boolean;
};

const DiffNode: React.FC<DiffNodeProps> = ({
  node,
  depth = 0,
  showLineNumbers,
  highlightSyntax,
}) => {
  if (!node) return null;

  const getNodeStyle = () => {
    if (node.added)
      return "bg-green-100 text-green-900 border-l-4 border-green-500";
    if (node.removed)
      return "bg-red-100 text-red-900 border-l-4 border-red-500";
    return "";
  };

  const getLineNumberStyle = () => {
    if (node.added) return "bg-green-200 text-green-800";
    if (node.removed) return "bg-red-200 text-red-800";
    return "bg-slate-100 text-slate-600";
  };

  // For text nodes that have content
  if (node.content !== undefined && !node.children) {
    return (
      <div className={`flex w-full ${getNodeStyle()}`}>
        {showLineNumbers && (
          <div
            className={`w-12 flex-shrink-0 text-xs text-right pr-2 py-1 font-mono ${getLineNumberStyle()}`}
          >
            {node.lineNumber || ""}
          </div>
        )}
        <pre
          className={`py-1 px-4 overflow-x-auto font-mono text-sm whitespace-pre-wrap flex-1 ${
            highlightSyntax ? "syntax-highlight" : ""
          }`}
        >
          {node.content}
        </pre>
      </div>
    );
  }

  // For elements/containers that have children
  return (
    <div className={`w-full ${getNodeStyle()}`}>
      {node.tagName && (
        <div className="flex">
          {showLineNumbers && (
            <div
              className={`w-12 flex-shrink-0 text-xs text-right pr-2 py-1 font-mono ${getLineNumberStyle()}`}
            >
              {node.lineNumber || ""}
            </div>
          )}
          <div className="py-1 px-4 font-mono text-sm flex-1">
            {node.added && <span className="text-green-600 mr-1">+</span>}
            {node.removed && <span className="text-red-600 mr-1">-</span>}
            {node.tagName}
          </div>
        </div>
      )}

      {node.children &&
        node.children.map((child: any, index: number) => (
          <div key={index} className={`${depth > 0 ? "ml-4" : ""}`}>
            <DiffNode
              node={child}
              depth={depth + 1}
              showLineNumbers={showLineNumbers}
              highlightSyntax={highlightSyntax}
            />
          </div>
        ))}
    </div>
  );
};

const DiffViewer: React.FC = () => {
  const { parsedDiff, leftContent, rightContent, settings, saveDiffToHistory } =
    useContext(DiffContext);
  const [showSaveDiffModal, setShowSaveDiffModal] = useState(false);
  const [diffTitle, setDiffTitle] = useState("");
  const [leftFileName, setLeftFileName] = useState("file1.txt");
  const [rightFileName, setRightFileName] = useState("file2.txt");
  const [viewMode, setViewMode] = useState<"unified" | "sideBySide">("unified");

  if (!leftContent && !rightContent) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No Content to Compare
          </h3>
          <p className="text-slate-500">
            Upload files or paste content on both sides to see the diff.
          </p>
        </div>
      </div>
    );
  }

  if (!parsedDiff) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Processing comparison...</p>
        </div>
      </div>
    );
  }

  const handleSaveDiff = () => {
    if (diffTitle) {
      saveDiffToHistory(diffTitle, leftFileName, rightFileName);
      setShowSaveDiffModal(false);
      setDiffTitle("");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Diff Result
            </h3>
            <div className="flex gap-2">
              <div className="flex">
                <button
                  className={`px-3 py-1 text-xs rounded ${
                    viewMode === "unified"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                  onClick={() => setViewMode("unified")}
                >
                  Unified
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded ${
                    viewMode === "sideBySide"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                  onClick={() => setViewMode("sideBySide")}
                >
                  Side by Side
                </button>
              </div>
              <button
                onClick={() => setShowSaveDiffModal(true)}
                className="ml-2 px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                Save Diff
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {viewMode === "unified" ? (
              <DiffNode
                node={parsedDiff}
                showLineNumbers={settings.showLineNumbers}
                highlightSyntax={settings.highlightSyntax}
              />
            ) : (
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div>
                  <div className="text-center py-2 bg-slate-100 border-b border-slate-200 font-medium text-slate-700">
                    Original
                  </div>
                  <div>
                    {/* Side by side view would need more implementation */}
                    <pre className="p-4 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                      {leftContent}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="text-center py-2 bg-slate-100 border-b border-slate-200 font-medium text-slate-700">
                    Modified
                  </div>
                  <div>
                    <pre className="p-4 overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                      {rightContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Diff Modal */}
      {showSaveDiffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Save Diff
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="diff-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="diff-title"
                  value={diffTitle}
                  onChange={(e) => setDiffTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter a title for this diff"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="left-filename"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Original Filename
                  </label>
                  <input
                    type="text"
                    id="left-filename"
                    value={leftFileName}
                    onChange={(e) => setLeftFileName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="right-filename"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modified Filename
                  </label>
                  <input
                    type="text"
                    id="right-filename"
                    value={rightFileName}
                    onChange={(e) => setRightFileName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSaveDiffModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDiff}
                disabled={!diffTitle}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  diffTitle
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiffViewer;
