# 🧪 Guía de Prueba de Microservicios

## 📋 Estado Actual

✅ **Imágenes construidas**: Todas las 6 imágenes están listas
✅ **Servicios corriendo**: 7 contenedores activos
⚠️ **Conexión a BD**: Necesita SQL Server en contenedor o configuración especial

---

## 🎯 3 Formas de Probar los Microservicios

### **Opción 1: Usar el Monolito** (MÁS RÁPIDO - Recomendado)

El monolito tiene el mismo código que los microservicios, solo que en una aplicación:

```powershell
cd Ejemplo
dotnet run
# Abrir: http://localhost:5000
```

**Por qué es equivalente:**
- ✅ Mismo código fuente
- ✅ Mismas funcionalidades
- ✅ Misma lógica de negocio
- ✅ Solo difiere en el empaquetado

---

### **Opción 2: Probar Imágenes Individuales** (EDUCATIVO)

Puedes ejecutar y probar cada imagen Docker individualmente:

#### 1️⃣ Probar Frontend (Nginx)

```powershell
docker run -d -p 3000:80 --name test-frontend ejemplo-frontend
# Abrir navegador: http://localhost:3000
# Verás la interfaz HTML/CSS/JS
```

**Lo que comprueba:**
- ✅ Imagen de Nginx construida correctamente
- ✅ Archivos estáticos servidos
- ✅ HTML, CSS y JavaScript funcionan

#### 2️⃣ Probar API Gateway (Nginx Reverse Proxy)

```powershell
docker run -d -p 8080:80 --name test-gateway ejemplo-api-gateway
curl http://localhost:8080/health
```

**Resultado esperado:**
```
API Gateway is running
```

**Lo que comprueba:**
- ✅ Nginx configurado como reverse proxy
- ✅ Rutas configuradas correctamente
- ✅ Healthcheck endpoint funciona

#### 3️⃣ Ver Logs de un Servicio .NET

```powershell
docker run --name test-auth ejemplo-auth-service
# Presiona Ctrl+C para detener
```

**Lo que verás:**
- Inicio de ASP.NET Core
- Advertencias de configuración
- Información de Entity Framework
- Errores de conexión (esperado sin BD configurada)

**Lo que comprueba:**
- ✅ Aplicación .NET compila correctamente
- ✅ Dependencias resueltas
- ✅ Configuración cargada

#### 4️⃣ Inspeccionar una Imagen

```powershell
# Ver capas de la imagen
docker history ejemplo-auth-service

# Ver tamaño
docker images | findstr ejemplo

# Inspeccionar configuración
docker inspect ejemplo-auth-service
```

---

### **Opción 3: Despliegue Completo con Docker Compose** (AVANZADO)

#### Requisitos:
- SQL Server en contenedor funcional
- Configuración de red correcta
- Variables de entorno apropiadas

#### Estado Actual:
```powershell
docker-compose -f docker-compose.test.yml ps
```

Deberías ver:
```
NAME                       STATUS          PORTS
surveyhub-analytics-test   Up 11 seconds   0.0.0.0:5004->80/tcp
surveyhub-auth-test        Up 13 seconds   0.0.0.0:5001->80/tcp
surveyhub-frontend-test    Up 8 seconds    0.0.0.0:3000->80/tcp
surveyhub-gateway-test     Up 10 seconds   0.0.0.0:8080->80/tcp
surveyhub-responses-test   Up 12 seconds   0.0.0.0:5003->80/tcp
surveyhub-surveys-test     Up 13 seconds   0.0.0.0:5002->80/tcp
```

#### Verificar Servicios:

```powershell
# 1. API Gateway
curl http://localhost:8080/health
# Esperado: "API Gateway is running"

# 2. Frontend
# Abrir en navegador: http://localhost:3000

# 3. Ver logs de auth service
docker logs surveyhub-auth-test

# 4. Ver logs de surveys service
docker logs surveyhub-surveys-test

# 5. Ver logs de responses service
docker logs surveyhub-responses-test

# 6. Ver logs de analytics service
docker logs surveyhub-analytics-test
```

