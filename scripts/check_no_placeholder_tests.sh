#!/bin/bash
# scripts/check_no_placeholder_tests.sh
# Verifies that exactly ZERO instances of test.todo or test.fails remain inside src/__tests__.
# This is a HARD GATE enforcement script.

set -e

# Search directory
TEST_DIR="src/__tests__"

# Ensure the directory exists
if [ ! -d "$TEST_DIR" ]; then
  echo "Error: Directory $TEST_DIR does not exist."
  exit 1
fi

echo "🕵️  Scanning for placeholder tests in $TEST_DIR..."
echo "  Patterns: test.todo | test.fails | expect(true).toBe(false) | expect('Implementation AI')"

# Search for blocked text (skip comments)
PLACEHOLDERS=$(grep -rnEv '^\s*//' "$TEST_DIR" | grep -E 'test\.todo|test\.fails|expect\(true\)\.toBe\(false\)|expect\(.Implementation AI.\)' || true)

if [ -n "$PLACEHOLDERS" ]; then
    echo "❌ FAILED: Found lingering placeholder assertions!"
    echo "These must be replaced by real DOM/Routing assertions before implementation can proceed."
    echo ""
    echo "$PLACEHOLDERS"
    exit 1
else
    echo "✅ PASSED: ZERO placeholder tests detected."
    exit 0
fi
