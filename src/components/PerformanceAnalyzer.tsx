import React, { useState, useCallback, useMemo } from "react";

// Mock component for demonstration
const ExpensiveComponent: React.FC<{
  name: string;
  complexity: number;
  optimized?: boolean;
}> = ({ name, complexity, optimized = false }) => {
  // Force component to re-render and take some time
  const startTime = performance.now();

  // Simulate expensive computation based on complexity
  const expensiveComputation = () => {
    let result = 0;
    for (let i = 0; i < complexity * 100000; i++) {
      result += Math.random();
    }
    return result;
  };

  // Only run the expensive computation if not optimized or on first render
  const result = optimized
    ? useMemo(() => expensiveComputation(), [complexity])
    : expensiveComputation();

  const renderTime = (performance.now() - startTime).toFixed(2);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {optimized ? "Optimized" : "Unoptimized"}
        </span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Complexity: {complexity}</span>
        <span>•</span>
        <span>
          Render time:{" "}
          <span className="font-mono font-medium">{renderTime}ms</span>
        </span>
      </div>
      <div className="mt-3 text-sm text-gray-700">
        Result hash: {Math.abs(result).toString().substring(0, 8)}
      </div>
    </div>
  );
};

// Optimized version using React.memo
const MemoizedComponent = React.memo(
  ({
    name,
    count,
    onIncrement,
  }: {
    name: string;
    count: number;
    onIncrement: () => void;
  }) => {
    console.log(`Rendering ${name}`);
    const renderCount = React.useRef(0);
    renderCount.current += 1;

    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Memoized
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500">
            <span>Count: {count}</span>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            Render count:{" "}
            <span className="font-mono">{renderCount.current}</span>
          </div>
          <button
            onClick={onIncrement}
            className="mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm transition-colors"
          >
            Increment
          </button>
        </div>
      </div>
    );
  }
);

// Non-optimized version for comparison
const RegularComponent = ({
  name,
  count,
  onIncrement,
}: {
  name: string;
  count: number;
  onIncrement: () => void;
}) => {
  console.log(`Rendering ${name}`);
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Regular
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-500">
          <span>Count: {count}</span>
        </div>
        <div className="text-sm font-semibold text-gray-700">
          Render count: <span className="font-mono">{renderCount.current}</span>
        </div>
        <button
          onClick={onIncrement}
          className="mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm transition-colors"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

const PerformanceAnalyzer: React.FC = () => {
  const [complexity, setComplexity] = useState(1);
  const [memoizedCount, setMemoizedCount] = useState(0);
  const [regularCount, setRegularCount] = useState(0);
  const [globalCount, setGlobalCount] = useState(0);
  const [showOptimized, setShowOptimized] = useState(true);

  // This function will be recreated on every render
  const regularIncrementHandler = () => {
    setRegularCount(regularCount + 1);
  };

  // This function will only be recreated when regularCount changes
  const memoizedIncrementHandler = useCallback(() => {
    setMemoizedCount(memoizedCount + 1);
  }, [memoizedCount]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Performance Optimization Techniques
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Visualize how React's optimization techniques can improve your
            application's performance
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setGlobalCount(globalCount + 1)}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition-colors hover:bg-primary-dark"
            >
              Force Global Re-render
            </button>
            <div className="text-sm text-gray-600">
              Global render count:{" "}
              <span className="font-mono font-medium">{globalCount}</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                React.memo Comparison
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Compare how React.memo prevents unnecessary re-renders when
                props don't change
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemoizedComponent
                  name="Memoized Component"
                  count={memoizedCount}
                  onIncrement={memoizedIncrementHandler}
                />
                <RegularComponent
                  name="Regular Component"
                  count={regularCount}
                  onIncrement={regularIncrementHandler}
                />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                useMemo Performance
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                See how useMemo can optimize expensive calculations
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">
                    Computation Complexity:
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={complexity}
                    onChange={(e) => setComplexity(Number(e.target.value))}
                    className="w-48 accent-primary"
                  />
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {complexity}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={showOptimized}
                      onChange={() => setShowOptimized(!showOptimized)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Show optimized version
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExpensiveComponent
                    name="Standard Calculation"
                    complexity={complexity}
                    optimized={false}
                  />
                  {showOptimized && (
                    <ExpensiveComponent
                      name="Memoized Calculation"
                      complexity={complexity}
                      optimized={true}
                    />
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Performance Tips
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                When to use React.memo
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use for pure functional components that render often with the
                  same props
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Beneficial for components that are expensive to render
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Avoid for components that almost always receive different
                  props
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-md font-medium text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Optimization Hooks
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                    useMemo
                  </span>
                  Memoize expensive calculations to avoid recomputing on every
                  render
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                    useCallback
                  </span>
                  Memoize event handlers to maintain referential equality
                  between renders
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                    useTransition
                  </span>
                  Mark state updates as non-urgent to keep the interface
                  responsive
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;
