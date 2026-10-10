# PowerShell script to create Desktop shortcut for Maanak Drishti
$WScriptShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path -Path $DesktopPath -ChildPath "Maanak Drishti.lnk"
$TargetPath = "c:\Users\VIJAYA LAKSHMI\OneDrive\Documents\GitHub\maanak_drishti\start.bat"
$WorkingDir = "c:\Users\VIJAYA LAKSHMI\OneDrive\Documents\GitHub\maanak_drishti"

$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $WorkingDir
$Shortcut.Description = "Maanak Drishti - Digital Legal Metrology Portal"
$Shortcut.WindowStyle = 1
$Shortcut.Save()

Write-Host "[SUCCESS] Desktop shortcut successfully created at: $ShortcutPath"
