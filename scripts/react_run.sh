#!/bin/bash

# Check if the client directory exists
if [[ ! -d "../client" ]]; then
  echo "Error: Cannot navigate to directory."
  exit 1
fi

# Navigate to the client directory
cd ../client || { echo "Error: Could not change to client directory"; exit 1; }

# Check if node_modules exist to confirm dependencies are installed
if [[ ! -d "node_modules" ]]; then
  echo "Error: Dependencies not installed. Run 'npm install' first."
  exit 1
fi

# Start the React development server
npm run dev || { echo "Error: Failed to start React server"; exit 1; }
