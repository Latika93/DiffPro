import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as htmlparser2 from "htmlparser2";
import * as diff from "diff";

type NodeType = {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: NodeType[];
  data?: string;
  diffStatus?: "added" | "removed" | "updated" | "unchanged";
  added?: boolean;
  removed?: boolean;
  content?: string;
  lineNumber?: number;
  tagName?: string;
};

export type DiffHistoryItem = {
  id: string;
  date: Date;
  title: string;
  leftFileName: string;
  rightFileName: string;
  leftContent: string;
  rightContent: string;
  changes: {
    added: number;
    removed: number;
    unchanged: number;
  };
};

export type DiffSettings = {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  contextLines: number;
  showLineNumbers: boolean;
  highlightSyntax: boolean;
};

interface DiffContextType {
  leftContent: string;
  rightContent: string;
  setLeftContent: (content: string) => void;
  setRightContent: (content: string) => void;
  beforeCode: string;
  afterCode: string;
  setBeforeCode: (code: string) => void;
  setAfterCode: (code: string) => void;
  beforeTree: NodeType[] | null;
  afterTree: NodeType[] | null;
  diffedTree: NodeType[] | null;
  parsedDiff: NodeType | null;
  computeDiff: () => void;
  isComputing: boolean;
  error: string | null;
  // History related
  diffHistory: DiffHistoryItem[];
  saveDiffToHistory: (
    title: string,
    leftFileName: string,
    rightFileName: string
  ) => void;
  loadDiffFromHistory: (id: string) => void;
  clearHistory: () => void;
  deleteDiffFromHistory: (id: string) => void;
  // Settings related
  settings: DiffSettings;
  updateSettings: (newSettings: Partial<DiffSettings>) => void;
  resetSettings: () => void;
}

const defaultExamples = {
  before: `<div className="container">
  <h1>Hello World</h1>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>`,
  after: `<div className="container">
  <h1>Hello React</h1>
  <ul>
    <li>Item 1</li>
    <li>Item 4</li>
    <li>Item 3</li>
    <li>Item 5</li>
  </ul>
</div>`,
};

const defaultSettings: DiffSettings = {
  ignoreWhitespace: false,
  ignoreCase: false,
  contextLines: 3,
  showLineNumbers: true,
  highlightSyntax: true,
};

