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

  $newWidth = [Math]::Min($maxWidth, $img.Width)
  $newHeight = [int][Math]::Round($img.Height * ($newWidth / [double]$img.Width))

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

$unused = Join-Path $publicDir "resetpass-bg.jpg"
if (Test-Path $unused) {
  Remove-Item $unused -Force
  Write-Output "Removed unused resetpass-bg.jpg"
}

Remove-Item (Join-Path $publicDir "home-bg.jpg.test.jpg") -ErrorAction SilentlyContinue
