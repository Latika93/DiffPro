# React Mini-DOM Visualizer

A tool that helps users see how React's Virtual DOM works, and how changes are efficiently reconciled using the diffing algorithm.

## Features

- Enter JSX code for before and after states
- See a visual representation of the virtual DOM trees
- Highlight what parts will be updated, removed, or created
- Learn how React's reconciliation works
- View side-by-side comparison or unified diff view

## Why It Matters

Understanding React's diffing algorithm is crucial for:

- Writing performant React applications
- Understanding the importance of keys in lists
- Learning about reconciliation and the virtual DOM
- Optimizing renders with React.memo, useMemo, and useCallback

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/react-mini-dom-visualizer.git
cd react-mini-dom-visualizer
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How It Works

1. Enter your JSX in both the "before" and "after" editors
2. Click "Compute Diff" to generate the comparison
3. React parses the JSX into virtual DOM trees
4. The algorithm identifies nodes that were added, removed, updated, or unchanged
5. The visualization displays the results with color coding

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- htmlparser2 for parsing JSX/HTML
- diff for comparison algorithms

## License

MIT
