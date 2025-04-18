# Script for consolidating assets into standardized directory structure
# Based on recommendations from CODE_ANALYSIS.md

# Define target directories
$projectRoot = ".\drool-art-clone"
$targetProductsDir = "$projectRoot\public\assets\images\products"
$targetAdsDir = "$projectRoot\public\assets\images\ads"
$targetLogosDir = "$projectRoot\public\assets\images\logos"

# Create target directories if they don't exist
Write-Host "Creating target directories..."
New-Item -ItemType Directory -Force -Path $targetProductsDir | Out-Null
New-Item -ItemType Directory -Force -Path $targetAdsDir | Out-Null
New-Item -ItemType Directory -Force -Path $targetLogosDir | Out-Null

# Define source directories
$sourceProductDirs = @(
    "$projectRoot\public\product-photos",
    "$projectRoot\product photos"
)

$sourceAdsDirs = @(
    "$projectRoot\public\ads",
    "$projectRoot\ads"
)

$sourceLogosDirs = @(
    "$projectRoot\public\logos",
    "$projectRoot\logos"
)

# Function to copy assets with standardized names
function Copy-Assets {
    param (
        [string[]]$SourceDirs,
        [string]$TargetDir,
        [string]$AssetType
    )
    
    Write-Host "Processing $AssetType..."
    foreach ($sourceDir in $SourceDirs) {
        if (Test-Path -Path $sourceDir) {
            Write-Host "  Copying from $sourceDir"
            Get-ChildItem -Path $sourceDir -File | ForEach-Object {
                $newFileName = $_.Name -replace ' ', '-' # Replace spaces with hyphens
                $targetPath = Join-Path -Path $TargetDir -ChildPath $newFileName
                
                # Copy file if it doesn't exist or is newer
                if (!(Test-Path -Path $targetPath) -or 
                    (Get-Item -Path $_.FullName).LastWriteTime -gt (Get-Item -Path $targetPath).LastWriteTime) {
                    Copy-Item -Path $_.FullName -Destination $targetPath -Force
                    Write-Host "    Copied $($_.Name) to $newFileName"
                }
                else {
                    Write-Host "    Skipped $($_.Name) (already exists and up to date)"
                }
            }
        }
        else {
            Write-Host "  Source directory $sourceDir not found, skipping"
        }
    }
}

# Process each asset type
Copy-Assets -SourceDirs $sourceProductDirs -TargetDir $targetProductsDir -AssetType "Product Images"
Copy-Assets -SourceDirs $sourceAdsDirs -TargetDir $targetAdsDir -AssetType "Ad Images"
Copy-Assets -SourceDirs $sourceLogosDirs -TargetDir $targetLogosDir -AssetType "Logo Images"

# Convert .tif files to web-friendly format
Write-Host "Checking for .tif files that need conversion..."
Get-ChildItem -Path $targetProductsDir, $targetAdsDir, $targetLogosDir -Filter "*.tif" | ForEach-Object {
    $webpFilePath = $_.FullName -replace '\.tif$', '.webp'
    Write-Host "  Found TIF file: $($_.Name)"
    Write-Host "  Should be converted to: $webpFilePath"
    Write-Host "  Note: For actual conversion, ImageMagick or another tool would be required."
    # In a real implementation, you would use a tool like ImageMagick:
    # magick convert $_.FullName -quality 90 $webpFilePath
}

Write-Host "Asset consolidation complete!"
Write-Host "Next steps:"
Write-Host "1. Update image references in code to use the new paths"
Write-Host "2. Remove duplicate asset folders once references are updated" 