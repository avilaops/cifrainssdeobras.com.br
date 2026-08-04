param(
  [Parameter(Mandatory = $true)][string]$AdminUser,
  [Parameter(Mandatory = $true)][SecureString]$AdminPassword,
  [Parameter(Mandatory = $true)][SecureString]$SessionSecret,
  [int]$CalculatorPort = 3000,
  [int]$WebsitePort = 3001
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$calculator = Join-Path $root "calculadora"
$website = Join-Path $root "website"
foreach ($port in @($CalculatorPort, $WebsitePort)) {
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    throw "A porta $port já está ocupada. Encerre o processo existente antes de iniciar."
  }
}

$passwordText = [System.Net.NetworkCredential]::new("", $AdminPassword).Password
$secretText = [System.Net.NetworkCredential]::new("", $SessionSecret).Password
try {
  $env:NEXT_PUBLIC_BASE_PATH = "/calculadora"
  $env:CALCULADORA_ADMIN_USER = $AdminUser
  $env:CALCULADORA_ADMIN_PASSWORD = $passwordText
  $env:CALCULADORA_SESSION_SECRET = $secretText
  $calcProcess = Start-Process npm.cmd -ArgumentList "run", "dev", "--", "--port", $CalculatorPort -WorkingDirectory $calculator -WindowStyle Hidden -PassThru
  $env:CALCULADORA_PROXY_URL = "http://127.0.0.1:$CalculatorPort"
  $env:NEXT_PUBLIC_CALCULADORA_URL = "/calculadora"
  $webProcess = Start-Process npm.cmd -ArgumentList "run", "dev", "--", "--port", $WebsitePort -WorkingDirectory $website -WindowStyle Hidden -PassThru
  Start-Sleep -Seconds 4
  Write-Output "Calculadora PID: $($calcProcess.Id)"
  Write-Output "Website PID: $($webProcess.Id)"
  Write-Output "Aplicação integrada: http://localhost:$WebsitePort/calculadora"
} finally {
  $passwordText = $null
  $secretText = $null
  Remove-Item Env:CALCULADORA_ADMIN_PASSWORD, Env:CALCULADORA_SESSION_SECRET -ErrorAction SilentlyContinue
}
