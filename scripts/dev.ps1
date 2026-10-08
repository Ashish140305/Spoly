$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendDirectory = Join-Path $projectRoot "spoly.Backend"
$frontendDirectory = Join-Path $projectRoot "spoly.Frontend"
$venvPython = Join-Path $backendDirectory "venv\Scripts\python.exe"
$python = if (Test-Path $venvPython) { $venvPython } else { "python" }
$node = (Get-Command node.exe -ErrorAction Stop).Source
$viteEntry = Join-Path $frontendDirectory "node_modules\vite\bin\vite.js"

function Test-PortInUse([int]$port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connect = $client.BeginConnect("127.0.0.1", $port, $null, $null)
        if (-not $connect.AsyncWaitHandle.WaitOne(500)) { return $false }
        $client.EndConnect($connect)
        return $true
    }
    catch { return $false }
    finally { $client.Dispose() }
}

foreach ($port in @(8000, 5173)) {
    if (Test-PortInUse $port) {
        throw "Port $port is already in use. Stop the existing Spoly run with Ctrl+C, then start npm run dev again."
    }
}

if (-not (Test-Path $viteEntry)) {
    throw "Vite is not installed. Run npm install from the spoly.Frontend folder."
}

$backend = Start-Process -FilePath $python -WorkingDirectory $backendDirectory -ArgumentList @(
    "-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8000", "--reload"
) -NoNewWindow -PassThru

try {
    $frontendArguments = "`"$viteEntry`" --host 127.0.0.1"
    $frontend = Start-Process -FilePath $node -WorkingDirectory $frontendDirectory -ArgumentList $frontendArguments -NoNewWindow -PassThru

    Write-Host "Spoly is starting: frontend http://127.0.0.1:5173, backend http://127.0.0.1:8000"
    Wait-Process -Id $frontend.Id
}
finally {
    if ($frontend -and -not $frontend.HasExited) { & taskkill.exe /PID $frontend.Id /T /F | Out-Null }
    if ($backend -and -not $backend.HasExited) { & taskkill.exe /PID $backend.Id /T /F | Out-Null }
}
