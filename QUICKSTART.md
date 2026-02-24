# ?? Guía de Inicio Rápido

## Pasos para Ejecutar la Aplicación

### 1. Ejecutar Localmente (Método Más Rápido)

Abre una terminal en el directorio del proyecto y ejecuta:

```bash
cd Ejemplo
dotnet run
```

Espera a que veas el mensaje:
```
Now listening on: http://localhost:5000
```

Luego abre tu navegador en: **http://localhost:5000**

### 2. Ejecutar con Docker

Si prefieres usar Docker:

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

Abre tu navegador en: **http://localhost:5000**

## ?? Primeros Pasos en la Aplicación

### 1. Explorar Encuestas Existentes
- Al iniciar, verás **2 encuestas de ejemplo** ya creadas con respuestas
- Haz clic en **"?? Analíticas"** para ver gráficos interactivos

### 2. Crear tu Primera Encuesta
1. Clic en **"? Crear Encuesta"**
2. Completa el título y descripción
3. Haz clic en **"? Agregar Pregunta"**
4. Configura cada pregunta:
   - **Opción Múltiple**: Lista de opciones separadas por coma
   - **Texto**: Respuesta abierta
   - **Calificación**: Escala del 1 al 5
5. Haz clic en **"?? Guardar Encuesta"**

### 3. Responder una Encuesta
1. Clic en **"?? Responder"**
2. Selecciona una encuesta del menú
3. Completa todas las preguntas
4. Haz clic en **"? Enviar Respuestas"**

### 4. Ver Analíticas
1. Clic en **"?? Analíticas"**
2. Selecciona una encuesta
3. Verás:
   - **Chart.js**: Gráficos de barras y líneas
   - **Google Charts**: Gráficos de pastel (dona)
   - **Respuestas de texto**: Lista completa

## ?? Tipos de Gráficos Disponibles

### Para Preguntas de Opción Múltiple y Calificación:
- ? **Gráfico de Barras** (Chart.js) - Distribución de respuestas
- ? **Gráfico de Líneas** (Chart.js) - Tendencias
- ? **Gráfico de Pastel** (Google Charts) - Proporciones

### Para Preguntas de Texto:
- ? **Lista de respuestas** - Todas las respuestas en texto

## ?? Ejemplo de Encuesta

**Título**: Satisfacción del Curso
**Descripción**: Evalúa tu experiencia con el curso

**Preguntas**:
1. ¿Cómo calificas el contenido del curso? (Calificación 1-5)
2. ¿Recomendarías este curso? (Opción Múltiple: Sí, No, Tal vez)
3. ¿Qué te gustó más? (Texto)

## ?? Comandos Útiles

### Restaurar dependencias
```bash
dotnet restore
```

### Compilar el proyecto
```bash
dotnet build
```

### Limpiar archivos de compilación
```bash
dotnet clean
```

### Ejecutar en modo watch (recarga automática)
```bash
dotnet watch run --project Ejemplo/Ejemplo.csproj
```

## ?? API Endpoints

Puedes probar la API directamente:

### Obtener todas las encuestas
```bash
curl http://localhost:5000/api/surveys
```

### Crear una encuesta
```bash
curl -X POST http://localhost:5000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Encuesta",
    "description": "Descripción de la encuesta",
    "questions": [
      {
        "text": "¿Te gusta esta aplicación?",
        "type": 0,
        "options": ["Sí", "No"]
      }
    ]
  }'
```

### Obtener analíticas de una encuesta
```bash
curl http://localhost:5000/api/analytics/survey/1
```

## ?? Tips

- ? La aplicación viene con **datos de ejemplo precargados**
- ? Los datos se almacenan en **memoria** (se reinician al cerrar la app)
- ? Puedes crear **múltiples preguntas** por encuesta
- ? Los gráficos se generan **automáticamente** al recibir respuestas
- ? La interfaz es **responsive** y funciona en móviles

## ?? Solución de Problemas Comunes

### Error: Puerto en uso
Si el puerto 5000 está ocupado:
```bash
dotnet run --urls "http://localhost:5500"
```

### Error: No se muestran los gráficos
- Verifica tu conexión a Internet (Chart.js y Google Charts usan CDN)
- Abre la consola del navegador (F12) para ver errores

### Error de compilación
```bash
dotnet clean
dotnet restore
dotnet build
```

## ?? Arquitectura

```
???????????????????????????????????????????
?         Frontend (Bootstrap)            ?
?  - index.html                           ?
?  - app.js                               ?
?  - Chart.js / Google Charts             ?
???????????????????????????????????????????
              ? HTTP/REST
???????????????????????????????????????????
?     ASP.NET Core Web API (Backend)      ?
?  ???????????????????????????????????   ?
?  ?   Controllers                   ?   ?
?  ?  - SurveysController            ?   ?
?  ?  - ResponsesController          ?   ?
?  ?  - AnalyticsController          ?   ?
?  ???????????????????????????????????   ?
?  ???????????????????????????????????   ?
?  ?   Services                      ?   ?
?  ?  - SurveyService                ?   ?
?  ?  - ResponseService              ?   ?
?  ?  - AnalyticsService             ?   ?
?  ???????????????????????????????????   ?
?  ???????????????????????????????????   ?
?  ?   Data Storage (In-Memory)      ?   ?
?  ???????????????????????????????????   ?
???????????????????????????????????????????
```

## ? Próximos Pasos

1. ? Explorar las encuestas de ejemplo
2. ?? Crear tu propia encuesta
3. ?? Responder encuestas
4. ?? Visualizar los resultados con gráficos
5. ?? Personalizar la aplicación según tus necesidades

---

**¿Necesitas ayuda?** Revisa el README.md completo para más detalles.
