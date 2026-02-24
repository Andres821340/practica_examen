# 🚀 Guía de Inicio Rápido - Microservicios

## ⚡ Inicio Rápido (5 pasos)

### 1️⃣ Iniciar Docker Desktop

- Abrir Docker Desktop
- Esperar a que el ícono de Docker en la bandeja del sistema muestre "Docker Desktop is running"

### 2️⃣ Construir las imágenes

```powershell
docker-compose -f docker-compose.microservices.yml build
```

⏱️ Tiempo estimado: **5-10 minutos** (primera vez)

### 3️⃣ Iniciar los servicios

```powershell
docker-compose -f docker-compose.microservices.yml up -d
```

⏱️ Tiempo estimado: **2-3 minutos**

### 4️⃣ Esperar a que SQL Server esté listo

```powershell
docker logs surveyhub-auth -f
```

Esperar a ver: `"Application started. Press Ctrl+C to shut down."`

### 5️⃣ Abrir el navegador

```
http://localhost:3000
```

---

## 🎯 Comandos Esenciales

### Ver estado de todos los servicios
```powershell
docker-compose -f docker-compose.microservices.yml ps
```

### Ver logs de todos los servicios
```powershell
docker-compose -f docker-compose.microservices.yml logs -f
```

### Ver logs de un servicio específico
```powershell
docker logs surveyhub-auth -f          # Auth Service
docker logs surveyhub-surveys -f       # Surveys Service
docker logs surveyhub-responses -f     # Responses Service
docker logs surveyhub-analytics -f     # Analytics Service
docker logs surveyhub-gateway -f       # API Gateway
docker logs surveyhub-frontend -f      # Frontend
docker logs surveyhub-sqlserver -f     # SQL Server
```

### Detener todos los servicios
```powershell
docker-compose -f docker-compose.microservices.yml down
```

### Reiniciar un servicio específico
```powershell
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### Reconstruir un servicio después de cambios
```powershell
docker-compose -f docker-compose.microservices.yml build auth-service
docker-compose -f docker-compose.microservices.yml up -d auth-service
```

---

## 🧪 Pruebas Rápidas

### Verificar que el API Gateway está funcionando
```powershell
curl http://localhost:8080/health
```

Respuesta esperada: `API Gateway is running`

### Registrar un usuario
```powershell
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "fullName": "Admin Test",
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

### Iniciar sesión
```powershell
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

---

## 🛠️ Usar el Script de Gestión

### Construir
```powershell
.\microservices-manager.ps1 build
```

### Iniciar
```powershell
.\microservices-manager.ps1 up
```

### Detener
```powershell
.\microservices-manager.ps1 down
```

### Ver logs
```powershell
.\microservices-manager.ps1 logs
```

### Ver estado
```powershell
.\microservices-manager.ps1 ps
```

### Reiniciar
```powershell
.\microservices-manager.ps1 restart
```

### Limpiar todo
```powershell
.\microservices-manager.ps1 clean
```

---

## 🔧 Solución Rápida de Problemas

### ❌ "Cannot connect to Docker daemon"
**Solución:** Iniciar Docker Desktop y esperar a que esté completamente cargado.

### ❌ "Port is already allocated"
**Solución:** 
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :8080

# Detener todos los contenedores
docker-compose -f docker-compose.microservices.yml down

# Reiniciar
docker-compose -f docker-compose.microservices.yml up -d
```

### ❌ "Auth service keeps restarting"
**Solución:** SQL Server puede necesitar más tiempo. Esperar 30 segundos y revisar logs:
```powershell
docker logs surveyhub-sqlserver
docker logs surveyhub-auth
```

### ❌ "Cannot access http://localhost:3000"
**Solución:** 
```powershell
# Verificar que el contenedor esté corriendo
docker ps | findstr frontend

# Ver logs del frontend
docker logs surveyhub-frontend

# Reiniciar el servicio
docker-compose -f docker-compose.microservices.yml restart frontend
```

---

## 📊 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz web principal |
| **API Gateway** | http://localhost:8080 | Punto de entrada a APIs |
| **Auth API** | http://localhost:5001 | Servicio de autenticación |
| **Surveys API** | http://localhost:5002 | Servicio de encuestas |
| **Responses API** | http://localhost:5003 | Servicio de respuestas |
| **Analytics API** | http://localhost:5004 | Servicio de analíticas |

---

## 💾 Persistencia de Datos

Los datos de SQL Server se guardan en un volumen Docker llamado `ejemplo_sqlserver-data`.

Para **eliminar todos los datos**:
```powershell
docker-compose -f docker-compose.microservices.yml down -v
```

Para **hacer backup de la base de datos**:
```powershell
docker exec surveyhub-sqlserver /opt/mssql-tools/bin/sqlcmd `
  -S localhost -U sa -P YourStrong!Passw0rd `
  -Q "BACKUP DATABASE SurveyHubDB TO DISK='/var/opt/mssql/backup/SurveyHubDB.bak'"
```

---

## 🎓 Próximos Pasos

1. ✅ Iniciar Docker Desktop
2. ✅ Ejecutar `docker-compose -f docker-compose.microservices.yml up -d`
3. ✅ Esperar que todos los servicios estén "healthy"
4. ✅ Abrir http://localhost:3000
5. ✅ Registrar un usuario administrador
6. ✅ Crear tu primera encuesta
7. ✅ Responder la encuesta
8. ✅ Ver las analíticas

---

**¿Necesitas ayuda?** Consulta el [README completo](./README.md) en la carpeta `microservices/`.
