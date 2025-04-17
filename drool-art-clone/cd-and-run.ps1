# cd-and-run.ps1
param(
    [string]$Directory,
    [string]$Command
)

# Change to the specified directory
Set-Location -Path $Directory

# Execute the command
Invoke-Expression $Command

# Usage example:
# ./cd-and-run.ps1 -Directory "drool-art-clone" -Command "npm run dev" 