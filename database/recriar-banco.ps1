# Recria o banco "sistema_norteador" a partir do dump.sql (apaga e recria as tabelas com os dados de teste).
# Uso, no PowerShell, dentro da pasta do projeto:
#   powershell -ExecutionPolicy Bypass -File database\recriar-banco.ps1
# A senha do MySQL é pedida pelo próprio mysql e não aparece na tela.

param([string]$Usuario = "root")

# Procura o cliente mysql: primeiro no PATH, depois nas instalações do MySQL Server e do XAMPP
$mysql = (Get-Command mysql -ErrorAction SilentlyContinue).Source
if (-not $mysql) {
    $mysql = Get-ChildItem "C:\Program Files\MySQL\MySQL Server *\bin\mysql.exe", "C:\xampp\mysql\bin\mysql.exe" -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $mysql) {
    Write-Host "Não encontrei o mysql.exe. Importe o database\dump.sql pelo phpMyAdmin ou pelo MySQL Workbench." -ForegroundColor Red
    exit 1
}

$dump = (Join-Path $PSScriptRoot "dump.sql") -replace '\\', '/'
Write-Host "Usando: $mysql"
Write-Host "Importando: $dump"
Write-Host "Digite a senha do MySQL quando for pedida (usuário: $Usuario)." -ForegroundColor Yellow

& $mysql -u $Usuario -p --default-character-set=utf8mb4 `
    -e "source $dump; SELECT id, nome, usuario FROM sistema_norteador.clientes; SELECT COUNT(*) AS agendamentos FROM sistema_norteador.agendamentos;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Banco recriado! Login de teste: lucas / 1234" -ForegroundColor Green
} else {
    Write-Host "A importação falhou (código $LASTEXITCODE). Confira a senha e se o MySQL está ligado." -ForegroundColor Red
}