// Create the context with default values
export const DiffContext = createContext<DiffContextType>({
  leftContent: "",
  rightContent: "",
  setLeftContent: () => {},
  setRightContent: () => {},
  beforeCode: "",
  afterCode: "",
  setBeforeCode: () => {},
  setAfterCode: () => {},
  beforeTree: null,
  afterTree: null,
  diffedTree: null,
  parsedDiff: null,
  computeDiff: () => {},
  isComputing: false,
  error: null,
  diffHistory: [],
  saveDiffToHistory: () => {},
  loadDiffFromHistory: () => {},
  clearHistory: () => {},
  deleteDiffFromHistory: () => {},
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

interface DiffProviderProps {
  children: ReactNode;
}

export const DiffProvider: React.FC<DiffProviderProps> = ({ children }) => {
  const [leftContent, setLeftContent] = useState<string>("");
  const [rightContent, setRightContent] = useState<string>("");
  const [beforeCode, setBeforeCode] = useState(defaultExamples.before);
  const [afterCode, setAfterCode] = useState(defaultExamples.after);
  const [beforeTree, setBeforeTree] = useState<NodeType[] | null>(null);
  const [afterTree, setAfterTree] = useState<NodeType[] | null>(null);
  const [diffedTree, setDiffedTree] = useState<NodeType[] | null>(null);
  const [parsedDiff, setParsedDiff] = useState<NodeType | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History state
  const [diffHistory, setDiffHistory] = useState<DiffHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem("diffHistory");
    if (savedHistory) {
      try {
        // Need to handle Date objects which are stored as strings in localStorage
        const parsedHistory = JSON.parse(savedHistory);
        return parsedHistory.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
      } catch (e) {
        console.error("Error parsing history from localStorage:", e);
        return [];
      }
    }
    return [];
  });

  // Settings state
  const [settings, setSettings] = useState<DiffSettings>(() => {
    const savedSettings = localStorage.getItem("diffSettings");
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Error parsing settings from localStorage:", e);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("diffSettings", JSON.stringify(settings));
  }, [settings]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("diffHistory", JSON.stringify(diffHistory));
  }, [diffHistory]);

  const parseHTML = (html: string): NodeType[] => {
    try {
      const dom = htmlparser2.parseDocument(html);
      return dom.children as NodeType[];
    } catch (err) {
      setError(`Failed to parse HTML: ${err}`);
      return [];
    }
  };

  const compareNodes = (
    before: NodeType,
    after: NodeType
  ): "updated" | "unchanged" => {
    // Check if node name or type changed
    if (before.name !== after.name || before.type !== after.type) {
      return "updated";
    }

    // Check if attributes changed
    const beforeAttrs = before.attribs || {};
    const afterAttrs = after.attribs || {};
    const beforeAttrKeys = Object.keys(beforeAttrs);
    const afterAttrKeys = Object.keys(afterAttrs);

    if (beforeAttrKeys.length !== afterAttrKeys.length) {
      return "updated";
    }

    for (const key of beforeAttrKeys) {
      if (beforeAttrs[key] !== afterAttrs[key]) {
        return "updated";
      }
    }

    // Check if text content changed
    if (before.data !== after.data) {
      return "updated";
    }

    return "unchanged";
  };

  const diffTrees = (
    beforeNodes: NodeType[],
    afterNodes: NodeType[]
  ): NodeType[] => {
    const result: NodeType[] = [];

    // Create a map of nodes by key (using index as fallback)
    const beforeMap = new Map<string, NodeType>();
    const afterMap = new Map<string, NodeType>();

    beforeNodes.forEach((node, index) => {
      const key = node.attribs?.key || `index-${index}`;
      beforeMap.set(key, node);
    });

    afterNodes.forEach((node, index) => {
      const key = node.attribs?.key || `index-${index}`;
      afterMap.set(key, node);
    });

    // Find all unique keys
    const allKeys = new Set([...beforeMap.keys(), ...afterMap.keys()]);

    // Process each node
    for (const key of allKeys) {
      const beforeNode = beforeMap.get(key);
      const afterNode = afterMap.get(key);

      if (beforeNode && afterNode) {
        // Node exists in both trees
        const diffStatus = compareNodes(beforeNode, afterNode);
        const newNode = { ...afterNode, diffStatus };

        // Recursively diff children if they exist
        if (beforeNode.children && afterNode.children) {
          newNode.children = diffTrees(beforeNode.children, afterNode.children);
        }

        result.push(newNode);
      } else if (beforeNode) {
        // Node was removed
        result.push({ ...beforeNode, diffStatus: "removed" });
      } else if (afterNode) {
        // Node was added
        result.push({ ...afterNode, diffStatus: "added" });
      }
    }

    return result;
  };

  const getTotalChanges = (diffNode: NodeType | null) => {
    if (!diffNode) return { added: 0, removed: 0, unchanged: 0 };

    let added = 0;
    let removed = 0;
    let unchanged = 0;

    const countChanges = (node: NodeType) => {
      if (node.added) added++;
      else if (node.removed) removed++;
      else if (!node.children || node.children.length === 0) unchanged++;

      if (node.children) {
        node.children.forEach(countChanges);
      }
    };

    countChanges(diffNode);
    return { added, removed, unchanged };
  };

  const computeDiff = () => {
    setIsComputing(true);
    setError(null);

    try {
      const beforeDom = parseHTML(beforeCode);
      const afterDom = parseHTML(afterCode);

      setBeforeTree(beforeDom);
      setAfterTree(afterDom);

      const diffResult = diffTrees(beforeDom, afterDom);
      setDiffedTree(diffResult);

      // Apply settings to diff
      let leftProcessed = leftContent;
      let rightProcessed = rightContent;

      // Apply ignore whitespace setting
      if (settings.ignoreWhitespace) {
        leftProcessed = leftProcessed.replace(/\s+/g, " ").trim();
        rightProcessed = rightProcessed.replace(/\s+/g, " ").trim();
      }

      // Apply ignore case setting
      if (settings.ignoreCase) {
        leftProcessed = leftProcessed.toLowerCase();
        rightProcessed = rightProcessed.toLowerCase();
      }

      // Process line-based diff for the DiffViewer component
      if (leftProcessed && rightProcessed) {
        const lineBasedDiff = processLineBasedDiff(
          leftProcessed,
          rightProcessed
        );
        setParsedDiff(lineBasedDiff);
      } else if (beforeCode && afterCode) {
        let beforeProcessed = beforeCode;
        let afterProcessed = afterCode;

        if (settings.ignoreWhitespace) {
          beforeProcessed = beforeProcessed.replace(/\s+/g, " ").trim();
          afterProcessed = afterProcessed.replace(/\s+/g, " ").trim();
        }

        if (settings.ignoreCase) {
          beforeProcessed = beforeProcessed.toLowerCase();
          afterProcessed = afterProcessed.toLowerCase();
        }

        const lineBasedDiff = processLineBasedDiff(
          beforeProcessed,
          afterProcessed
        );
        setParsedDiff(lineBasedDiff);
      }
    } catch (err) {
      setError(`Error computing diff: ${err}`);
    } finally {
      setIsComputing(false);
    }
  };

  // Process text-based diffs line by line for the DiffViewer
  const processLineBasedDiff = (left: string, right: string): NodeType => {
    const diffOptions: diff.BaseOptions = {};

    // Apply our settings to the diff options
    if (settings.ignoreWhitespace) {
      diffOptions.ignoreWhitespace = true;
    }
    if (settings.ignoreCase) {
      diffOptions.ignoreCase = true;
    }

    const changes = diff.diffLines(left, right, diffOptions);

    const rootNode: NodeType = {
      type: "root",
      children: [],
    };

    let currentLineNumber = 1;
    let contextBuffer: NodeType[] = [];
    let lastChangeType: "added" | "removed" | "unchanged" | null = null;

    const addNodeWithContext = (
      node: NodeType,
      changeType: "added" | "removed" | "unchanged"
    ) => {
      // If this is an unchanged line, add it to context buffer
      if (changeType === "unchanged") {
        contextBuffer.push(node);
        if (contextBuffer.length > settings.contextLines) {
          contextBuffer.shift(); // Keep only the last N context lines
        }
        return;
      }

      // If this is a change (added/removed) and we have a different type of change previously,
      // add the context buffer first
      if (
        lastChangeType !== null &&
        lastChangeType !== changeType &&
        contextBuffer.length > 0
      ) {
        rootNode.children?.push(...contextBuffer);
        contextBuffer = [];
      }

      // Add the actual changed node
      rootNode.children?.push(node);
      lastChangeType = changeType;
    };

    changes.forEach((change) => {
      const lines = change.value.split("\n");
      // Remove last empty line if it exists (common when splitting on \n)
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      lines.forEach((line) => {
        const lineNode: NodeType = {
          type: "line",
          content: line,
          lineNumber: settings.showLineNumbers ? currentLineNumber : undefined,
          added: change.added,
          removed: change.removed,
        };

        if (change.added) {
          addNodeWithContext(lineNode, "added");
        } else if (change.removed) {
          addNodeWithContext(lineNode, "removed");
        } else {
          addNodeWithContext(lineNode, "unchanged");
        }

        if (!change.removed) {
          currentLineNumber++;
        }
      });
    });

    // Add any remaining context lines
    if (contextBuffer.length > 0) {
      rootNode.children?.push(...contextBuffer);
    }

    return rootNode;
  };

  // History management functions
  const saveDiffToHistory = (
    title: string,
    leftFileName: string,
    rightFileName: string
  ) => {
    if (!leftContent || !rightContent) return;

    const newHistoryItem: DiffHistoryItem = {
      id: Date.now().toString(),
      date: new Date(),
      title,
      leftFileName,
      rightFileName,
      leftContent,
      rightContent,
      changes: getTotalChanges(parsedDiff),
    };

    setDiffHistory((prev) => [newHistoryItem, ...prev]);
  };

  const loadDiffFromHistory = (id: string) => {
    const historyItem = diffHistory.find((item) => item.id === id);
    if (!historyItem) return;

    setLeftContent(historyItem.leftContent);
    setRightContent(historyItem.rightContent);

    // Recompute diff with the loaded content
    setTimeout(() => {
      const lineBasedDiff = processLineBasedDiff(
        historyItem.leftContent,
        historyItem.rightContent
      );
      setParsedDiff(lineBasedDiff);
    }, 0);
  };

  const deleteDiffFromHistory = (id: string) => {
    setDiffHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setDiffHistory([]);
    }
  };

  // Settings management functions
  const updateSettings = (newSettings: Partial<DiffSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Update leftContent and rightContent and trigger a diff computation
  const setLeftContentAndDiff = (content: string) => {
    setLeftContent(content);
    if (content && rightContent) {
      setTimeout(() => {
        let leftProcessed = content;
        let rightProcessed = rightContent;

        if (settings.ignoreWhitespace) {
          leftProcessed = leftProcessed.replace(/\s+/g, " ").trim();
          rightProcessed = rightProcessed.replace(/\s+/g, " ").trim();
        }

        if (settings.ignoreCase) {
          leftProcessed = leftProcessed.toLowerCase();
          rightProcessed = rightProcessed.toLowerCase();
        }

        const lineBasedDiff = processLineBasedDiff(
          leftProcessed,
          rightProcessed
        );
        setParsedDiff(lineBasedDiff);
      }, 0);
    }
  };

  const setRightContentAndDiff = (content: string) => {
    setRightContent(content);
    if (leftContent && content) {
      setTimeout(() => {
        let leftProcessed = leftContent;
        let rightProcessed = content;

        if (settings.ignoreWhitespace) {
          leftProcessed = leftProcessed.replace(/\s+/g, " ").trim();
          rightProcessed = rightProcessed.replace(/\s+/g, " ").trim();
        }

        if (settings.ignoreCase) {
          leftProcessed = leftProcessed.toLowerCase();
          rightProcessed = rightProcessed.toLowerCase();
        }

        const lineBasedDiff = processLineBasedDiff(
          leftProcessed,
          rightProcessed
        );
        setParsedDiff(lineBasedDiff);
      }, 0);
    }
  };

  const value: DiffContextType = {
    leftContent,
    rightContent,
    setLeftContent: setLeftContentAndDiff,
    setRightContent: setRightContentAndDiff,
    beforeCode,
    afterCode,
    setBeforeCode,
    setAfterCode,
    beforeTree,
    afterTree,
    diffedTree,
    parsedDiff,
    computeDiff,
    isComputing,
    error,
    diffHistory,
    saveDiffToHistory,
    loadDiffFromHistory,
    clearHistory,
    deleteDiffFromHistory,
    settings,
    updateSettings,
    resetSettings,
  };

  return <DiffContext.Provider value={value}>{children}</DiffContext.Provider>;
};

export function useDiff() {
  const context = useContext(DiffContext);
  if (context === undefined) {
    throw new Error("useDiff must be used within a DiffProvider");
  }
  return context;
}
