import React from "react";
import { useDiff } from "../context/DiffContext";

const DiffSummary: React.FC = () => {
  const { diffSummary } = useDiff();

  if (!diffSummary) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Diff Summary</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No diff available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Compare two files to see a difference summary
          </p>
        </div>
      </div>
    );
  }

  const getTotalChanges = () => {
    return (
      diffSummary.additions + diffSummary.deletions + diffSummary.modifications
    );
  };

  const renderStatCard = (
    title: string,
    value: number,
    color: string,
    icon: React.ReactNode
  ) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <div className={`p-4 ${color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgressBar = (value: number, total: number, color: string) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
      <div className="relative pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xs font-semibold inline-block ${color}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color}`}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Diff Summary</h2>
        <p className="mt-1 text-sm text-gray-600">
          Statistics about the changes between the files
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {renderStatCard(
            "Additions",
            diffSummary.additions,
            "text-green-700",
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {renderStatCard(
            "Deletions",
            diffSummary.deletions,
            "text-red-700",
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {renderStatCard(
            "Modifications",
            diffSummary.modifications,
            "text-yellow-700",
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-base font-medium text-gray-800">
            Change Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 inline-block mr-1.5 bg-green-700 rounded-sm"></span>
                  Additions
                </span>
              </div>
              {renderProgressBar(
                diffSummary.additions,
                getTotalChanges(),
                "bg-green-700"
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 inline-block mr-1.5 bg-red-700 rounded-sm"></span>
                  Deletions
                </span>
              </div>
              {renderProgressBar(
                diffSummary.deletions,
                getTotalChanges(),
                "bg-red-700"
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-3 h-3 inline-block mr-1.5 bg-yellow-700 rounded-sm"></span>
                  Modifications
                </span>
              </div>
              {renderProgressBar(
                diffSummary.modifications,
                getTotalChanges(),
                "bg-yellow-700"
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Total Changes
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getTotalChanges()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Compared Files
              </dt>
              <dd className="mt-1 text-sm text-gray-900">2</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Change Percentage
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {diffSummary.changePercentage.toFixed(2)}%
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date().toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DiffSummary;
