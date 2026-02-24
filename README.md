# ?? Sistema de Encuestas y Analíticas

Sistema de encuestas con arquitectura de microservicios, desarrollado con **ASP.NET Core Web API** y **Bootstrap**, que permite crear, responder y visualizar analíticas de encuestas con gráficos interactivos.

## ?? Características

### Backend (ASP.NET Core Web API)
- ? **Microservicios RESTful**
  - API de Encuestas (crear, listar, eliminar)
  - API de Respuestas (enviar respuestas)
  - API de Analíticas (obtener estadísticas y visualizaciones)
- ? **Arquitectura limpia** con servicios y controladores separados
- ? **Almacenamiento en memoria** (fácilmente extensible a base de datos)
- ? **CORS habilitado** para desarrollo

### Frontend
- ? **Bootstrap 5** para diseño responsive
- ? **Interfaz de usuario intuitiva** con navegación por pestañas
- ? **Funcionalidades completas:**
  - ?? **Crear encuestas** con múltiples tipos de preguntas
  - ?? **Responder encuestas** con formularios dinámicos
  - ?? **Visualizar analíticas** con gráficos interactivos

### Analíticas y Visualización
- ? **Chart.js** - Gráficos de barras y líneas
- ? **Google Charts** - Gráficos de pastel (dona)
- ? Soporte para tres tipos de preguntas:
  - ?? Opción múltiple
  - ?? Texto libre
  - ? Calificación (1-5)

### Docker
- ? **Dockerfile** optimizado con multi-stage build
- ? **docker-compose.yml** para fácil despliegue
- ? Configuración de red para microservicios

## ?? Requisitos

- .NET 10.0 SDK
- Docker y Docker Compose (opcional)
- Navegador web moderno

## ??? Instalación y Ejecución

### Opción 1: Ejecución Local

1. **Clonar o navegar al directorio del proyecto**
   ```bash
   cd C:\Users\USER\source\repos\Ejemplo
   ```

2. **Restaurar dependencias**
   ```bash
   dotnet restore
   ```

3. **Ejecutar la aplicación**
   ```bash
   dotnet run --project Ejemplo/Ejemplo.csproj
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5000
   o
   https://localhost:5001
   ```

### Opción 2: Docker

1. **Construir la imagen**
   ```bash
   docker-compose build
   ```

2. **Ejecutar los contenedores**
   ```bash
   docker-compose up
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:5000
   ```

## ?? Estructura del Proyecto

```
Ejemplo/
??? Controllers/
?   ??? SurveysController.cs      # API de encuestas
?   ??? ResponsesController.cs    # API de respuestas
?   ??? AnalyticsController.cs    # API de analíticas
??? Models/
?   ??? Survey.cs                 # Modelo de encuesta
?   ??? SurveyResponse.cs         # Modelo de respuesta
?   ??? AnalyticsData.cs          # Modelo de analíticas
??? Services/
?   ??? SurveyService.cs          # Lógica de negocio de encuestas
?   ??? ResponseService.cs        # Lógica de negocio de respuestas
?   ??? AnalyticsService.cs       # Lógica de negocio de analíticas
??? wwwroot/
?   ??? index.html                # Aplicación frontend
?   ??? app.js                    # Lógica JavaScript
??? Program.cs                    # Configuración de la aplicación
??? Dockerfile                    # Configuración Docker
??? Ejemplo.csproj               # Configuración del proyecto
```

## ?? API Endpoints

### Encuestas
- `GET /api/surveys` - Obtener todas las encuestas
- `GET /api/surveys/{id}` - Obtener una encuesta específica
- `POST /api/surveys` - Crear una nueva encuesta
- `DELETE /api/surveys/{id}` - Eliminar una encuesta

### Respuestas
- `GET /api/responses/survey/{surveyId}` - Obtener respuestas de una encuesta
- `POST /api/responses` - Enviar una respuesta

### Analíticas
- `GET /api/analytics/survey/{surveyId}` - Obtener analíticas de una encuesta

## ?? Tipos de Gráficos Disponibles

### Chart.js
- **Gráfico de Barras**: Muestra la distribución de respuestas
- **Gráfico de Líneas**: Visualiza tendencias

### Google Charts
- **Gráfico de Pastel (Dona)**: Muestra proporciones en formato circular

## ?? Ejemplos de Uso

### 1. Crear una Encuesta

```json
POST /api/surveys
{
  "title": "Satisfacción del Servicio",
  "description": "Encuesta de satisfacción del cliente",
  "questions": [
    {
      "text": "¿Cómo calificaría nuestro servicio?",
      "type": 2,
      "options": ["1", "2", "3", "4", "5"]
    },
    {
      "text": "¿Recomendaría nuestro servicio?",
      "type": 0,
      "options": ["Sí", "No", "Tal vez"]
    },
    {
      "text": "Comentarios adicionales",
      "type": 1,
      "options": []
    }
  ]
}
```

### 2. Responder una Encuesta

```json
POST /api/responses
{
  "surveyId": 1,
  "answers": [
    { "questionId": 1, "value": "5" },
    { "questionId": 2, "value": "Sí" },
    { "questionId": 3, "value": "Excelente servicio!" }
  ]
}
```

## ?? Interfaz de Usuario

La aplicación incluye cuatro secciones principales:

1. **?? Encuestas**: Lista todas las encuestas creadas
2. **? Crear Encuesta**: Formulario para crear nuevas encuestas
3. **?? Responder**: Interfaz para responder encuestas
4. **?? Analíticas**: Visualización de resultados con gráficos

## ?? Personalización

### Cambiar el puerto de la aplicación

Editar `docker-compose.yml`:
```yaml
ports:
  - "5000:8080"  # Cambiar 5000 al puerto deseado
```

### Agregar persistencia de datos

Reemplazar los servicios en memoria por Entity Framework Core:

1. Agregar paquete NuGet:
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   ```

2. Crear DbContext y migrar a base de datos SQL Server, PostgreSQL, etc.

## ?? Solución de Problemas

### La aplicación no inicia
- Verificar que el puerto 5000/5001 no esté en uso
- Ejecutar: `dotnet clean` y `dotnet build`

### Error de CORS
- Verificar que CORS esté habilitado en `Program.cs`
- Comprobar que la URL del API coincida con la configuración

### Gráficos no se muestran
- Verificar la conexión a Internet (Chart.js y Google Charts se cargan desde CDN)
- Abrir la consola del navegador para ver errores

## ?? Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## ?? Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## ?? Soporte

Para problemas o preguntas, por favor abre un issue en el repositorio del proyecto.

---

**Desarrollado con ?? usando ASP.NET Core, Bootstrap, Chart.js y Google Charts**
