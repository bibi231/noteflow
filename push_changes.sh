#!/bin/bash
# Run this from the noteflow folder to push all changes
cd "$(dirname "$0")"
git add -A
git commit -m "Mobile responsive sidebar, remove Watch Demo, auth-aware landing nav"
git push origin main
