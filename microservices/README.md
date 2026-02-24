# Sistema de Encuestas Web - Arquitectura de Microservicios

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura de microservicios con Docker:

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Navegador)                   │
└────────────────────┬─────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
   ┌──────▼──────┐      ┌──────▼──────────┐
   │  Frontend   │      │   API Gateway   │
   │  (Nginx)    │      │    (Nginx)      │
   │  Port: 3000 │      │   Port: 8080    │
   └─────────────┘      └────────┬─────────┘
                                 │
                 ┌───────────────┼───────────────┬──────────┐
                 │               │               │          │
          ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼─────┐ ┌──▼────────┐
          │Auth Service │ │  Surveys   │ │ Responses │ │ Analytics │
          │  (ASP.NET)  │ │  Service   │ │  Service  │ │  Service  │
          │ Port: 5001  │ │Port: 5002  │ │Port: 5003 │ │Port: 5004 │
          └──────┬──────┘ └─────┬──────┘ └─────┬─────┘ └──┬────────┘
                 │              │               │          │
                 └──────────────┴───────────────┴──────────┘
                                 │
                        ┌────────▼─────────┐
                        │   SQL Server     │
                        │  Port: 1433      │
                        └──────────────────┘
```

## 📦 Microservicios

### 1. Auth Service (Port: 5001)
- Autenticación con JWT
- Gestión de usuarios
- Registro y login
- Cambio de contraseña

**Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `GET /api/users` (Admin)
- `DELETE /api/users/{id}` (Admin)

### 2. Surveys Service (Port: 5002)
- Gestión de encuestas
- CRUD de encuestas

**Endpoints:**
- `GET /api/surveys`
- `GET /api/surveys/{id}`
- `POST /api/surveys` (Admin)
- `DELETE /api/surveys/{id}` (Admin)

### 3. Responses Service (Port: 5003)
- Gestión de respuestas
- Envío de respuestas a encuestas

**Endpoints:**
- `POST /api/responses`
- `GET /api/responses/survey/{surveyId}`

### 4. Analytics Service (Port: 5004)
- Procesamiento de analíticas
- Generación de estadísticas

**Endpoints:**
- `GET /api/analytics/survey/{surveyId}`

### 5. API Gateway (Port: 8080)
- Punto de entrada único
- Enrutamiento a microservicios
- Load balancing

### 6. Frontend (Port: 3000)
- SPA con Nginx
- Archivos estáticos (HTML, CSS, JS)

### 7. SQL Server (Port: 1433)
- Base de datos compartida
- User: `sa`
- Password: `YourStrong!Passw0rd`

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 4GB de RAM disponible

### Paso 1: Construir las imágenes

```bash
docker-compose -f docker-compose.microservices.yml build
```

### Paso 2: Iniciar los servicios

```bash
docker-compose -f docker-compose.microservices.yml up -d
```

### Paso 3: Verificar que todos los servicios estén corriendo

```bash
docker-compose -f docker-compose.microservices.yml ps
```

### Paso 4: Ver logs de un servicio específico

```bash
# Auth service
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Surveys service
docker-compose -f docker-compose.microservices.yml logs -f surveys-service

# Todos los servicios
docker-compose -f docker-compose.microservices.yml logs -f
```

## 🌐 Acceso a los Servicios

Una vez iniciados todos los contenedores:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:5001
- **Surveys Service**: http://localhost:5002
- **Responses Service**: http://localhost:5003
- **Analytics Service**: http://localhost:5004
- **SQL Server**: localhost:1433

## 📝 Uso

### Opción 1: A través del Frontend (Recomendado)

1. Abrir navegador en: http://localhost:3000
2. Modificar `app.js` para usar la API Gateway:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

### Opción 2: Directamente con API Gateway

```bash
# Registro
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@test.com",
    "password": "Admin123!"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'

# Listar encuestas
curl -X GET http://localhost:8080/api/surveys \
  -H "Authorization: Bearer {tu-token-jwt}"
```

### Opción 3: Servicios individuales

Cada microservicio puede ser accedido directamente en su puerto:

```bash
# Auth service directo
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "Admin123!"}'
```

## 🛑 Detener los Servicios

```bash
# Detener todos los contenedores
docker-compose -f docker-compose.microservices.yml down

# Detener y eliminar volúmenes (¡Esto borrará la base de datos!)
docker-compose -f docker-compose.microservices.yml down -v
```

## 🔧 Comandos Útiles

### Reiniciar un servicio específico

```bash
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### Reconstruir un servicio específico

```bash
docker-compose -f docker-compose.microservices.yml build --no-cache auth-service
docker-compose -f docker-compose.microservices.yml up -d auth-service
```

### Ejecutar migraciones manualmente

```bash
docker exec -it surveyhub-auth dotnet ef database update
```

### Acceder al contenedor SQL Server

```bash
docker exec -it surveyhub-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd
```

### Ver estadísticas de recursos

```bash
docker stats
```

## 🐛 Troubleshooting

### Problema: SQL Server no inicia

**Solución:** Asegúrate de tener al menos 2GB de RAM disponible para el contenedor de SQL Server.

```bash
docker update --memory="2g" surveyhub-sqlserver
```

### Problema: Auth service falla en migraciones

**Solución:** El servicio puede necesitar más tiempo para que SQL Server esté listo.

```bash
# Reiniciar el servicio auth
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### Problema: No puedo conectarme desde el frontend

**Solución:** Verifica que la URL de la API en `app.js` apunte al API Gateway:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Problema: Puerto ya en uso

**Solución:** Cambiar los puertos en `docker-compose.microservices.yml`:

```yaml
ports:
  - "NUEVO_PUERTO:80"
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose -f docker-compose.microservices.yml logs -f

# Servicio específico
docker-compose -f docker-compose.microservices.yml logs -f auth-service
```

### Healthcheck de API Gateway

```bash
curl http://localhost:8080/health
```

## 🔒 Seguridad

**IMPORTANTE**: Los valores por defecto son solo para desarrollo. En producción:

1. Cambiar la contraseña de SQL Server
2. Cambiar la clave JWT
3. Usar HTTPS
4. Configurar variables de entorno seguras
5. No exponer puertos de microservicios directamente

## 📈 Escalabilidad

Para escalar un servicio específico:

```bash
docker-compose -f docker-compose.microservices.yml up -d --scale surveys-service=3
```

## 🏷️ Versiones

- .NET: 10.0
- SQL Server: 2022
- Nginx: Alpine (latest)
- Docker: 20.10+
- Docker Compose: 3.8+

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [ASP.NET Core Microservices](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

---

**Desarrollado por**: [Tu Nombre]
**Repositorio**: https://github.com/Andres821340/practica_examen.git
