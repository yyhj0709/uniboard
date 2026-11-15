# 1. Update User PATH if needed
$nodeDir = "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$nodeDir*") {
    $newUserPath = "$userPath;$nodeDir"
    [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
    Write-Output "User PATH updated with Node.js path."
} else {
    Write-Output "User PATH already has Node.js."
}

# 2. Create Desktop Shortcut (.lnk)
$desktopPath = [Environment]::GetFolderPath("Desktop")
$wsh = New-Object -ComObject WScript.Shell
$shortcutPath = Join-Path $desktopPath "UNIBOARD 바로가기.lnk"
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "C:\Users\a7184\Desktop\uniboard-main\uniboard-main\start-uniboard.bat"
$shortcut.WorkingDirectory = "C:\Users\a7184\Desktop\uniboard-main\uniboard-main"
$shortcut.WindowStyle = 1
$shortcut.Description = "UNIBOARD 사이트 실행 및 바로 열기"
$shortcut.IconLocation = "shell32.dll,14"
$shortcut.Save()
Write-Output "Desktop shortcut created: $shortcutPath"

# 3. Create Desktop Internet URL shortcut (.url)
$urlPath = Join-Path $desktopPath "UNIBOARD 웹사이트.url"
$lines = @(
    "[InternetShortcut]",
    "URL=http://localhost:3000",
    "IconIndex=14",
    "IconFile=$env:SystemRoot\System32\shell32.dll"
)
[System.IO.File]::WriteAllLines($urlPath, $lines)
Write-Output "Desktop URL shortcut created: $urlPath"
