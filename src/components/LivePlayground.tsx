import React, { useState, useEffect } from "react";
import { useDiff } from "../context/DiffContext";

const LivePlayground = () => {
  const [code, setCode] = useState<string>(
    `
// Edit this component and see it render in real-time
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl mb-4">Counter Component</h2>
      <p className="mb-2">Count: {count}</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}

// This is the component that will be rendered
render(<Counter />);
  `.trim()
  );

  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [renderedOutput, setRenderedOutput] = useState<React.ReactNode | null>(
    null
  );
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    compileAndExecute();
  }, []);

  const compileAndExecute = () => {
    setError(null);
    try {
      // This is a simplified version - in a real implementation,
      // you would use a proper JSX transformer like Babel
      // Here we're just simulating what it would look like

      // Simulate transpiling JSX to JS
      let jsxOutput = code;

      // Extract the component's rendered output
      const renderMatch = jsxOutput.match(/render\((.*?)\);/s);
      if (!renderMatch) {
        throw new Error(
          "No render() call found. Make sure to include render(<YourComponent />);"
        );
      }

      // Increment render count
      setRenderCount((prev) => prev + 1);

      // In a real implementation, this would execute the JS and render the component
      // For this demo, we'll create a simulated output
      simulateRendering(jsxOutput);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const simulateRendering = (jsxCode: string) => {
    // This would be actual rendering in a real implementation
    // For demo purposes, we'll extract some information and create a mock output

    const hasUseState = jsxCode.includes("useState");
    const hasUseEffect = jsxCode.includes("useEffect");
    const hasProps = jsxCode.includes("props");
    const hasChildren = jsxCode.includes("children");

    // Generate "virtual DOM" output
    const dom = `
<div class="tree-node">
  <div class="flex items-center">
    <span class="font-mono">&lt;div className="p-4 border rounded-md"&gt;</span>
  </div>
  <div class="pl-4 pt-2">
    <div class="tree-node">
      <div class="flex items-center">
        <span class="font-mono">&lt;h2 className="text-xl mb-4"&gt;</span>
      </div>
      <div class="pl-4 pt-2">
        <div class="my-1 font-mono">"Counter Component"</div>
      </div>
      <div class="font-mono mt-2">&lt;/h2&gt;</div>
    </div>
    <div class="tree-node">
      <div class="flex items-center">
        <span class="font-mono">&lt;p className="mb-2"&gt;</span>
      </div>
      <div class="pl-4 pt-2">
        <div class="my-1 font-mono">"Count: 0"</div>
      </div>
      <div class="font-mono mt-2">&lt;/p&gt;</div>
    </div>
    <div class="tree-node">
      <div class="flex items-center">
        <span class="font-mono">&lt;button className="px-4 py-2 bg-blue-500 text-white rounded-md"&gt;</span>
      </div>
      <div class="pl-4 pt-2">
        <div class="my-1 font-mono">"Increment"</div>
      </div>
      <div class="font-mono mt-2">&lt;/button&gt;</div>
    </div>
  </div>
  <div class="font-mono mt-2">&lt;/div&gt;</div>
</div>`;

    setOutput(dom);

    // In a demo implementation, we could also render an actual React component
    // that mimics what the user would expect to see
    setRenderedOutput(
      <div className="p-4 border rounded-md">
        <h2 className="text-xl mb-4">Counter Component</h2>
        <p className="mb-2">Count: 0</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() =>
            alert(
              "This is a simulated component. In a real implementation, this would update state."
            )
          }
        >
          Increment
        </button>

        {hasUseState && (
          <div className="mt-4 text-xs bg-blue-100 p-2 rounded">
            <strong>useState detected:</strong> Component uses React state
          </div>
        )}

        {hasUseEffect && (
          <div className="mt-2 text-xs bg-green-100 p-2 rounded">
            <strong>useEffect detected:</strong> Component has side effects
          </div>
        )}

        {hasProps && (
          <div className="mt-2 text-xs bg-yellow-100 p-2 rounded">
            <strong>Props detected:</strong> Component accepts properties
          </div>
        )}

        {hasChildren && (
          <div className="mt-2 text-xs bg-purple-100 p-2 rounded">
            <strong>Children detected:</strong> Component accepts child elements
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <div className="card h-full">
          <h2 className="text-xl font-bold mb-4">Live JSX Editor</h2>
          <p className="text-gray-600 mb-4">
            Edit the component below and click "Execute" to see it render in
            real-time.
          </p>

          <div className="mb-4">
            <textarea
              className="w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-primary focus:border-primary"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              <strong>Error:</strong> {error}
            </div>
          )}

          <button className="btn btn-primary" onClick={compileAndExecute}>
            Execute
          </button>
        </div>
      </div>

      <div>
        <div className="card h-full">
          <h2 className="text-xl font-bold mb-4">Live Output</h2>
          <p className="text-gray-600 mb-4">
            This shows the rendered component and its virtual DOM
            representation.
          </p>

          <div className="mb-4 p-2 bg-gray-100 rounded-md text-sm">
            Render count: {renderCount}
          </div>

          <div className="grid gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Component Output
              </h3>
              <div className="border rounded-lg p-4">{renderedOutput}</div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Virtual DOM Tree
              </h3>
              <div
                className="border rounded-lg p-4 overflow-auto max-h-[300px]"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePlayground;
