# ??? Arquitectura de Microservicios

## Descripción General

Esta aplicación implementa una arquitectura de microservicios utilizando ASP.NET Core Web API, donde diferentes servicios se encargan de responsabilidades específicas.

## ?? Componentes de la Arquitectura

### 1. API Gateway (Controladores)
Los controladores actúan como punto de entrada para las solicitudes HTTP:

```
???????????????????????????????????????
?      SurveysController              ?  ? Gestión de encuestas
?      ResponsesController            ?  ? Gestión de respuestas
?      AnalyticsController            ?  ? Servicios de analíticas
???????????????????????????????????????
```

### 2. Capa de Servicios (Business Logic)

#### SurveyService (Microservicio de Encuestas)
- **Responsabilidad**: CRUD de encuestas
- **Operaciones**:
  - ? Crear encuestas
  - ? Listar encuestas
  - ? Obtener encuesta por ID
  - ? Eliminar encuestas
- **Almacenamiento**: In-Memory (Singleton)

#### ResponseService (Microservicio de Respuestas)
- **Responsabilidad**: Gestión de respuestas a encuestas
- **Operaciones**:
  - ? Enviar respuestas
  - ? Obtener respuestas por encuesta
- **Almacenamiento**: In-Memory (Singleton)

#### AnalyticsService (Microservicio de Analíticas)
- **Responsabilidad**: Procesamiento y análisis de datos
- **Operaciones**:
  - ? Calcular estadísticas
  - ? Generar distribuciones de respuestas
  - ? Agregar respuestas de texto
- **Dependencias**: SurveyService, ResponseService
- **Alcance**: Scoped (nueva instancia por solicitud)

### 3. Capa de Datos
- **Tipo**: In-Memory Storage
- **Ventajas**:
  - ? Rápido para desarrollo y pruebas
  - ? Sin dependencias externas
  - ? Fácil de reemplazar con base de datos real

## ?? Flujo de Datos

### Crear Encuesta
```
Frontend ? POST /api/surveys ? SurveysController ? SurveyService ? In-Memory Store
```

### Responder Encuesta
```
Frontend ? POST /api/responses ? ResponsesController ? ResponseService ? In-Memory Store
```

### Ver Analíticas
```
Frontend ? GET /api/analytics/survey/{id} ? AnalyticsController
                                           ?
                                    AnalyticsService
                                    ?            ?
                            SurveyService    ResponseService
                                    ?                ?
                              In-Memory Store  In-Memory Store
                                    ?                ?
                               Procesamiento de Datos
                                         ?
                            Respuesta con Analíticas
                                         ?
                                    Frontend
```

## ?? Containerización con Docker

### Ventajas de Docker
1. ? **Portabilidad**: Ejecuta en cualquier entorno
2. ? **Aislamiento**: Cada servicio en su propio contenedor
3. ? **Escalabilidad**: Fácil de replicar y escalar
4. ? **Consistencia**: Mismo comportamiento en dev/prod

### Estructura Docker

```
docker-compose.yml
    ?
?????????????????????????????????
?   survey-api (Container)      ?
?   - ASP.NET Core Runtime      ?
?   - Puerto: 5000 ? 8080       ?
?   - Red: survey-network       ?
?????????????????????????????????
```

### Dockerfile Multi-Stage

```dockerfile
# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0
- Restaurar dependencias
- Compilar proyecto

# Etapa 2: Publish
- Publicar aplicación optimizada

# Etapa 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
- Copiar binarios publicados
- Configurar punto de entrada
```

**Beneficios**:
- ? Imagen final más pequeña
- ? Solo incluye runtime necesario
- ? Mejor seguridad

## ?? Comunicación entre Servicios

### RESTful API
- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **Autenticación**: Ninguna (puede añadirse JWT)
- **CORS**: Habilitado para desarrollo

### Endpoints Principales

| Método | Endpoint | Servicio | Descripción |
|--------|----------|----------|-------------|
| GET | /api/surveys | Survey | Lista todas las encuestas |
| GET | /api/surveys/{id} | Survey | Obtiene una encuesta |
| POST | /api/surveys | Survey | Crea una encuesta |
| DELETE | /api/surveys/{id} | Survey | Elimina una encuesta |
| GET | /api/responses/survey/{id} | Response | Obtiene respuestas |
| POST | /api/responses | Response | Envía una respuesta |
| GET | /api/analytics/survey/{id} | Analytics | Obtiene analíticas |

