# Script de Pruebas Automatizadas para Microservicios
# Survey Hub - Test Suite

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Survey Hub - Pruebas de Microservicios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para probar un endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url
    )
    
    Write-Host "🧪 Probando: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ PASÓ - Status: $($response.StatusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ⚠️  ADVERTENCIA - Status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "   ❌ FALLÓ - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}
}

# Función para verificar contenedores
function Test-Container {
    param(
        [string]$Name
    )
    
    Write-Host "🐳 Verificando contenedor: $Name" -ForegroundColor Yellow
    
    $container = docker ps --filter "name=$Name" --format "{{.Status}}"
    if ($container -match "Up") {
        Write-Host "   ✅ Corriendo - $container" -ForegroundColor Green
        return $true
    } else {
        Write-Host "   ❌ No está corriendo" -ForegroundColor Red
        return $false
    }
}

# Contadores
$passedTests = 0
$failedTests = 0
$totalTests = 0

Write-Host "📊 SECCIÓN 1: Verificación de Imágenes Docker" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$images = @(
    "ejemplo-auth-service",
    "ejemplo-surveys-service",
    "ejemplo-responses-service",
    "ejemplo-analytics-service",
    "ejemplo-api-gateway",
    "ejemplo-frontend"
)

foreach ($image in $images) {
    $totalTests++
    $exists = docker images --format "{{.Repository}}" | Select-String -Pattern $image -Quiet
    if ($exists) {
        Write-Host "✅ Imagen existe: $image" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ Imagen NO existe: $image" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""
Write-Host "📊 SECCIÓN 2: Verificación de Contenedores" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$containers = @(
    "surveyhub-auth-test",
    "surveyhub-surveys-test",
    "surveyhub-responses-test",
    "surveyhub-analytics-test",
    "surveyhub-gateway-test",
    "surveyhub-frontend-test"
)

foreach ($container in $containers) {
    $totalTests++
    if (Test-Container -Name $container) {
        $passedTests++
    } else {
        $failedTests++
    }
}

Write-Host ""
Write-Host "📊 SECCIÓN 3: Pruebas de Endpoints" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host ""
Start-Sleep -Seconds 2

$endpoints = @{
    "API Gateway Health" = "http://localhost:8080/health"
    "Frontend" = "http://localhost:3000"
}

foreach ($endpoint in $endpoints.GetEnumerator()) {
    $totalTests++
    if (Test-Endpoint -Name $endpoint.Key -Url $endpoint.Value) {
        $passedTests++
    } else {
        $failedTests++
    }
    Write-Host ""
}

Write-Host ""
Write-Host "📊 SECCIÓN 4: Verificación de Red Docker" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$totalTests++
$network = docker network ls --format "{{.Name}}" | Select-String -Pattern "surveyhub-test-network" -Quiet
if ($network) {
    Write-Host "✅ Red Docker creada: surveyhub-test-network" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "❌ Red Docker NO existe" -ForegroundColor Red
    $failedTests++
}

Write-Host ""
Write-Host "📊 SECCIÓN 5: Logs de Servicios (Últimas 5 líneas)" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

$containers = @(
    "surveyhub-auth-test",
    "surveyhub-gateway-test",
    "surveyhub-frontend-test"
)

foreach ($container in $containers) {
    Write-Host ""
    Write-Host "📋 Logs de: $container" -ForegroundColor Yellow
    Write-Host "-" * 50 -ForegroundColor Gray
    docker logs $container --tail 5 2>&1 | ForEach-Object {
        if ($_ -match "error|fail|exception") {
            Write-Host $_ -ForegroundColor Red
        } elseif ($_ -match "warn") {
            Write-Host $_ -ForegroundColor Yellow
        } elseif ($_ -match "started|listening|running") {
            Write-Host $_ -ForegroundColor Green
        } else {
            Write-Host $_ -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de pruebas:    $totalTests" -ForegroundColor White
Write-Host "✅ Pasaron:          $passedTests" -ForegroundColor Green
Write-Host "❌ Fallaron:         $failedTests" -ForegroundColor Red
Write-Host ""

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "📊 Tasa de éxito:   $successRate%" -ForegroundColor $(if($successRate -ge 70){"Green"}else{"Yellow"})

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           COMANDOS ÚTILES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver todos los contenedores:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.test.yml ps" -ForegroundColor Gray
Write-Host ""
Write-Host "Ver logs de un servicio:" -ForegroundColor Yellow
Write-Host "   docker logs surveyhub-auth-test -f" -ForegroundColor Gray
Write-Host ""
Write-Host "Detener todos los servicios:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.test.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "Reiniciar un servicio:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.test.yml restart auth-service" -ForegroundColor Gray
Write-Host ""

if ($successRate -ge 70) {
    Write-Host "🎉 ¡Buen trabajo! Los microservicios están configurados correctamente." -ForegroundColor Green
} else {
    Write-Host "⚠️  Algunos servicios necesitan atención. Revisa los logs arriba." -ForegroundColor Yellow
}

Write-Host ""
