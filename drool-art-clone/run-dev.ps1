# Script for starting Next.js development server
# This script ensures that we're in the right directory before running the server

# Set location to the project root
Set-Location -Path "D:\preludastvar\drool-art-clone"

# Display current directory for verification
Write-Host "Current directory:" (Get-Location).Path
Write-Host "Starting development server..."

# Run the development server without Turbopack (faster and more stable)
npm run fastdev

# Keep the console window open after command finishes
Write-Host "Server stopped. Press any key to exit."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 