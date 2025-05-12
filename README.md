# Contract Document Renderer

A React application for rendering legal contract documents with dynamic mentions and structured formatting.

## Tech Stack

- React 18 (Vite)
- TailwindCSS

## Features

- Renders hierarchical legal document structures
- Handles properly numbered clauses with nesting
- Supports styled text (bold, italic, underline)
- Displays colored mentions for dynamic content
- Maintains consistent formatting of legal documents
- Supports mention IDs for future editing capabilities

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Toggle between sample documents:
   - Use the button in the top-right corner to switch between original contract data and test cases

## Project Structure

- `src/` - Source code
  - `components/` - React components for rendering
    - `ContractRenderer.jsx` - Main document processor
    - `NodeRenderer.jsx` - Node type rendering engine
    - `Mention.jsx` - Mention component for dynamic content
  - `context/` - React context providers
    - `ClauseContext.jsx` - Manages clause numbering
    - `MentionContext.jsx` - Handles mention values
  - `assets/` - JSON data files
    - `input.json` - Original contract document
    - `test.json` - Test cases for edge conditions

## Implementation Notes

- Mentions are identified by their `id` attribute
- Mentions with the same ID will display the same value throughout the document
- Clause numbering automatically handles nesting (1., 2., ... for top level; (a), (b), ... for nested)