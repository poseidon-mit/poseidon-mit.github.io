#!/bin/bash
cd "$(dirname "$0")/dist"
echo "🔮 Starting Crystallize..."
echo "   Opening http://localhost:5199"
echo "   Press Ctrl+C to stop"
echo ""

# Try to open browser automatically
if command -v open &> /dev/null; then
  open "http://localhost:5199" &
elif command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:5199" &
fi

python3 -m http.server 5199
