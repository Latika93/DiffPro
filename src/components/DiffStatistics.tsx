import React, { useContext } from "react";
import { DiffContext } from "../context/DiffContext";

const DiffStatistics: React.FC = () => {
  const { leftContent, rightContent, parsedDiff } = useContext(DiffContext);

  // Calculate statistics based on the diff
  const getTotalChanges = () => {
    if (!parsedDiff) return { added: 0, removed: 0, unchanged: 0 };

    let added = 0;
    let removed = 0;
    let unchanged = 0;

    const countChanges = (node: any) => {
      if (node.added) added++;
      else if (node.removed) removed++;
      else if (!node.children || node.children.length === 0) unchanged++;

      if (node.children) {
        node.children.forEach(countChanges);
      }
    };

    if (parsedDiff) {
      countChanges(parsedDiff);
    }

    return { added, removed, unchanged };
  };

  const { added, removed, unchanged } = getTotalChanges();
  const totalChanges = added + removed;
  const changePercentage =
    totalChanges > 0
      ? Math.round((totalChanges / (totalChanges + unchanged)) * 100)
      : 0;

  // Get the file sizes in KB
  const leftSize = leftContent
    ? (new Blob([leftContent]).size / 1024).toFixed(2)
    : 0;
  const rightSize = rightContent
    ? (new Blob([rightContent]).size / 1024).toFixed(2)
    : 0;

  // Calculate size difference
  const sizeDiff = rightSize - leftSize;
  const sizeDiffPercentage =
    leftSize > 0
      ? Math.round((sizeDiff / parseFloat(leftSize as string)) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Diff Statistics
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-md">
          <div className="text-sm text-slate-500">Changes</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {totalChanges}
            </span>
            <span className="text-sm text-slate-500">
              lines ({changePercentage}%)
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-md">
          <div className="text-sm text-slate-500">File Size</div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {rightSize} KB
            </span>
            <span
              className={`text-sm ${
                sizeDiff >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {sizeDiff > 0 ? "+" : ""}
              {sizeDiff.toFixed(2)} KB
            </span>
          </div>
        </div>
      </div>

      <div className="flex mb-3">
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="flex h-2.5 rounded-full">
            <div
              className="bg-green-500 h-2.5 rounded-l-full"
              style={{
                width: `${(added / (added + removed + unchanged)) * 100}%`,
              }}
            ></div>
            <div
              className="bg-red-500 h-2.5"
              style={{
                width: `${(removed / (added + removed + unchanged)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-slate-700">Added</span>
          </div>
          <div className="font-semibold text-slate-900">{added}</div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-slate-700">Removed</span>
          </div>
          <div className="font-semibold text-slate-900">{removed}</div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-3 h-3 bg-slate-300 rounded-full"></span>
            <span className="text-slate-700">Unchanged</span>
          </div>
          <div className="font-semibold text-slate-900">{unchanged}</div>
        </div>
      </div>
    </div>
  );
};

export default DiffStatistics;
