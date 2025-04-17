import React, { useState } from "react";

type Item = {
  id: string;
  text: string;
  color: string;
};

const initialItems: Item[] = [
  { id: "1", text: "Item 1", color: "bg-blue-100" },
  { id: "2", text: "Item 2", color: "bg-green-100" },
  { id: "3", text: "Item 3", color: "bg-yellow-100" },
  { id: "4", text: "Item 4", color: "bg-purple-100" },
  { id: "5", text: "Item 5", color: "bg-pink-100" },
];

const ItemWithoutKey = React.memo(({ item }: { item: Item }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  console.log(`Rendered Item: ${item.text} (without key)`);

  return (
    <div
      className={`p-4 mb-2 rounded-md ${item.color} ${
        isHighlighted ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => setIsHighlighted(!isHighlighted)}
    >
      <div className="flex justify-between items-center">
        <span>{item.text}</span>
        <span className="text-xs text-gray-500">Click to highlight</span>
      </div>
    </div>
  );
});

const ItemWithKey = React.memo(({ item }: { item: Item }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  console.log(`Rendered Item: ${item.text} (with key)`);

  return (
    <div
      className={`p-4 mb-2 rounded-md ${item.color} ${
        isHighlighted ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => setIsHighlighted(!isHighlighted)}
    >
      <div className="flex justify-between items-center">
        <span>{item.text}</span>
        <span className="text-xs text-gray-500">Click to highlight</span>
      </div>
    </div>
  );
});

const KeysDemo = () => {
  const [withoutKeyItems, setWithoutKeyItems] = useState<Item[]>([
    ...initialItems,
  ]);
  const [withKeyItems, setWithKeyItems] = useState<Item[]>([...initialItems]);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [renderCount, setRenderCount] = useState({
    withKeys: 0,
    withoutKeys: 0,
  });

  const addItem = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id: newId,
      text: `Item ${withKeyItems.length + 1}`,
      color: `bg-${
        ["blue", "green", "yellow", "purple", "pink"][
          Math.floor(Math.random() * 5)
        ]
      }-100`,
    };

    setWithKeyItems((prev) => [...prev, newItem]);
    setWithoutKeyItems((prev) => [...prev, newItem]);

    logOperation(`Added new item: ${newItem.text} (ID: ${newId})`);
    updateRenderCounts();
  };

  const removeItem = (index: number) => {
    const removedWithKey = withKeyItems[index];
    const removedWithoutKey = withoutKeyItems[index];

    setWithKeyItems((prev) => prev.filter((_, i) => i !== index));
    setWithoutKeyItems((prev) => prev.filter((_, i) => i !== index));

    logOperation(
      `Removed item at index ${index}: ${removedWithKey.text} (ID: ${removedWithKey.id})`
    );
    updateRenderCounts();
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    // Move in array with keys
    const newWithKeyItems = [...withKeyItems];
    const itemToMove = newWithKeyItems.splice(fromIndex, 1)[0];
    newWithKeyItems.splice(toIndex, 0, itemToMove);
    setWithKeyItems(newWithKeyItems);

    // Move in array without keys
    const newWithoutKeyItems = [...withoutKeyItems];
    const itemToMoveWithoutKey = newWithoutKeyItems.splice(fromIndex, 1)[0];
    newWithoutKeyItems.splice(toIndex, 0, itemToMoveWithoutKey);
    setWithoutKeyItems(newWithoutKeyItems);

    logOperation(
      `Moved item from index ${fromIndex} to ${toIndex}: ${itemToMove.text} (ID: ${itemToMove.id})`
    );
    updateRenderCounts();
  };

  const reverseItems = () => {
    setWithKeyItems((prev) => [...prev].reverse());
    setWithoutKeyItems((prev) => [...prev].reverse());

    logOperation("Reversed all items");
    updateRenderCounts();
  };

  const logOperation = (message: string) => {
    setOperationLog((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 9),
    ]);
  };

  const updateRenderCounts = () => {
    // In a real app, we would use a useEffect with a ref to track actual renders
    // This is a simplified simulation
    setRenderCount((prev) => ({
      withKeys: prev.withKeys + 1,
      withoutKeys: prev.withoutKeys + withoutKeyItems.length,
    }));
  };

  const resetDemo = () => {
    setWithKeyItems([...initialItems]);
    setWithoutKeyItems([...initialItems]);
    setOperationLog([]);
    setRenderCount({ withKeys: 0, withoutKeys: 0 });
    logOperation("Reset demo");
  };

  return (
    <div className="grid gap-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">React Keys Experiment</h2>
        <p className="text-gray-600 mb-6">
          This demo illustrates the importance of using proper keys in React
          lists. Compare how React handles updates differently when keys are
          used versus when they are not.
        </p>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="btn btn-primary" onClick={addItem}>
              Add Item
            </button>

            <button
              className="btn bg-red-500 hover:bg-red-600 text-white"
              onClick={() =>
                removeItem(Math.floor(Math.random() * withKeyItems.length))
              }
              disabled={withKeyItems.length === 0}
            >
              Remove Random Item
            </button>

            <button
              className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => {
                const fromIndex = Math.floor(
                  Math.random() * withKeyItems.length
                );
                let toIndex = Math.floor(Math.random() * withKeyItems.length);
                while (toIndex === fromIndex && withKeyItems.length > 1) {
                  toIndex = Math.floor(Math.random() * withKeyItems.length);
                }
                moveItem(fromIndex, toIndex);
              }}
              disabled={withKeyItems.length < 2}
            >
              Move Random Item
            </button>

            <button
              className="btn bg-purple-500 hover:bg-purple-600 text-white"
              onClick={reverseItems}
              disabled={withKeyItems.length < 2}
            >
              Reverse Items
            </button>

            <button
              className="btn bg-gray-500 hover:bg-gray-600 text-white"
              onClick={resetDemo}
            >
              Reset
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Render Count Comparison
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">With Keys</p>
                <p className="text-2xl font-bold text-green-600">
                  {renderCount.withKeys}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Without Keys</p>
                <p className="text-2xl font-bold text-red-600">
                  {renderCount.withoutKeys}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-4">With Key Prop</h3>
            <div className="border rounded-lg p-4 bg-white">
              {withKeyItems.map((item) => (
                <ItemWithKey key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-4">Without Key Prop</h3>
            <div className="border rounded-lg p-4 bg-white">
              {withoutKeyItems.map((item) => (
                <ItemWithoutKey item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Operation Log</h2>
        <div className="border rounded-lg p-4 bg-gray-50 font-mono text-sm h-48 overflow-auto">
          {operationLog.length === 0 ? (
            <p className="text-gray-400 italic">No operations performed yet</p>
          ) : (
            <ul className="space-y-1">
              {operationLog.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Understanding React Keys</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Why Keys Matter</h3>
            <p className="text-gray-600">
              Keys help React identify which items have changed, been added, or
              been removed. Keys should be given to the elements inside an array
              to give them a stable identity.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Without Keys</h3>
            <p className="text-gray-600">
              Without keys, React must re-render the entire list whenever it
              changes. It can't tell which items are new, which have moved, or
              which have been removed. This causes performance issues and can
              lead to unexpected behavior with stateful components.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">With Keys</h3>
            <p className="text-gray-600">
              With keys, React can identify each item in the list uniquely. It
              can preserve state across re-renders, reuse DOM elements, and
              efficiently update only what has changed. This improves
              performance and ensures correct behavior.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-700 mb-2">Best Practices</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>
                Use a unique, stable identifier as a key (like an ID from your
                data)
              </li>
              <li>
                Avoid using index as a key when the list can change (reordering,
                adding, removing items)
              </li>
              <li>
                Keys must be unique among siblings, but don't need to be
                globally unique
              </li>
              <li>
                Don't generate keys on the fly (e.g., with Math.random() or
                using new Date().getTime())
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeysDemo;
