# Script for copying and renaming product images
# This script copies images from 'product photos' to 'product-photos' directory
# while also resolving any filename issues with spaces

# Set location to the project root
Set-Location -Path "D:\preludastvar\drool-art-clone"

# Create the product-photos directory if it doesn't exist
if (-not (Test-Path -Path "public\product-photos")) {
    New-Item -ItemType Directory -Path "public\product-photos" -Force
    Write-Host "Created directory: public\product-photos"
}

# Check if source directory exists
if (Test-Path -Path "public\product photos") {
    # Get all files from the source directory
    $sourceFiles = Get-ChildItem -Path "public\product photos" -File
    
    # Copy each file to the destination directory with modified filename (replacing spaces with nothing)
    foreach ($file in $sourceFiles) {
        $newName = $file.Name -replace ' ', ''
        Copy-Item -Path $file.FullName -Destination "public\product-photos\$newName" -Force
        Write-Host "Copied: $($file.Name) -> product-photos\$newName"
    }
    
    Write-Host "Successfully copied and renamed all product images."
} else {
    Write-Host "Source directory 'public\product photos' not found." -ForegroundColor Red
}

# Keep the console window open after command finishes
Write-Host "Press any key to exit."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 