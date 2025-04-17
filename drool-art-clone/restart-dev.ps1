# Script for restarting Next.js development server with clean cache
# This script cleans the cache and restarts the development server

# Set location to the project root
Set-Location -Path "D:\preludastvar\drool-art-clone"

# Display current directory for verification
Write-Host "Current directory:" (Get-Location).Path
Write-Host "Cleaning Next.js and Node.js cache..."

# Remove Next.js cache directories
if (Test-Path -Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Removed .next directory"
}

if (Test-Path -Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force
    Write-Host "Removed node_modules\.cache directory"
}

Write-Host "Starting development server with clean cache..."

# Run the development server without Turbopack (faster and more stable)
npm run fastdev

# Keep the console window open after command finishes
Write-Host "Server stopped. Press any key to exit."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 