## ?? Patrón de Diseño

### Dependency Injection (DI)
```csharp
// Registro de servicios
builder.Services.AddSingleton<ISurveyService, SurveyService>();
builder.Services.AddSingleton<IResponseService, ResponseService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Inyección en controladores
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    
    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }
}
```

**Beneficios**:
- ? Bajo acoplamiento
- ? Fácil de testear
- ? Facilita cambios de implementación

### Repository Pattern (Implícito)
Los servicios actúan como repositorios para los datos:
- SurveyService ? Repositorio de encuestas
- ResponseService ? Repositorio de respuestas

## ?? Escalabilidad Futura

### Migrar a Microservicios Reales

#### Paso 1: Separar en Proyectos
```
/SurveyService.API
/ResponseService.API
/AnalyticsService.API
/Gateway.API
```

#### Paso 2: Base de Datos Distribuida
```
SurveyService ? PostgreSQL (Base de datos de encuestas)
ResponseService ? MongoDB (Base de datos de respuestas)
AnalyticsService ? Redis (Caché de analíticas)
```

#### Paso 3: API Gateway
```
???????????????????????????????
?      API Gateway            ?
?      (Ocelot/YARP)          ?
???????????????????????????????
              ?
    ?????????????????????
    ?         ?         ?
Survey    Response  Analytics
Service   Service   Service
```

#### Paso 4: Message Queue
```
ResponseService ? RabbitMQ/Kafka ? AnalyticsService
                                 ? NotificationService
```

### Características Adicionales

#### 1. Service Discovery
- **Consul** o **Eureka** para registro de servicios
- Descubrimiento dinámico de instancias

#### 2. Load Balancing
- **NGINX** o **Kubernetes** para balanceo de carga
- Múltiples instancias de cada servicio

#### 3. Circuit Breaker
- **Polly** para manejar fallos
- Reintentos y fallback

#### 4. Distributed Tracing
- **OpenTelemetry** para rastreo
- **Jaeger** para visualización

## ?? Seguridad

### Mejoras Recomendadas

#### 1. Autenticación y Autorización
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        // Configuración JWT
    });
```

#### 2. Rate Limiting
```csharp
builder.Services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("fixed", opt => {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
```

#### 3. HTTPS Obligatorio
```csharp
app.UseHttpsRedirection();
app.UseHsts();
```

## ?? Monitoreo

### Herramientas Recomendadas

1. **Application Insights** - Monitoreo de aplicaciones
2. **Prometheus + Grafana** - Métricas y visualización
3. **ELK Stack** - Logs centralizados
4. **Health Checks** - Estado de servicios

### Implementación de Health Checks
```csharp
builder.Services.AddHealthChecks()
    .AddCheck<SurveyServiceHealthCheck>("survey_service")
    .AddCheck<ResponseServiceHealthCheck>("response_service");

app.MapHealthChecks("/health");
```

## ?? Testing

### Estrategia de Pruebas

#### Unit Tests
```csharp
[Fact]
public async Task CreateSurvey_ShouldReturnCreatedSurvey()
{
    // Arrange
    var service = new SurveyService();
    var survey = new Survey { Title = "Test" };
    
    // Act
    var result = await service.CreateSurveyAsync(survey);
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test", result.Title);
}
```

#### Integration Tests
```csharp
[Fact]
public async Task AnalyticsEndpoint_ShouldReturnData()
{
    var client = _factory.CreateClient();
    var response = await client.GetAsync("/api/analytics/survey/1");
    response.EnsureSuccessStatusCode();
}
```

## ?? Conclusión

Esta arquitectura proporciona:
- ? **Separación de responsabilidades**
- ? **Escalabilidad horizontal**
- ? **Facilidad de mantenimiento**
- ? **Base sólida para crecimiento**

El diseño actual es perfecto para **desarrollo y MVP**. Para **producción**, considera implementar las mejoras de escalabilidad y seguridad mencionadas.

---

**Diseñado para crecer con tu aplicación** ??
