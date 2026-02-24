# Script para gestionar microservicios con Docker

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('build', 'up', 'down', 'restart', 'logs', 'ps', 'clean')]
    [string]$Action = 'up'
)

$composeFile = "docker-compose.microservices.yml"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Survey Hub - Microservices Manager" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

switch ($Action) {
    'build' {
        Write-Host "🔨 Construyendo imágenes de microservicios..." -ForegroundColor Yellow
        docker-compose -f $composeFile build
        Write-Host "✅ Construcción completada!" -ForegroundColor Green
    }
    'up' {
        Write-Host "🚀 Iniciando microservicios..." -ForegroundColor Yellow
        docker-compose -f $composeFile up -d
        Write-Host ""
        Write-Host "✅ Microservicios iniciados!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📌 Servicios disponibles:" -ForegroundColor Cyan
        Write-Host "   Frontend:          http://localhost:3000" -ForegroundColor White
        Write-Host "   API Gateway:       http://localhost:8080" -ForegroundColor White
        Write-Host "   Auth Service:      http://localhost:5001" -ForegroundColor White
        Write-Host "   Surveys Service:   http://localhost:5002" -ForegroundColor White
        Write-Host "   Responses Service: http://localhost:5003" -ForegroundColor White
        Write-Host "   Analytics Service: http://localhost:5004" -ForegroundColor White
        Write-Host "   SQL Server:        localhost:1433" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Ver logs: .\microservices-manager.ps1 logs" -ForegroundColor Gray
    }
    'down' {
        Write-Host "🛑 Deteniendo microservicios..." -ForegroundColor Yellow
        docker-compose -f $composeFile down
        Write-Host "✅ Microservicios detenidos!" -ForegroundColor Green
    }
    'restart' {
        Write-Host "🔄 Reiniciando microservicios..." -ForegroundColor Yellow
        docker-compose -f $composeFile restart
        Write-Host "✅ Microservicios reiniciados!" -ForegroundColor Green
    }
    'logs' {
        Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
        docker-compose -f $composeFile logs -f
    }
    'ps' {
        Write-Host "📊 Estado de los servicios:" -ForegroundColor Yellow
        docker-compose -f $composeFile ps
    }
    'clean' {
        Write-Host "🧹 Limpiando contenedores, imágenes y volúmenes..." -ForegroundColor Yellow
        Write-Host "⚠️  ADVERTENCIA: Esto eliminará todos los datos!" -ForegroundColor Red
        $confirm = Read-Host "¿Estás seguro? (si/no)"
        if ($confirm -eq 'si') {
            docker-compose -f $composeFile down -v --rmi all
            Write-Host "✅ Limpieza completada!" -ForegroundColor Green
        } else {
            Write-Host "❌ Operación cancelada" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
