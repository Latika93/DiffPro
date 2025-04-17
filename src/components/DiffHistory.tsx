import React, { useState } from "react";
import { useDiff, DiffHistoryItem } from "../context/DiffContext";

const DiffHistory: React.FC = () => {
  const {
    diffHistory,
    loadDiffFromHistory,
    deleteDiffFromHistory,
    clearHistory,
  } = useDiff();
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalChanges = (changes: {
    added: number;
    removed: number;
    unchanged: number;
  }) => {
    return changes.added + changes.removed;
  };

  const getChangeBadge = (changes: {
    added: number;
    removed: number;
    unchanged: number;
  }) => {
    const total = getTotalChanges(changes);
    if (total > 50) return "bg-red-100 text-red-800";
    if (total > 20) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRestore = (id: string) => {
    loadDiffFromHistory(id);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      deleteDiffFromHistory(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  // Filter history items based on search term
  const filteredHistory = diffHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leftFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rightFileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Diff History</h2>
        <p className="mt-1 text-sm text-slate-600">
          View and restore previous diff comparisons
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full rounded-md border-slate-300 pl-10 pr-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-4 w-4 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear History
              </button>
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                    >
                      Files
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                    >
                      Changes
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                        {item.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        {formatDate(item.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <span className="font-mono text-xs">
                          {item.leftFileName} → {item.rightFileName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getChangeBadge(
                            item.changes
                          )}`}
                        >
                          +{item.changes.added} / -{item.changes.removed}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => handleRestore(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className={`${
                            confirmDeleteId === item.id
                              ? "text-red-800 bg-red-100 px-2 py-1 rounded"
                              : "text-red-600 hover:text-red-900"
                          }`}
                        >
                          {confirmDeleteId === item.id
                            ? "Confirm Delete"
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                {searchTerm ? "No matching history found" : "No history found"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchTerm
                  ? "Try a different search term"
                  : "Start comparing files to build your history"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffHistory;
