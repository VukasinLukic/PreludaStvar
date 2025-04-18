# Script for optimizing product routing structure
# Based on recommendations from CODE_ANALYSIS.md

# Define project root
$projectRoot = ".\drool-art-clone"
$productsDir = "$projectRoot\src\app\products"
$slugDir = "$productsDir\[slug]"
$backupDir = "$projectRoot\backup-products-pages"

# Create backup directory if it doesn't exist
Write-Host "Creating backup directory at $backupDir"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Ensure the dynamic [slug] directory exists and has the needed files
if (!(Test-Path -Path $slugDir)) {
    Write-Host "Error: Dynamic [slug] directory does not exist at $slugDir. Aborting."
    exit 1
}

if (!(Test-Path -Path "$slugDir\page.tsx") -or !(Test-Path -Path "$slugDir\ProductClient.tsx")) {
    Write-Host "Error: Missing required files in $slugDir. Ensure page.tsx and ProductClient.tsx exist. Aborting."
    exit 1
}

# Get all product directories (excluding [slug])
$productDirs = Get-ChildItem -Path $productsDir -Directory | Where-Object { $_.Name -ne "[slug]" }

# Process each product directory
foreach ($dir in $productDirs) {
    $dirPath = $dir.FullName
    $dirName = $dir.Name
    $pagePath = "$dirPath\page.tsx"
    
    # Only process if page.tsx exists
    if (Test-Path -Path $pagePath) {
        # Create backup of the page
        $backupPath = "$backupDir\$dirName-page.tsx"
        Copy-Item -Path $pagePath -Destination $backupPath -Force
        Write-Host "Backed up $dirName to $backupPath"
        
        # Note: In a real implementation, you might want to:
        # 1. Extract the slug/params info from each static page
        # 2. Create a central products data file referencing these slugs
        # 3. Update the [slug]/page.tsx to use this central data file
        
        Write-Host "Would delete $dirPath after extracting necessary data"
        # Remove-Item -Path $dirPath -Recurse -Force  # Uncomment to actually delete
    }
    else {
        Write-Host "No page.tsx found in $dirPath, skipping"
    }
}

# Special handling for laju-kuje redirect
$lajuKujePath = "$productsDir\laju-kuje"
if (Test-Path -Path $lajuKujePath) {
    Write-Host "Found laju-kuje redirect page"
    Copy-Item -Path "$lajuKujePath\page.tsx" -Destination "$backupDir\laju-kuje-redirect-page.tsx" -Force
    Write-Host "Backed up laju-kuje redirect to $backupDir\laju-kuje-redirect-page.tsx"
    
    # In a real implementation, you would update any links pointing to /laju-kuje to use /lajukuje
    # This could involve modifying navigation components, links in content, etc.
    
    Write-Host "Would delete $lajuKujePath after updating all references"
    # Remove-Item -Path $lajuKujePath -Recurse -Force  # Uncomment to actually delete
}

Write-Host "Product routing optimization planning complete!"
Write-Host "To complete the optimization:"
Write-Host "1. Create a centralized product data source (src/data/products.ts)"
Write-Host "2. Update [slug]/page.tsx to use this central data source"
Write-Host "3. Uncomment the removal lines in this script to delete the static product pages"
Write-Host "4. Update any links that point to specific pages to use the dynamic routing" 