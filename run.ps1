[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "UNIBOARD 사이트 실행기"

# Node.js 경로 등록
$nodeDir = "C:\Program Files\Microsoft Visual Studio\18\Community\MSBuild\Microsoft\VisualStudio\NodeJs"
if ($env:PATH -notlike "*$nodeDir*") {
    $env:PATH = "$nodeDir;$env:PATH"
}

Set-Location "C:\Users\a7184\Desktop\uniboard-main\uniboard-main"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "                UNIBOARD 사이트를 시작합니다" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 3000번 포트 확인
$tcp = New-Object System.Net.Sockets.TcpClient
$isOpen = $false
try {
    $tcp.Connect("127.0.0.1", 3000)
    $isOpen = $tcp.Connected
} catch {
    $isOpen = $false
} finally {
    $tcp.Dispose()
}

if ($isOpen) {
    Write-Host "[안내] UNIBOARD 서버가 이미 실행 중입니다." -ForegroundColor Green
    Write-Host "브라우저에서 사이트를 바로 엽니다: http://localhost:3000" -ForegroundColor Cyan
    Start-Process "http://localhost:3000"
    Start-Sleep -Seconds 1
    exit
}

# 서버가 준비되는 즉시 브라우저를 열도록 백그라운드 대기 작업 시작
Start-Job -ScriptBlock {
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Milliseconds 500
        $c = New-Object System.Net.Sockets.TcpClient
        try {
            $c.Connect("127.0.0.1", 3000)
            if ($c.Connected) {
                Start-Process "http://localhost:3000"
                break
            }
        } catch {
        } finally {
            $c.Dispose()
        }
    }
} | Out-Null

Write-Host "[1/2] 개발 서버를 시작하는 중입니다..." -ForegroundColor Green
Write-Host "[2/2] 서버가 준비되는 즉시 브라우저(http://localhost:3000)가 자동으로 열립니다." -ForegroundColor Cyan
Write-Host ""
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "* 이 검은 창을 닫으면 사이트가 종료됩니다." -ForegroundColor Yellow
Write-Host "* 사이트를 이용하는 동안 이 창을 켜두세요." -ForegroundColor DarkGray
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

npm run dev
