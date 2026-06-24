# Resize/compress JPEG backgrounds in public/.
# Requires originals with valid image data — a failed run can produce blank files.
# Prefer sourcing images already sized to ~1600px wide (e.g. Unsplash ?w=1600&q=80).

Add-Type -AssemblyName System.Drawing

$publicDir = Join-Path $PSScriptRoot "..\public"
$maxWidth = 1600
$quality = 75L

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }

$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  $quality
)

Get-ChildItem (Join-Path $publicDir "*.jpg") | ForEach-Object {
  $file = $_.FullName
  $before = $_.Length

  $stream = [System.IO.File]::OpenRead($file)
  $img = [System.Drawing.Image]::FromStream($stream, $false, $false)
  $stream.Close()
  $stream.Dispose()

  if ($img.Width -le 1 -or $img.Height -le 1) {
    $img.Dispose()
    Write-Error "Skipping $($_.Name): invalid dimensions $($img.Width)x$($img.Height)"
    return
  }

  $newWidth = [Math]::Min($maxWidth, $img.Width)
  $newHeight = [int][Math]::Round($img.Height * ($newWidth / [double]$img.Width))

  if ($newWidth -ge $img.Width) {
    $img.Dispose()
    Write-Output ("{0}: already {1}px wide, skipped" -f $_.Name, $img.Width)
    return
  }

  $bitmap = New-Object System.Drawing.Bitmap $newWidth, $newHeight
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
  $graphics.Dispose()
  $img.Dispose()

  $outPath = "$file.optimized.jpg"
  $bitmap.Save($outPath, $encoder, $encoderParams)
  $bitmap.Dispose()

  Remove-Item $file -Force
  Rename-Item $outPath (Split-Path $file -Leaf)

  $after = (Get-Item $file).Length
  Write-Output ("{0}: {1} KB -> {2} KB ({3}x{4})" -f $_.Name, [math]::Round($before / 1KB), [math]::Round($after / 1KB), $newWidth, $newHeight)
}
