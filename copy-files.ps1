# Copy files from drool-art-clone to my-nextjs-app preserving directory structure

# App directory files
$appDirs = @(
    "o-nama",
    "politika-privatnosti",
    "posteri",
    "products/[slug]",
    "products/apsolutnotvoj",
    "products/bangbang",
    "products/casino",
    "products/elenablakablaka",
    "products/grshemiach",
    "products/idepetak",
    "products/jecapack",
    "products/laju-kuje",
    "products/lajukuje",
    "products/mkmz",
    "products/oprostajna",
    "products/vladoandjele",
    "products/zovime",
    "uslovi-koriscenja"
)

# Process app directories
foreach ($dir in $appDirs) {
    # Create directory if it doesn't exist
    $targetDir = ".\my-nextjs-app\src\app\$dir"
    if (!(Test-Path -Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir
        Write-Host "Created directory: $targetDir"
    }
    
    # Copy page.tsx if it exists
    $sourcePage = ".\drool-art-clone\src\app\$dir\page.tsx"
    if (Test-Path -Path $sourcePage) {
        Copy-Item -Path $sourcePage -Destination $targetDir -Force
        Write-Host "Copied: $sourcePage to $targetDir"
    }
    
    # Copy ProductClient.tsx for the [slug] directory
    if ($dir -eq "products/[slug]") {
        $sourceProductClient = ".\drool-art-clone\src\app\$dir\ProductClient.tsx"
        if (Test-Path -Path $sourceProductClient) {
            Copy-Item -Path $sourceProductClient -Destination $targetDir -Force
            Write-Host "Copied: $sourceProductClient to $targetDir"
        }
    }
}

# Copy public files
$publicDir = ".\my-nextjs-app\public\product-photos"
if (!(Test-Path -Path $publicDir)) {
    New-Item -ItemType Directory -Force -Path $publicDir
    Write-Host "Created directory: $publicDir"
}

# Copy product photos if they exist
$sourcePhotos = ".\drool-art-clone\public\product-photos\*"
if (Test-Path -Path $sourcePhotos) {
    Copy-Item -Path $sourcePhotos -Destination $publicDir -Force -Recurse
    Write-Host "Copied product photos to $publicDir"
}

Write-Host "File copy operation complete!" 