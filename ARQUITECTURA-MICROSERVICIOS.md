# Arquitectura de Microservicios - Survey Hub

## 📐 Diagrama de Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENTE (Navegador)                         │
│                     http://localhost:3000                            │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │
              ┌───────────────▼───────────────┐
              │     NGINX - Frontend          │
              │   (Contenedor Docker)         │
              │   - HTML, CSS, JavaScript     │
              │   - Port: 3000                │
              └───────────────┬───────────────┘
                              │
                              │ API Calls
                              │
              ┌───────────────▼───────────────┐
              │   NGINX - API Gateway         │
              │   (Reverse Proxy)             │
              │   - Port: 8080                │
              │   - Load Balancer             │
              │   - Routing Rules             │
              └───────────────┬───────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┬──────────────┐
        │                     │                     │              │
        │                     │                     │              │
┌───────▼──────┐   ┌─────────▼────────┐  ┌────────▼───────┐  ┌───▼──────────┐
│ Auth Service │   │ Surveys Service  │  │   Responses    │  │  Analytics   │
│              │   │                  │  │    Service     │  │   Service    │
│ - JWT Auth   │   │ - CRUD Surveys   │  │ - Submit Resp  │  │ - Statistics │
│ - Users CRUD │   │ - Questions      │  │ - Get Answers  │  │ - Charts     │
│ - Roles      │   │ - Validation     │  │ - Validation   │  │ - Reports    │
│              │   │                  │  │                │  │              │
│ ASP.NET 10   │   │ ASP.NET 10       │  │ ASP.NET 10     │  │ ASP.NET 10   │
│ Port: 5001   │   │ Port: 5002       │  │ Port: 5003     │  │ Port: 5004   │
└───────┬──────┘   └─────────┬────────┘  └────────┬───────┘  └───┬──────────┘
        │                    │                    │              │
        │                    │                    │              │
        └────────────────────┴────────────────────┴──────────────┘
                              │
                              │ Entity Framework Core
                              │
              ┌───────────────▼───────────────┐
              │   SQL Server 2022             │
              │   (Contenedor Docker)         │
              │                               │
              │   Database: SurveyHubDB       │
              │   - AspNetUsers               │
              │   - AspNetRoles               │
              │   - Surveys                   │
              │   - Questions                 │
              │   - SurveyResponses           │
              │   - Answers                   │
              │                               │
              │   Port: 1433                  │
              │   User: sa                    │
              │   Volume: sqlserver-data      │
              └───────────────────────────────┘
```

## 🔄 Flujo de Comunicación

### 1. Registro de Usuario

```
Cliente → Frontend (3000) 
    → API Gateway (8080) 
        → Auth Service (5001) 
            → SQL Server (1433)
```

### 2. Crear Encuesta

```
Cliente → Frontend (3000) 
    → API Gateway (8080) 
        → Surveys Service (5002) 
            → SQL Server (1433)
```

### 3. Responder Encuesta

```
Cliente → Frontend (3000) 
    → API Gateway (8080) 
        → Responses Service (5003) 
            → SQL Server (1433)
```

### 4. Ver Analíticas

```
Cliente → Frontend (3000) 
    → API Gateway (8080) 
        → Analytics Service (5004) 
            → SQL Server (1433)
                → Procesa datos
            ← Devuelve estadísticas
        ← JSON con gráficos
    ← Renderiza visualizaciones
```

## 🌐 Red Docker (surveyhub-network)

Todos los contenedores están en la misma red Docker:

```
surveyhub-network (bridge)
│
├── surveyhub-sqlserver (sqlserver:80)
├── surveyhub-auth (auth-service:80)
├── surveyhub-surveys (surveys-service:80)
├── surveyhub-responses (responses-service:80)
├── surveyhub-analytics (analytics-service:80)
├── surveyhub-gateway (api-gateway:80)
└── surveyhub-frontend (frontend:80)
```

## 📦 Volúmenes Persistentes

```
sqlserver-data/
└── /var/opt/mssql/
    ├── data/
    │   ├── SurveyHubDB.mdf
    │   └── SurveyHubDB_log.ldf
    └── backup/
```

## 🔐 Variables de Entorno

### Auth Service
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=sqlserver;...
Jwt__Key=secret-key
Jwt__Issuer=SurveyHubAuthService
Jwt__Audience=SurveyHubClient
```

### Otros Servicios
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=sqlserver;...
AuthService__Url=http://auth-service
```

## 🚀 Orden de Inicio

1. **SQL Server** (healthcheck: cada 10s)
2. **Auth Service** (depends_on: sqlserver healthy)
3. **Surveys Service** (depends_on: auth-service)
4. **Responses Service** (depends_on: auth, surveys)
5. **Analytics Service** (depends_on: auth, responses)
6. **API Gateway** (depends_on: all services)
7. **Frontend** (depends_on: gateway)

## 📊 Escalabilidad

Cada microservicio puede escalarse independientemente:

```powershell
# Escalar Surveys Service a 3 instancias
docker-compose -f docker-compose.microservices.yml up -d --scale surveys-service=3
```

El API Gateway distribuirá la carga automáticamente.

## 🔄 Comunicación entre Servicios

### HTTP REST

Los microservicios se comunican vía HTTP REST:

```
Responses Service → Surveys Service
Analytics Service → Responses Service
Todos los servicios → Auth Service (verificación de JWT)
```

### Base de Datos Compartida

Todos los microservicios comparten la misma base de datos SQL Server.

**Ventajas:**
- Transacciones ACID garantizadas
- Menor complejidad de sincronización
- Queries eficientes entre tablas

**Desventajas:**
- Acoplamiento a nivel de datos
- Escalabilidad limitada

**Evolución Futura:** Migrar a base de datos por microservicio.

## 🛡️ Seguridad

### API Gateway (Capa de Seguridad)
- Rate limiting (configuración futura)
- CORS headers
- Request validation
- SSL/TLS termination (producción)

### Microservicios
- JWT validation en cada endpoint protegido
- Autorización basada en roles
- Entity Framework protege contra SQL Injection

### SQL Server
- Usuario `sa` solo para desarrollo
- En producción: usuarios específicos por servicio
- Comunicación encriptada (TrustServerCertificate)

## 📈 Monitoreo (Futuro)

Servicios recomendados para agregar:

1. **Prometheus** - Métricas
2. **Grafana** - Dashboards
3. **Jaeger** - Distributed Tracing
4. **ELK Stack** - Centralización de logs

## 🎯 Ventajas de esta Arquitectura

✅ **Escalabilidad:** Cada servicio escala independientemente
✅ **Mantenibilidad:** Cambios aislados por servicio
✅ **Resiliencia:** Fallo de un servicio no afecta a todos
✅ **Desarrollo Paralelo:** Equipos independientes
✅ **Tecnologías Heterogéneas:** Posibilidad de mezclar lenguajes
✅ **Despliegue Independiente:** CI/CD por microservicio

## ⚠️ Desventajas y Consideraciones

❌ **Complejidad:** Más componentes para gestionar
❌ **Latencia:** Comunicación entre servicios agrega overhead
❌ **Debugging:** Más difícil rastrear errores entre servicios
❌ **Transacciones Distribuidas:** Complejidad adicional
❌ **Consistencia de Datos:** Eventual consistency en algunos casos

---

**Próxima Evolución:** 
- Implementar Event-Driven Architecture con RabbitMQ/Kafka
- Base de datos por microservicio
- Service Mesh (Istio)
- Circuit Breaker pattern (Polly)
