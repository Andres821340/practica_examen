# ?? Ejemplos de API

Esta guía contiene ejemplos prácticos de cómo usar la API de encuestas.

## ?? Herramientas Recomendadas

- **Postman** - Cliente API gráfico
- **cURL** - Línea de comandos
- **HTTPie** - Cliente HTTP moderno
- **Thunder Client** - Extensión de VS Code

## ?? Encuestas API

### 1. Obtener Todas las Encuestas

**Request:**
```http
GET http://localhost:5000/api/surveys
```

**cURL:**
```bash
curl http://localhost:5000/api/surveys
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Satisfacción del Servicio al Cliente",
    "description": "Ayúdanos a mejorar nuestro servicio con tus comentarios",
    "createdAt": "2024-01-15T10:30:00Z",
    "questions": [
      {
        "id": 1,
        "text": "¿Cómo calificarías nuestro servicio?",
        "type": 2,
        "options": ["1", "2", "3", "4", "5"]
      },
      {
        "id": 2,
        "text": "¿Recomendarías nuestro servicio a un amigo?",
        "type": 0,
        "options": ["Definitivamente sí", "Probablemente sí", "No estoy seguro"]
      }
    ]
  }
]
```

### 2. Obtener Encuesta por ID

**Request:**
```http
GET http://localhost:5000/api/surveys/1
```

**cURL:**
```bash
curl http://localhost:5000/api/surveys/1
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 1,
  "title": "Satisfacción del Servicio al Cliente",
  "description": "Ayúdanos a mejorar nuestro servicio con tus comentarios",
  "createdAt": "2024-01-15T10:30:00Z",
  "questions": [
    {
      "id": 1,
      "text": "¿Cómo calificarías nuestro servicio?",
      "type": 2,
      "options": ["1", "2", "3", "4", "5"]
    }
  ]
}
```

**Respuesta Error (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404
}
```

### 3. Crear Nueva Encuesta

**Request:**
```http
POST http://localhost:5000/api/surveys
Content-Type: application/json

{
  "title": "Evaluación del Producto",
  "description": "Queremos conocer tu opinión sobre nuestro producto",
  "questions": [
    {
      "text": "¿Qué tan satisfecho estás con el producto?",
      "type": 2,
      "options": ["1", "2", "3", "4", "5"]
    },
    {
      "text": "¿Qué característica te gusta más?",
      "type": 0,
      "options": ["Diseño", "Funcionalidad", "Precio", "Soporte"]
    },
    {
      "text": "¿Tienes alguna sugerencia?",
      "type": 1,
      "options": []
    }
  ]
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Evaluación del Producto",
    "description": "Queremos conocer tu opinión sobre nuestro producto",
    "questions": [
      {
        "text": "¿Qué tan satisfecho estás con el producto?",
        "type": 2,
        "options": ["1", "2", "3", "4", "5"]
      }
    ]
  }'
