Add-Type -AssemblyName System.Drawing

$publicDir = Join-Path $PSScriptRoot "..\public"
$accent = [Drawing.Color]::FromArgb(255, 26, 77, 71)
$white = [Drawing.Color]::White

function Add-RoundedRectPath([Drawing.Drawing2D.GraphicsPath]$path, $x, $y, $w, $h, $r) {
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

function New-AppIconBitmap([int]$size) {
  $bmp = New-Object Drawing.Bitmap $size, $size
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)

  $s = $size / 32.0

  $bgPath = New-Object Drawing.Drawing2D.GraphicsPath
  Add-RoundedRectPath $bgPath 0 0 $size $size ($s * 6)
  $g.FillPath((New-Object Drawing.SolidBrush $accent), $bgPath)

  $penWidth = [Math]::Max(1, $s * 2)
  $pen = New-Object Drawing.Pen $white, $penWidth
  $pen.StartCap = [Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [Drawing.Drawing2D.LineCap]::Round

  $cx = 16 * $s
  $shackleTop = 12 * $s
  $shackleRadius = 5 * $s

  $shackle = New-Object Drawing.Drawing2D.GraphicsPath
  $shackle.AddArc($cx - $shackleRadius, $shackleTop - $shackleRadius, $shackleRadius * 2, $shackleRadius * 2, 180, 180)
  $g.DrawPath($pen, $shackle)

  $left = 9 * $s
  $top = 14 * $s
  $bodyW = 14 * $s
  $bodyH = 11 * $s
  $bodyR = 2 * $s

  $bodyPath = New-Object Drawing.Drawing2D.GraphicsPath
  Add-RoundedRectPath $bodyPath $left $top $bodyW $bodyH $bodyR
  $g.FillPath((New-Object Drawing.SolidBrush $white), $bodyPath)

  $holeR = 1.5 * $s
  $holeX = 16 * $s - $holeR
  $holeY = 19.25 * $s - $holeR
  $g.FillEllipse((New-Object Drawing.SolidBrush $accent), $holeX, $holeY, $holeR * 2, $holeR * 2)

  $pen.Dispose()
  $g.Dispose()
  return $bmp
}

function Save-Png($bitmap, $path) {
  $bitmap.Save($path, [Drawing.Imaging.ImageFormat]::Png)
}

function Save-Ico($bitmap32, $path) {
  $icon = [Drawing.Icon]::FromHandle($bitmap32.GetHicon())
  $fs = [IO.File]::OpenWrite($path)
  $icon.Save($fs)
  $fs.Close()
  $icon.Dispose()
}

$outputs = @{
  "icon-512.png"          = 512
  "icon-192.png"          = 192
  "apple-touch-icon.png"  = 180
  "favicon-16.png"        = 16
}

$icoBmp = New-AppIconBitmap 32

foreach ($entry in $outputs.GetEnumerator()) {
  $bmp = New-AppIconBitmap $entry.Value
  Save-Png $bmp (Join-Path $publicDir $entry.Key)
  Write-Output ("{0} ({1}px)" -f $entry.Key, $entry.Value)
  $bmp.Dispose()
}

Save-Ico $icoBmp (Join-Path $publicDir "favicon.ico")
$icoBmp.Dispose()
Write-Output "favicon.ico"

# Maskable variant: extra padding for safe zone (80% icon in center)
$maskSize = 512
$maskBmp = New-Object Drawing.Bitmap $maskSize, $maskSize
$mg = [Drawing.Graphics]::FromImage($maskBmp)
$mg.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
$mg.Clear($accent)
$inner = New-AppIconBitmap 410
$offset = [int](($maskSize - 410) / 2)
$mg.DrawImage($inner, $offset, $offset)
$inner.Dispose()
$mg.Dispose()
Save-Png $maskBmp (Join-Path $publicDir "icon-maskable-512.png")
$maskBmp.Dispose()
Write-Output "icon-maskable-512.png (512px, maskable)"
