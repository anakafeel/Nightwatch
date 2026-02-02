$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Split-Path -Parent $ScriptDir
Set-Location $BackendDir

$VenvDir = ".venv"

if (-not (Test-Path $VenvDir)) {
    Write-Host "Creating venv at $VenvDir..."
    python -m venv $VenvDir
}

Write-Host "Activating venv..."
try {
    & "$VenvDir\Scripts\Activate.ps1"
} catch {
    Write-Host "Activation failed. Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    exit 1
}

Write-Host "Installing requirements..."
pip install -r requirements.txt

Write-Host "Starting backend..."
$env:DEMO_MODE = "0"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
