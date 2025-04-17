import React from "react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
                <path d="M3 15h10" />
                <path d="M3 11h10" />
                <path d="M3 7h2" />
                <path d="M17 11l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                React Mini-DOM <span className="text-primary">Visualizer</span>
              </h1>
              <p className="text-xs text-gray-500">
                Explore React's virtual DOM and diffing algorithm
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Documentation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </a>

            <a
              href="https://github.com/your-username/react-mini-dom-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.1.83-.26.83-.57 0-.28 0-1.03-.02-2.03-3.33.72-4.03-1.6-4.03-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.5 1 .1-.8.42-1.33.76-1.63-2.66-.3-5.46-1.33-5.46-5.93 0-1.3.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.02-.33 3.34 1.25.97-.27 2-.4 3.03-.4 1.03 0 2.06.14 3.03.4 2.32-1.57 3.33-1.25 3.33-1.25.66 1.65.24 2.87.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.23 0 1.6-.02 2.9-.02 3.3 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
            </a>

            <button className="btn btn-outline text-sm px-3 py-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
