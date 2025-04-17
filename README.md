# DiffPro - Visual Diff Comparison Tool

An intuitive web application for comparing text and code files, displaying differences, and tracking history. Built with React, TypeScript, and Tailwind CSS.

## Features

- Upload or paste content to compare differences
- Intelligent file type detection with syntax highlighting
- Options to customize diff view (ignore whitespace, case, etc.)
- History tracking to save and restore previous comparisons
- Statistics about changes and file sizes
- Side-by-side and unified view modes

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

### Local Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Publish Directory: `build`

## Technologies Used

- React + TypeScript
- Tailwind CSS for styling
- Vite for build tool
- diff.js for comparison algorithm
- htmlparser2 for HTML parsing

## License

ISC