```

**PowerShell:**
```powershell
$body = @{
    title = "Evaluación del Producto"
    description = "Queremos conocer tu opinión sobre nuestro producto"
    questions = @(
        @{
            text = "¿Qué tan satisfecho estás con el producto?"
            type = 2
            options = @("1", "2", "3", "4", "5")
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/surveys" `
                  -Method Post `
                  -Body $body `
                  -ContentType "application/json"
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": 3,
  "title": "Evaluación del Producto",
  "description": "Queremos conocer tu opinión sobre nuestro producto",
  "createdAt": "2024-01-15T11:00:00Z",
  "questions": [
    {
      "id": 1,
      "text": "¿Qué tan satisfecho estás con el producto?",
      "type": 2,
      "options": ["1", "2", "3", "4", "5"]
    }
  ]
}
```

**Headers de Respuesta:**
```
Location: http://localhost:5000/api/surveys/3
```

### 4. Eliminar Encuesta

**Request:**
```http
DELETE http://localhost:5000/api/surveys/3
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/surveys/3
```

**Respuesta Exitosa (204 No Content):**
```
(Sin contenido en el cuerpo)
```

**Respuesta Error (404 Not Found):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404
}
```

## ?? Respuestas API

### 1. Obtener Respuestas por Encuesta

**Request:**
```http
GET http://localhost:5000/api/responses/survey/1
```

**cURL:**
```bash
curl http://localhost:5000/api/responses/survey/1
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "surveyId": 1,
    "submittedAt": "2024-01-15T12:30:00Z",
    "answers": [
      {
        "questionId": 1,
        "value": "5"
      },
      {
        "questionId": 2,
        "value": "Definitivamente sí"
      },
      {
        "questionId": 3,
        "value": "Excelente servicio!"
      }
    ]
  }
]
```

### 2. Enviar Respuesta a Encuesta

**Request:**
```http
POST http://localhost:5000/api/responses
Content-Type: application/json

{
  "surveyId": 1,
  "answers": [
    {
      "questionId": 1,
      "value": "5"
    },
    {
      "questionId": 2,
      "value": "Definitivamente sí"
    },
    {
      "questionId": 3,
      "value": "Muy buen servicio, rápido y eficiente"
    }
  ]
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "surveyId": 1,
    "answers": [
      {"questionId": 1, "value": "5"},
      {"questionId": 2, "value": "Definitivamente sí"},
      {"questionId": 3, "value": "Muy buen servicio"}
    ]
  }'
```

**PowerShell:**
```powershell
$body = @{
    surveyId = 1
    answers = @(
        @{ questionId = 1; value = "5" },
        @{ questionId = 2; value = "Definitivamente sí" },
        @{ questionId = 3; value = "Muy buen servicio" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/responses" `
                  -Method Post `
                  -Body $body `
                  -ContentType "application/json"
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": 6,
  "surveyId": 1,
  "submittedAt": "2024-01-15T13:00:00Z",
  "answers": [
    {
      "questionId": 1,
      "value": "5"
    },
    {
      "questionId": 2,
      "value": "Definitivamente sí"
    },
    {
      "questionId": 3,
      "value": "Muy buen servicio, rápido y eficiente"
    }
  ]
}
```

## ?? Analíticas API

### Obtener Analíticas de Encuesta

**Request:**
```http
GET http://localhost:5000/api/analytics/survey/1
```

**cURL:**
```bash
curl http://localhost:5000/api/analytics/survey/1
```

**Respuesta Exitosa (200 OK):**
```json
{
  "surveyId": 1,
  "surveyTitle": "Satisfacción del Servicio al Cliente",
  "totalResponses": 5,
  "questionAnalytics": [
    {
      "questionId": 1,
      "questionText": "¿Cómo calificarías nuestro servicio?",
      "questionType": 2,
      "responseDistribution": {
        "5": 3,
        "4": 2,
        "3": 0,
        "2": 0,
        "1": 0
      },
      "textResponses": []
    },
    {
      "questionId": 2,
      "questionText": "¿Recomendarías nuestro servicio a un amigo?",
      "questionType": 0,
      "responseDistribution": {
        "Definitivamente sí": 3,
        "Probablemente sí": 1,
        "No estoy seguro": 1
      },
      "textResponses": []
    },
    {
      "questionId": 3,
      "questionText": "¿Qué podríamos mejorar?",
      "questionType": 1,
      "responseDistribution": {},
      "textResponses": [
        "Todo está excelente!",
        "Mejorar los tiempos de respuesta",
        "El servicio es muy bueno",
        "Podrían ser más rápidos",
        "Excelente atención"
      ]
    }
  ]
}
```

**Respuesta Error (404 Not Found):**
```json
"Survey with ID 999 not found"
```

## ?? Tipos de Preguntas

### QuestionType Enum

```csharp
public enum QuestionType
{
    MultipleChoice = 0,  // Opción múltiple
    Text = 1,            // Texto libre
    Rating = 2           // Calificación (1-5)
}
```

### Ejemplos por Tipo

#### 1. Multiple Choice (Type = 0)
```json
{
  "text": "¿Cuál es tu color favorito?",
  "type": 0,
  "options": ["Rojo", "Azul", "Verde", "Amarillo"]
}
```

#### 2. Text (Type = 1)
```json
{
  "text": "¿Qué opinas sobre nuestro servicio?",
  "type": 1,
  "options": []
}
```

#### 3. Rating (Type = 2)
```json
{
  "text": "Califica tu experiencia",
  "type": 2,
  "options": ["1", "2", "3", "4", "5"]
}
```

## ?? Scripts de Prueba Completos

### Script de Prueba Completo (PowerShell)

```powershell
$baseUrl = "http://localhost:5000/api"

Write-Host "=== PRUEBA 1: Listar Encuestas ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/surveys" | ConvertTo-Json -Depth 10

Write-Host "`n=== PRUEBA 2: Crear Encuesta ===" -ForegroundColor Cyan
$newSurvey = @{
    title = "Encuesta de Prueba"
    description = "Esta es una encuesta de prueba"
    questions = @(
        @{
            text = "¿Te gusta esta API?"
            type = 0
            options = @("Sí", "No", "Tal vez")
        }
    )
} | ConvertTo-Json -Depth 10

$created = Invoke-RestMethod -Uri "$baseUrl/surveys" `
                              -Method Post `
                              -Body $newSurvey `
                              -ContentType "application/json"
$surveyId = $created.id
Write-Host "Encuesta creada con ID: $surveyId" -ForegroundColor Green

Write-Host "`n=== PRUEBA 3: Enviar Respuesta ===" -ForegroundColor Cyan
$response = @{
    surveyId = $surveyId
    answers = @(
        @{ questionId = $created.questions[0].id; value = "Sí" }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/responses" `
                  -Method Post `
                  -Body $response `
                  -ContentType "application/json"
Write-Host "Respuesta enviada" -ForegroundColor Green

Write-Host "`n=== PRUEBA 4: Ver Analíticas ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/analytics/survey/$surveyId" | ConvertTo-Json -Depth 10

Write-Host "`n=== PRUEBA 5: Eliminar Encuesta ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$baseUrl/surveys/$surveyId" -Method Delete
Write-Host "Encuesta eliminada" -ForegroundColor Green

Write-Host "`n=== TODAS LAS PRUEBAS COMPLETADAS ===" -ForegroundColor Green
```

### Script de Prueba (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== PRUEBA 1: Listar Encuestas ==="
curl -s $BASE_URL/surveys | jq

echo -e "\n=== PRUEBA 2: Crear Encuesta ==="
SURVEY_ID=$(curl -s -X POST $BASE_URL/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Encuesta de Prueba",
    "description": "Esta es una encuesta de prueba",
    "questions": [
      {
        "text": "¿Te gusta esta API?",
        "type": 0,
        "options": ["Sí", "No", "Tal vez"]
      }
    ]
  }' | jq -r '.id')

echo "Encuesta creada con ID: $SURVEY_ID"

echo -e "\n=== PRUEBA 3: Enviar Respuesta ==="
curl -s -X POST $BASE_URL/responses \
  -H "Content-Type: application/json" \
  -d "{
    \"surveyId\": $SURVEY_ID,
    \"answers\": [
      {\"questionId\": 1, \"value\": \"Sí\"}
    ]
  }" | jq

echo -e "\n=== PRUEBA 4: Ver Analíticas ==="
curl -s $BASE_URL/analytics/survey/$SURVEY_ID | jq

echo -e "\n=== PRUEBA 5: Eliminar Encuesta ==="
curl -s -X DELETE $BASE_URL/surveys/$SURVEY_ID

echo -e "\n=== TODAS LAS PRUEBAS COMPLETADAS ==="
```

## ?? Códigos de Estado HTTP

| Código | Significado | Uso en la API |
|--------|-------------|---------------|
| 200 OK | Éxito | GET exitoso |
| 201 Created | Recurso creado | POST exitoso (crear encuesta) |
| 204 No Content | Sin contenido | DELETE exitoso |
| 400 Bad Request | Solicitud inválida | Datos incorrectos |
| 404 Not Found | No encontrado | Encuesta/recurso no existe |
| 500 Internal Server Error | Error del servidor | Error inesperado |

## ?? Colección de Postman

Para importar en Postman, crea un archivo `survey-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Survey API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Surveys",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/surveys",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "surveys"]
        }
      }
    },
    {
      "name": "Create Survey",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Nueva Encuesta\",\n  \"description\": \"Descripción\",\n  \"questions\": [\n    {\n      \"text\": \"Pregunta?\",\n      \"type\": 0,\n      \"options\": [\"Sí\", \"No\"]\n    }\n  ]\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/surveys",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "surveys"]
        }
      }
    }
  ]
}
```

---

**¡Listo para probar tu API!** ??
