# Greenline SaaS Development Server Launcher
# Run this script to start both the API and Web servers

Write-Host "Starting Greenline SaaS Development Servers..." -ForegroundColor Green
Write-Host ""

# Set Node.js PATH
$env:PATH = "C:\nvm4w\nodejs;$env:PATH"

# Get the script directory
$rootDir = Split-Path -Parent $PSCommandPath

Write-Host "Project Directory: $rootDir" -ForegroundColor Cyan
Write-Host ""

# Start API server in new window
Write-Host "Starting API Server (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; `$env:PATH = 'C:\nvm4w\nodejs;`$env:PATH'; npm --workspace @greenline/api run dev"

# Wait a moment for API to start
Start-Sleep -Seconds 2

# Start Web server in new window
Write-Host "Starting Web Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; `$env:PATH = 'C:\nvm4w\nodejs;`$env:PATH'; npm --workspace @greenline/web run dev"

Write-Host ""
Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Server URLs:" -ForegroundColor Cyan
Write-Host "   API:  http://localhost:4000" -ForegroundColor White
Write-Host "   Web:  http://localhost:5173/Greenline-SaaS-v2/" -ForegroundColor White
Write-Host ""
Write-Host "Tip: Keep those terminal windows open while developing!" -ForegroundColor Yellow
Write-Host "     Press Ctrl+C in each window to stop the servers when done." -ForegroundColor Yellow
Write-Host ""

# Wait for user confirmation
Read-Host "Press Enter to close this window"
