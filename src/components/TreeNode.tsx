import React, { useState } from "react";

type NodeType = {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: NodeType[];
  data?: string;
  diffStatus?: "added" | "removed" | "updated" | "unchanged";
};

interface TreeNodeProps {
  node: NodeType;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const getNodeStatusClass = (status?: string) => {
    switch (status) {
      case "added":
        return "tree-node-added";
      case "removed":
        return "tree-node-removed";
      case "updated":
        return "tree-node-updated";
      case "unchanged":
      default:
        return "tree-node-unchanged";
    }
  };

  const getNodeStatusColor = (status?: string) => {
    switch (status) {
      case "added":
        return "text-green-700";
      case "removed":
        return "text-red-700";
      case "updated":
        return "text-yellow-700";
      case "unchanged":
      default:
        return "text-gray-700";
    }
  };

  const getNodeStatusIcon = (status?: string) => {
    switch (status) {
      case "added":
        return (
          <svg
            className="w-4 h-4 text-green-500 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "removed":
        return (
          <svg
            className="w-4 h-4 text-red-500 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "updated":
        return (
          <svg
            className="w-4 h-4 text-yellow-500 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const hasChildren = node.children && node.children.length > 0;
  const isTextNode = node.type === "text";

  // Handle text nodes differently
  if (isTextNode) {
    return (
      <div
        className={`ml-${level * 4} my-2 font-mono text-sm ${getNodeStatusColor(
          node.diffStatus
        )}`}
      >
        <span className="text-gray-400 select-none">"</span>
        {node.data}
        <span className="text-gray-400 select-none">"</span>
        {node.diffStatus &&
          node.diffStatus !== "unchanged" &&
          getNodeStatusIcon(node.diffStatus)}
      </div>
    );
  }

  return (
    <div className={`${level > 0 ? "ml-4" : ""} mb-2`}>
      <div
        className={`tree-node ${getNodeStatusClass(
          node.diffStatus
        )} ${getNodeStatusColor(node.diffStatus)} border-l-4`}
      >
        <div
          className="flex items-center cursor-pointer py-1 select-none"
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {hasChildren && (
            <span
              className="mr-1 inline-block w-4 h-4 text-gray-500 transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
          <span className="font-mono text-sm">
            <span className="text-gray-400 select-none">{"<"}</span>
            <span className="text-blue-600">{node.name || "unknown"}</span>
            {node.attribs && Object.keys(node.attribs).length > 0 && (
              <>
                {" "}
                {Object.entries(node.attribs).map(([key, value], index) => (
                  <span key={index}>
                    <span className="text-purple-600">{key}</span>
                    <span className="text-gray-400 select-none">=</span>
                    <span className="text-orange-600 select-none">"</span>
                    <span className="text-orange-600">{value}</span>
                    <span className="text-orange-600 select-none">"</span>{" "}
                  </span>
                ))}
              </>
            )}
            <span className="text-gray-400 select-none">
              {hasChildren ? ">" : " />"}
            </span>
          </span>

          {node.diffStatus &&
            node.diffStatus !== "unchanged" &&
            getNodeStatusIcon(node.diffStatus)}

          {hasChildren && (
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              {node.children?.length}{" "}
              {node.children?.length === 1 ? "child" : "children"}
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="pl-4 pt-0.5 border-l border-dashed border-gray-200 ml-2 mt-1">
            {node.children?.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}

        {isExpanded && hasChildren && (
          <div className="font-mono text-sm text-gray-500 mt-1 ml-5">
            <span className="text-gray-400 select-none">{"</"}</span>
            <span className="text-blue-600">{node.name}</span>
            <span className="text-gray-400 select-none">{">"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeNode;