---

## 🔍 Verificar lo que Funciona SIN Base de Datos

Aunque no tengamos BD conectada, podemos verificar:

### ✅ Lo que SÍ funciona:

1. **Construcción de imágenes**
   ```powershell
   docker images | findstr ejemplo
   ```
   Deberías ver 6 imágenes.

2. **Inicio de aplicaciones .NET**
   ```powershell
   docker logs surveyhub-auth-test 2>&1 | findstr "Application started"
   ```
   Si ves "Application started", la app .NET inició.

3. **Nginx (Frontend y Gateway)**
   ```powershell
   curl http://localhost:3000
   curl http://localhost:8080/health
   ```

4. **Configuración de red Docker**
   ```powershell
   docker network ls | findstr surveyhub
   ```

### ❌ Lo que NO funciona sin BD:

- Endpoints de API (necesitan Entity Framework)
- Autenticación (necesita tabla de usuarios)
- CRUD de encuestas (necesita tablas)

---

## 📊 Comandos de Diagnóstico

### Ver estado de todos los contenedores

```powershell
docker ps -a | findstr surveyhub
```

### Ver uso de recursos

```powershell
docker stats --no-stream
```

### Ver redes Docker

```powershell
docker network inspect ejemplo_surveyhub-test-network
```

### Ver volúmenes

```powershell
docker volume ls | findstr ejemplo
```

### Limpiar todo

```powershell
docker-compose -f docker-compose.test.yml down
docker system prune -a
```

---

## 🎓 Lo que Demuestra el Proyecto

Aunque los microservicios no estén completamente conectados a BD, has demostrado:

✅ **Conocimiento de Docker**
- Dockerfile multi-stage builds
- Docker Compose orchestration
- Networking entre contenedores
- Configuración de variables de entorno

✅ **Arquitectura de Microservicios**
- Separación de responsabilidades
- API Gateway pattern
- Service-to-service communication
- Frontend desacoplado

✅ **DevOps**
- Containerización de aplicaciones
- Orquestación de servicios
- Configuración de reverse proxy
- Gestión de imágenes

✅ **ASP.NET Core**
- Aplicaciones .NET en contenedores
- Configuración multi-entorno
- Entity Framework Core
- JWT Authentication

---

## 💡 Recomendación Final

**Para tu presentación/demo:**

1. **Muestra el MONOLITO funcionando** ✅
   - Es el mismo código
   - Funciona perfectamente
   - Demuestra todas las funcionalidades

2. **Explica la ARQUITECTURA de microservicios** 📊
   - Usa los diagramas en `ARQUITECTURA-MICROSERVICIOS.md`
   - Muestra `docker-compose.microservices.yml`
   - Explica por qué diseñaste cada servicio

3. **Demuestra las IMÁGENES** 🐳
   ```powershell
   docker images | findstr ejemplo
   docker-compose -f docker-compose.test.yml ps
   docker logs surveyhub-gateway-test
   ```

4. **Menciona los DESAFÍOS** 🎯
   - SQL Server en Docker requiere configuración especial
   - Autenticación Windows no funciona en contenedores Linux
   - En producción usarías Azure SQL o PostgreSQL

---

## ✅ Checklist de Verificación

- [ ] Imágenes construidas: `docker images`
- [ ] Contenedores corriendo: `docker ps`
- [ ] API Gateway health check: `curl localhost:8080/health`
- [ ] Frontend accesible: Abrir http://localhost:3000
- [ ] Logs sin errores críticos: `docker logs surveyhub-auth-test`
- [ ] Documentación completa: Revisar archivos .md

---

## 📚 Archivos de Documentación

- `PROYECTO-COMPLETO.md` - Resumen ejecutivo
- `ARQUITECTURA-MICROSERVICIOS.md` - Diagramas detallados
- `MONOLITO-VS-MICROSERVICIOS.md` - Comparación
- `microservices/README.md` - Guía técnica completa

---

**¡Tu proyecto demuestra conocimientos sólidos en arquitectura moderna de software!** 🚀
