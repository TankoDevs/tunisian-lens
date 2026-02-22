@echo off
echo Starting Tunisian Lens development server and Cloudflare Tunnel...

:: Start the Vite dev server in a new window
start cmd /k "npm run dev"

:: Wait for the server to spin up
timeout /t 3 /nobreak > nul

:: Start Cloudflare Quick Tunnel
echo.
echo Generating your sharing link via Cloudflare...
npx cloudflared tunnel --url http://localhost:5173

