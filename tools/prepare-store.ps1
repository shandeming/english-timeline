$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Add-Type -AssemblyName System.Drawing
foreach ($folder in @('icons', 'store', 'dist')) {
    New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot $folder) | Out-Null
}

function Draw-Icon($graphics, [float]$x, [float]$y, [float]$size) {
    $dark = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#15201f'))
    $mint = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#72f0cf'))
    $pale = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f2f8f6'))
    $pen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#72f0cf'), $size * 0.04)
    try {
        $graphics.FillEllipse($dark, $x, $y, $size, $size)
        $points = [System.Drawing.PointF[]]@(
            [System.Drawing.PointF]::new($x + $size * 0.39, $y + $size * 0.23),
            [System.Drawing.PointF]::new($x + $size * 0.39, $y + $size * 0.58),
            [System.Drawing.PointF]::new($x + $size * 0.67, $y + $size * 0.405)
        )
        $graphics.FillPolygon($pale, $points)
        $graphics.DrawLine($pen, $x + $size * 0.20, $y + $size * 0.73, $x + $size * 0.80, $y + $size * 0.73)
        foreach ($offset in @(0.32, 0.52, 0.70)) {
            $graphics.FillRectangle($mint, $x + $size * $offset, $y + $size * 0.64, $size * 0.045, $size * 0.18)
        }
    } finally { $dark.Dispose(); $mint.Dispose(); $pale.Dispose(); $pen.Dispose() }
}

foreach ($size in @(16, 32, 48, 128, 300)) {
    $bitmap = if ($size -eq 300) { [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb) } else { [System.Drawing.Bitmap]::new($size, $size) }
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $backgroundColor = if ($size -eq 300) { [System.Drawing.ColorTranslator]::FromHtml('#f2f8f6') } else { [System.Drawing.Color]::Transparent }
        $graphics.Clear($backgroundColor)
        Draw-Icon $graphics ($size * 0.125) ($size * 0.125) ($size * 0.75)
        $imagePath = if ($size -eq 300) { 'store/edge-logo-300.png' } else { "icons/icon$size.png" }
        $bitmap.Save((Join-Path $projectRoot $imagePath), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
}

$bitmap = [System.Drawing.Bitmap]::new(440, 280)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$white = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f2f8f6'))
$mint = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#72f0cf'))
$titleFont = [System.Drawing.Font]::new('Arial', 29, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$bodyFont = [System.Drawing.Font]::new('Arial', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#15201f'))
    Draw-Icon $graphics 24 22 78
    $graphics.DrawString('English Timeline', $titleFont, $white, 26, 115)
    $graphics.DrawString('Bookmark. Replay. Learn.', $bodyFont, $mint, 28, 164)
    $graphics.DrawString('Listening practice on YouTube', $bodyFont, $white, 28, 199)
    $bitmap.Save((Join-Path $projectRoot 'store/promo-440x280.png'), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $graphics.Dispose(); $bitmap.Dispose(); $white.Dispose(); $mint.Dispose(); $titleFont.Dispose(); $bodyFont.Dispose()
}

$manifest = Get-Content -Raw (Join-Path $projectRoot 'manifest.json') | ConvertFrom-Json
if ($manifest.manifest_version -ne 3 -or $manifest.description.Length -gt 132) { throw 'Invalid manifest version or description length.' }
$runtime = @('manifest.json', 'core.js', 'content.js', 'styles.css')
foreach ($script in @('core.js', 'content.js')) {
    & node --check (Join-Path $projectRoot $script)
    if ($LASTEXITCODE -ne 0) { throw "Syntax check failed: $script" }
}
$references = @($manifest.content_scripts.js) + @($manifest.content_scripts.css) + @($manifest.icons.PSObject.Properties.Value)
foreach ($reference in $references) {
    if (!(Test-Path -LiteralPath (Join-Path $projectRoot $reference))) { throw "Missing manifest file: $reference" }
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = Join-Path $projectRoot "dist/english-timeline-$($manifest.version).zip"
$stream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($relative in $runtime + @($manifest.icons.PSObject.Properties.Value)) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Join-Path $projectRoot $relative), $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally { $zip.Dispose(); $stream.Dispose() }
$check = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    if (!($check.Entries.FullName -contains 'manifest.json')) { throw 'ZIP root manifest missing.' }
    Write-Output "Validated package: $zipPath"
    $check.Entries | Select-Object FullName, Length
} finally { $check.Dispose() }
