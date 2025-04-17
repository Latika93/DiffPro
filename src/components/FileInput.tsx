import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useDiff } from "../context/DiffContext";

type FileInputProps = {
  side: "left" | "right";
  label: string;
  description: string;
};

// Function to detect the file type from the filename
const getFileType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Map of common file extensions to their types
  const extensionMap: Record<string, string> = {
    // Web
    html: "HTML",
    css: "CSS",
    js: "JavaScript",
    jsx: "React JSX",
    ts: "TypeScript",
    tsx: "React TSX",
    json: "JSON",
    // Programming languages
    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    cs: "C#",
    go: "Go",
    rb: "Ruby",
    php: "PHP",
    rs: "Rust",
    // Markup
    md: "Markdown",
    xml: "XML",
    yml: "YAML",
    yaml: "YAML",
    // Other
    txt: "Text",
    csv: "CSV",
    sh: "Shell Script",
    sql: "SQL",
  };

  return extensionMap[extension] || "Plain Text";
};

const FileInput: React.FC<FileInputProps> = ({ side, label, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { leftContent, rightContent, setLeftContent, setRightContent } =
    useDiff();
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("Plain Text");
  const [isDragging, setIsDragging] = useState(false);

  const content = side === "left" ? leftContent : rightContent;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(getFileType(file.name));

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (side === "left") {
        setLeftContent(content);
      } else {
        setRightContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (side === "left") {
      setLeftContent(content);
    } else {
      setRightContent(content);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(getFileType(file.name));

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (side === "left") {
        setLeftContent(content);
      } else {
        setRightContent(content);
      }
    };
    reader.readAsText(file);
  };

  const clearContent = () => {
    if (side === "left") {
      setLeftContent("");
    } else {
      setRightContent("");
    }
    setFileName("");
    setFileType("Plain Text");
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {label}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {description}
            </p>
          </div>
          {fileName && (
            <div className="text-sm text-gray-500 flex items-center gap-3">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {fileName}
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {fileType}
                </span>
              </div>
              <button
                onClick={clearContent}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-500"
                title="Clear content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div
            className={`border-2 border-dashed rounded-md px-6 pt-5 pb-6 ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-500"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex justify-center text-sm text-gray-600">
                <label
                  htmlFor={`file-upload-${side}`}
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id={`file-upload-${side}`}
                    name={`file-upload-${side}`}
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".txt,.md,.json,.js,.jsx,.ts,.tsx,.html,.css,.py,.java,.c,.cpp,.cs,.go,.rb,.php,.rs,.xml,.yml,.yaml,.csv,.sh,.sql"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Text files up to 10MB
                <span className="block mt-1">
                  Supported formats: HTML, CSS, JS, TS, JSON, Python, Java,
                  C/C++, and more
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor={`text-content-${side}`}
              className="block text-sm font-medium text-gray-700"
            >
              Or paste content directly
            </label>
            <div className="mt-1">
              <textarea
                id={`text-content-${side}`}
                name={`text-content-${side}`}
                rows={10}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                placeholder="Paste content here..."
                value={content}
                onChange={handleTextChange}
              ></textarea>
            </div>
            {content && !fileName && (
              <div className="mt-2 flex justify-end">
                <div className="inline-flex rounded-md">
                  <button
                    onClick={clearContent}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
