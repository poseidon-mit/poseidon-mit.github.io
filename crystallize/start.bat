@echo off
echo Starting Crystallize...
echo Opening http://localhost:5199
echo Press Ctrl+C to stop
cd /d "%~dp0dist"
start http://localhost:5199
python -m http.server 5199
