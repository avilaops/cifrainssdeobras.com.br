$env:CALCULADORA_PROXY_URL = "http://127.0.0.1:3000"
$env:NEXT_PUBLIC_CALCULADORA_URL = "/calculadora"
Set-Location (Join-Path (Split-Path -Parent $PSScriptRoot) "website")
npm run dev -- --port 3001
