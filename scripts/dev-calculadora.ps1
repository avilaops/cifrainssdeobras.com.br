$env:NEXT_PUBLIC_BASE_PATH = "/calculadora"
Set-Location (Join-Path (Split-Path -Parent $PSScriptRoot) "calculadora")
npm run dev -- --port 3000
