# Guía para la Propuesta de Proyecto
## Sistema de Gestión de Encuestas Web (Survey Hub)

---

## 📋 ÍNDICE

1. [Información General del Proyecto](#1-información-general-del-proyecto)
2. [Objetivos del Proyecto](#2-objetivos-del-proyecto)
3. [Justificación](#3-justificación)
4. [Alcance del Proyecto](#4-alcance-del-proyecto)
5. [Tecnologías Utilizadas](#5-tecnologías-utilizadas)
6. [Arquitectura del Sistema](#6-arquitectura-del-sistema)
7. [Funcionalidades Principales](#7-funcionalidades-principales)
8. [Guía para Capturas de Pantalla](#8-guía-para-capturas-de-pantalla)
9. [Resultados Esperados](#9-resultados-esperados)
10. [Cronograma](#10-cronograma)

---

## 1. INFORMACIÓN GENERAL DEL PROYECTO

### 1.1 Título del Proyecto
**Sistema de Gestión de Encuestas Web (Survey Hub)**

### 1.2 Tipo de Proyecto
**Aplicación Web Full-Stack** - Sistema de gestión de información

### 1.3 Área de Aplicación
- **Educación**: Evaluación docente, satisfacción estudiantil
- **Empresarial**: Feedback de empleados, evaluación de servicios
- **Investigación**: Recopilación de datos cualitativos y cuantitativos
- **Organizaciones**: Toma de decisiones basada en datos

### 1.4 Contexto
En el entorno actual, las organizaciones necesitan herramientas eficientes para recopilar opiniones, medir satisfacción y tomar decisiones basadas en datos. Las plataformas comerciales existentes presentan limitaciones en costos, personalización y control de datos.

---

## 2. OBJETIVOS DEL PROYECTO

### 2.1 Objetivo General
Desarrollar un sistema web integral de gestión de encuestas que permita la creación, distribución, recopilación y análisis de encuestas en línea, con autenticación segura, gestión de roles y visualización avanzada de datos mediante gráficos interactivos.

### 2.2 Objetivos Específicos

1. **Objetivo 1**: Implementar un sistema de autenticación y autorización seguro
   - Registro de usuarios con validación de datos
   - Inicio de sesión con tokens JWT
   - Gestión de roles (Administrador y Usuario)
   - Protección de endpoints mediante autorización basada en roles

2. **Objetivo 2**: Desarrollar módulo de gestión de encuestas
   - Crear encuestas con múltiples tipos de preguntas
   - Listar encuestas creadas
   - Eliminar encuestas
   - Validación de datos en tiempo real

3. **Objetivo 3**: Implementar sistema de respuesta a encuestas
   - Renderizado dinámico de formularios según tipo de pregunta
   - Almacenamiento de respuestas en base de datos
   - Validación de campos requeridos
   - Confirmación de envío exitoso

4. **Objetivo 4**: Crear módulo de analíticas con visualización de datos
   - Procesamiento estadístico de respuestas
   - Generación de gráficos de pastel (Google Charts)
   - Generación de gráficos de líneas (Chart.js)
   - Exportación de datos (futuro)

5. **Objetivo 5**: Diseñar interfaz de usuario intuitiva y responsiva
   - Diseño moderno con CSS personalizado
   - Navegación clara entre módulos
   - Feedback visual inmediato
   - Adaptación a dispositivos móviles

---

## 3. JUSTIFICACIÓN

### 3.1 Problema Identificado
Las organizaciones enfrentan varios desafíos al usar sistemas de encuestas actuales:

1. **Costos elevados**: Plataformas comerciales como SurveyMonkey requieren suscripciones costosas
2. **Limitaciones de personalización**: Restricciones en diseño y funcionalidades
3. **Falta de control de datos**: Datos almacenados en servidores externos
4. **Análisis básico**: Herramientas limitadas de visualización y análisis
5. **Dependencia de internet**: Sin opciones offline

### 3.2 Necesidad del Proyecto
Se requiere una solución que:
- Sea **accesible económicamente** (costo de hosting únicamente)
- Permita **personalización completa**
- Ofrezca **control total de los datos**
- Proporcione **análisis avanzados** con gráficos interactivos
- Garantice **seguridad de la información**

### 3.3 Beneficios Esperados

**Para Instituciones Educativas**:
- Evaluación continua del desempeño docente
- Medición de satisfacción estudiantil
- Toma de decisiones basada en datos
- Reducción de costos operativos

**Para Empresas**:
- Recopilación de feedback de empleados
- Evaluación de servicios y productos
- Análisis de clima organizacional
- Reportes visuales para directivos

**Para Investigadores**:
- Herramienta gratuita de recopilación de datos
- Análisis estadístico integrado
- Exportación de datos para análisis avanzado
- Control completo del proceso de investigación

---

## 4. ALCANCE DEL PROYECTO

### 4.1 Funcionalidades Incluidas (Dentro del Alcance)

✅ **Módulo de Autenticación**
- Registro de usuarios con validación
- Inicio de sesión con JWT
- Gestión de sesiones persistentes
- Cambio de contraseña

✅ **Módulo de Gestión de Encuestas** (Solo Administradores)
- Crear encuestas con título y descripción
- Agregar preguntas de 3 tipos:
  - Opción múltiple
  - Texto libre
  - Calificación (1-5)
- Eliminar encuestas
- Listar encuestas creadas

✅ **Módulo de Respuestas** (Todos los usuarios autenticados)
- Seleccionar encuesta disponible
- Responder preguntas dinámicamente
- Validación de respuestas
- Envío y confirmación

✅ **Módulo de Analíticas** (Solo Administradores)
- Visualización de resultados por encuesta
- Gráficos de pastel para distribución de respuestas
- Gráficos de líneas para tendencias
- Listado de respuestas de texto libre
- Contador de respuestas totales

✅ **Módulo de Gestión de Usuarios** (Solo Administradores)
- Listar usuarios registrados
- Ver roles de usuarios
- Eliminar usuarios

✅ **Configuración de Perfil**
- Ver información personal
- Cambiar contraseña
- Ver rol asignado

### 4.2 Funcionalidades No Incluidas (Fuera del Alcance - Trabajo Futuro)

❌ Exportación de resultados a PDF/Excel
❌ Tipos de preguntas adicionales (escala Likert, matriz, ranking)
❌ Encuestas anónimas
❌ Modo offline
❌ Aplicación móvil nativa
❌ Análisis predictivo con Machine Learning
❌ Integración con sistemas externos (APIs)
❌ Notificaciones por email
❌ Sistema de plantillas de encuestas

---

## 5. TECNOLOGÍAS UTILIZADAS

### 5.1 Backend (.NET 10)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **ASP.NET Core** | 10.0 | Framework web principal |
| **Entity Framework Core** | 10.0 | ORM para acceso a datos |
| **ASP.NET Identity** | 10.0 | Gestión de usuarios y autenticación |
| **JWT Bearer** | 10.0 | Autenticación con tokens |
| **SQL Server** | 2019+ | Base de datos relacional |

**Justificación**:
- **.NET 10**: Última versión estable con mejor rendimiento
- **Entity Framework Core**: Abstracción de base de datos, migraciones automáticas
- **JWT**: Autenticación stateless, escalable
- **SQL Server**: Robustez, soporte empresarial

### 5.2 Frontend (SPA - Single Page Application)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos y diseño responsivo |
| **JavaScript ES6+** | - | Lógica del cliente |
| **Chart.js** | 4.x | Gráficos de líneas |
| **Google Charts** | - | Gráficos de pastel |
| **Bootstrap Icons** | 1.11 | Iconografía |

**Justificación**:
- **Vanilla JavaScript**: Sin dependencias pesadas, rendimiento óptimo
- **Chart.js + Google Charts**: Combinación para diversos tipos de visualización
- **CSS Variables**: Temas personalizables
- **Diseño responsivo**: Accesibilidad móvil

### 5.3 Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Visual Studio 2024** | IDE para desarrollo backend |
| **VS Code** | Editor para frontend |
| **Git** | Control de versiones |
| **Postman** | Pruebas de API |
| **Chrome DevTools** | Debug y optimización |
| **SQL Server Management Studio** | Gestión de base de datos |

---

## 6. ARQUITECTURA DEL SISTEMA

### 6.1 Patrón Arquitectónico
**Arquitectura N-Capas (3 Capas)** con separación Frontend-Backend

```
┌─────────────────────────────────────────────┐
│         FRONTEND (SPA)                      │
│  - HTML5 + CSS3 + JavaScript ES6+           │
│  - Gestión de estado del cliente            │
│  - Renderizado dinámico                     │
│  - Integración de librerías de gráficos     │
└──────────────┬──────────────────────────────┘
               │ HTTPS/JSON (REST API)
               │
┌──────────────┴──────────────────────────────┐
│         BACKEND (API REST)                  │
│  ┌─────────────────────────────────────┐   │
│  │ CAPA DE CONTROLADORES               │   │
│  │ - AuthController                    │   │
│  │ - SurveysController                 │   │
│  │ - ResponsesController               │   │
│  │ - AnalyticsController               │   │
│  │ - UsersController                   │   │
│  └────────────┬────────────────────────┘   │
│               │                              │
│  ┌────────────┴────────────────────────┐   │
│  │ CAPA DE SERVICIOS                   │   │
│  │ - SurveyService (lógica de negocio) │   │
│  │ - ResponseService                   │   │
│  │ - AnalyticsService                  │   │
│  └────────────┬────────────────────────┘   │
│               │                              │
│  ┌────────────┴────────────────────────┐   │
│  │ CAPA DE ACCESO A DATOS              │   │
│  │ - ApplicationDbContext (EF Core)    │   │
│  │ - Modelos de dominio                │   │
│  └────────────┬────────────────────────┘   │
└───────────────┼──────────────────────────────┘
                │
┌───────────────┴──────────────────────────────┐
│         BASE DE DATOS (SQL Server)           │
│  - Tabla: AspNetUsers                        │
│  - Tabla: AspNetRoles                        │
│  - Tabla: Surveys                            │
│  - Tabla: Questions                          │
│  - Tabla: SurveyResponses                    │
│  - Tabla: Answers                            │
└──────────────────────────────────────────────┘
```

### 6.2 Modelo de Datos

```
ApplicationUser (1) ──────< (N) Survey
                                  │
                                  ├──────< (N) Question
                                  │
                                  └──────< (N) SurveyResponse
                                                    │
                                                    └──────< (N) Answer
                                                                  │
                                                    Question (1) ─┘
```

**Entidades Principales**:

1. **ApplicationUser** (heredada de IdentityUser)
   - Id (PK, string)
   - FullName (string)
   - Email (string, unique)
   - PasswordHash (string)
   - CreatedAt (DateTime)

2. **Survey**
   - Id (PK, int)
   - Title (string)
   - Description (string)
   - CreatedAt (DateTime)
   - CreatedByUserId (FK, string)

3. **Question**
   - Id (PK, int)
   - Text (string)
   - Type (enum: MultipleChoice=0, Text=1, Rating=2)
   - Options (string, JSON serializado)
   - SurveyId (FK, int)

4. **SurveyResponse**
   - Id (PK, int)
   - SurveyId (FK, int)
   - UserId (FK, string)
   - SubmittedAt (DateTime)

5. **Answer**
   - Id (PK, int)
   - ResponseId (FK, int)
   - QuestionId (FK, int)
   - Value (string)

---

## 7. FUNCIONALIDADES PRINCIPALES

### 7.1 Autenticación y Seguridad

**Características**:
- ✅ Hash de contraseñas con PBKDF2 (ASP.NET Identity)
- ✅ Tokens JWT con expiración de 7 días
- ✅ Validación de tokens en cada request protegido
- ✅ Roles: Administrador y Usuario
- ✅ Protección contra inyección SQL (Entity Framework parametriza queries)
- ✅ CORS configurado

**Código Clave** (AuthController.cs):
```csharp
// Generación de token JWT
private async Task<AuthResponse> GenerateJwtToken(ApplicationUser user)
{
    var roles = await _userManager.GetRolesAsync(user);
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? "Usuario")
    };
    
    // Token válido por 7 días
    var expiration = DateTime.UtcNow.AddDays(7);
    
    // Firma con clave simétrica
    var token = new JwtSecurityToken(
        claims: claims,
        expires: expiration,
        signingCredentials: creds
    );
}
```

### 7.2 Gestión de Encuestas

**Flujo de Creación**:
1. Administrador crea encuesta con título y descripción
2. Agrega preguntas dinámicamente
3. Selecciona tipo de pregunta (Opción Múltiple, Texto, Calificación)
4. Define opciones (si aplica)
5. Sistema valida y guarda en base de datos

**Código Clave** (app.js - Frontend):
```javascript
// Agregar pregunta dinámica
function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionHtml = `
        <div class="question-card-modern" id="question-${questionCount}">
            <div class="question-header-modern">
                <span>Pregunta ${questionCount}</span>
                <button onclick="removeQuestion(${questionCount})">
                    Eliminar
                </button>
            </div>
            
            <input type="text" class="question-text" 
                   placeholder="¿Cuál es tu pregunta?" required>
            
            <select class="question-type" 
                    onchange="updateQuestionOptions(${questionCount})">
                <option value="0">Opción Múltiple</option>
                <option value="1">Texto Libre</option>
                <option value="2">Calificación (1-5)</option>
            </select>
            
            <input type="text" class="question-options" 
                   placeholder="Opción 1, Opción 2, Opción 3">
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHtml);
}
```

### 7.3 Sistema de Respuestas

**Flujo**:
1. Usuario selecciona encuesta de lista desplegable
2. Sistema carga preguntas dinámicamente según tipo
3. Usuario responde cada pregunta
4. Sistema valida campos requeridos
5. Respuestas se guardan en base de datos

### 7.4 Analíticas y Visualización

**Procesamiento de Datos**:
- Conteo de respuestas por opción
- Cálculo de porcentajes
- Agrupación de respuestas de texto

**Visualización Dual**:
1. **Gráfico de Pastel** (Google Charts)
   - Distribución de respuestas
   - Colores distintivos
   - Valores absolutos

2. **Gráfico de Líneas** (Chart.js)
   - Tendencia de respuestas
   - Puntos interactivos
   - Tooltips informativos

**Código Clave** (app.js - Gráficos):
```javascript
// Gráfico de pastel con Google Charts
function drawPieChart(chartId, distribution) {
    const dataArray = [['Opción', 'Cantidad']];
    
    for (const [key, value] of Object.entries(distribution)) {
        dataArray.push([key, value]);
    }
    
    const data = google.visualization.arrayToDataTable(dataArray);
    
    const options = {
        pieHole: 0.4,
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        legend: { position: 'bottom' }
    };
    
    const chart = new google.visualization.PieChart(
        document.getElementById(chartId)
    );
    chart.draw(data, options);
}
```

---

## 8. GUÍA PARA CAPTURAS DE PANTALLA

### 8.1 Preparación del Entorno

**Antes de tomar capturas**:
1. ✅ Crear usuario administrador de prueba
   - Email: admin@surveyhub.com
   - Nombre: Juan Pérez (Administrador)

2. ✅ Crear usuario regular de prueba
   - Email: usuario@surveyhub.com
   - Nombre: María García (Usuario)

3. ✅ Crear encuestas de ejemplo:
   - **Encuesta 1**: "Encuesta de Satisfacción Estudiantil"
     - Descripción: "Evaluación del desempeño docente y servicios académicos"
     - 5 preguntas variadas
   
   - **Encuesta 2**: "Evaluación de Capacitación Empresarial"
     - Descripción: "Feedback sobre curso de liderazgo organizacional"
     - 8 preguntas

4. ✅ Responder encuestas con múltiples usuarios (al menos 10-15 respuestas por encuesta)

### 8.2 Capturas Requeridas

#### **CAPTURA 1: Pantalla de Login/Registro**

**Dónde tomar la captura**:
- URL: `http://localhost:5000` (o tu puerto configurado)
- Vista inicial del sistema

**Qué debe mostrar**:
- ✅ Logo "Survey Hub" con icono
- ✅ Tabs "Iniciar Sesión" y "Registrarse"
- ✅ Formulario de login visible con:
  - Campo Email con placeholder "tu@email.com"
  - Campo Contraseña con placeholder "Mínimo 6 caracteres"
  - Botón "Iniciar Sesión" con icono
- ✅ Diseño moderno con degradado de fondo morado/azul

**Cómo tomarla**:
1. Abrir navegador en modo incógnito
2. Navegar a la URL del proyecto
3. Asegurar que esté seleccionado el tab "Iniciar Sesión"
4. Tomar captura de pantalla completa (F12 para abrir DevTools, Ctrl+Shift+P → "Capture full size screenshot")

**Archivo sugerido**: `01_login_registro.png`

---

#### **CAPTURA 2: Dashboard Administrador - Lista de Encuestas**

**Dónde tomar la captura**:
- Iniciar sesión como administrador (admin@surveyhub.com)
- Vista: "Mis Encuestas" (debe estar activa por defecto)

**Qué debe mostrar**:
- ✅ Barra superior con "Hola, Juan Pérez" y botón "Salir"
- ✅ Menú lateral con todas las opciones:
  - 📋 Mis Encuestas (activo)
  - ➕ Crear Encuesta
  - 📊 Analíticas
  - 👥 Usuarios
  - 📝 Respuestas
  - ⚙️ Ajustes
- ✅ Área principal con:
  - Título "MIS ENCUESTAS"
  - Botón "+ Nueva Encuesta"
  - Al menos 2 cards de encuestas mostrando:
    - Icono de encuesta
    - Título de la encuesta
    - Descripción
    - Badge con número de preguntas
    - Fecha de creación
    - Botones "Editar" y "Eliminar"

**Cómo tomarla**:
1. Hacer login como administrador
2. Asegurar que haya al menos 2 encuestas creadas
3. Verificar que la vista "Mis Encuestas" esté activa
4. Tomar captura de pantalla completa

**Archivo sugerido**: `02_dashboard_admin.png`

---

#### **CAPTURA 3: Formulario de Creación de Encuesta**

**Dónde tomar la captura**:
- Click en botón "Crear Encuesta" o "+ Nueva Encuesta"
- Vista de creación activa

**Qué debe mostrar**:
- ✅ Título "CREAR NUEVA ENCUESTA"
- ✅ Campos del formulario:
  - Campo "Título de la encuesta" con texto de ejemplo
  - Campo "Descripción" con texto de ejemplo
- ✅ Sección "Preguntas" con al menos 2 preguntas:
  - **Pregunta 1**:
    - Texto: "¿Cómo califica la atención del docente?"
    - Tipo: "Calificación (1-5)"
    - Opciones: "1, 2, 3, 4, 5"
    - Botón "X Eliminar"
  
  - **Pregunta 2**:
    - Texto: "¿Qué aspectos podrían mejorar?"
    - Tipo: "Texto Libre"
    - (Sin campo de opciones visible)
    - Botón "X Eliminar"

- ✅ Botón "+ Agregar Pregunta"
- ✅ Botones "Crear Encuesta" y "Cancelar"

**Cómo tomarla**:
1. Click en "Crear Encuesta"
2. Llenar título: "Encuesta de Satisfacción Estudiantil"
3. Llenar descripción: "Esta encuesta evalúa la experiencia de los estudiantes durante el semestre"
4. Agregar 2 preguntas como se describe arriba
5. Tomar captura de pantalla completa

**Archivo sugerido**: `03_crear_encuesta.png`

---

#### **CAPTURA 4: Interfaz de Responder Encuesta**

**Dónde tomar la captura**:
- Cerrar sesión de administrador
- Iniciar sesión como usuario regular (usuario@surveyhub.com)
- Click en "📝 Responder" en el menú lateral
- Seleccionar una encuesta del dropdown

**Qué debe mostrar**:
- ✅ Título "RESPONDER ENCUESTA"
- ✅ Dropdown con encuesta seleccionada
- ✅ Card de información de la encuesta:
  - Título de la encuesta
  - Descripción
- ✅ Preguntas renderizadas dinámicamente:
  - **Pregunta de Opción Múltiple**:
    - Texto de la pregunta
    - Radio buttons con opciones
  
  - **Pregunta de Texto Libre**:
    - Texto de la pregunta
    - Textarea para respuesta
  
  - **Pregunta de Calificación**:
    - Texto de la pregunta
    - Radio buttons numerados (1-5)

- ✅ Botón "Enviar Respuestas"

**Cómo tomarla**:
1. Login como usuario regular
2. Click en "Responder"
3. Seleccionar encuesta "Encuesta de Satisfacción Estudiantil"
4. Llenar algunas respuestas (NO enviar aún)
5. Tomar captura de pantalla completa

**Archivo sugerido**: `04_responder_encuesta.png`

---

#### **CAPTURA 5: Dashboard de Analíticas con Gráficos**

**Dónde tomar la captura**:
- Cerrar sesión de usuario
- Iniciar sesión como administrador
- Click en "📊 Analíticas" en el menú lateral
- Seleccionar encuesta con respuestas

**Qué debe mostrar**:
- ✅ Título "ANALÍTICAS"
- ✅ Dropdown con encuesta seleccionada
- ✅ Header con:
  - Título de la encuesta
  - Badge con total de respuestas (ej: "45 respuestas")
- ✅ Por cada pregunta (mostrar al menos 2):
  
  **Para pregunta de Opción Múltiple/Calificación**:
  - Texto de la pregunta numerado
  - Grid con 2 columnas:
    - **Columna izquierda**: Gráfico de pastel (Google Charts)
      - Colores distintivos
      - Valores absolutos visibles
      - Leyenda en la parte inferior
    
    - **Columna derecha**: Gráfico de líneas (Chart.js)
      - Línea con puntos
      - Ejes etiquetados
      - Colores del tema
  
  **Para pregunta de Texto Libre**:
  - Sección "Respuestas de texto libre"
  - Lista con al menos 3 respuestas de ejemplo:
    - "Más tiempo para consultas"
    - "Los materiales están desactualizados"
    - "Excelente curso, nada que mejorar"

**Cómo tomarla**:
1. Asegurar que haya al menos 15-20 respuestas en la encuesta
2. Login como administrador
3. Click en "Analíticas"
4. Seleccionar encuesta con más respuestas
5. Esperar a que todos los gráficos se rendericen completamente
6. Scroll para mostrar al menos 2 preguntas con gráficos
7. Tomar captura de pantalla completa

**Archivo sugerido**: `05_analiticas_graficos.png`

---

#### **CAPTURA 6: Gestión de Usuarios (Solo Administrador)**

**Dónde tomar la captura**:
- Sesión de administrador
- Click en "👥 Usuarios" en el menú lateral

**Qué debe mostrar**:
- ✅ Título "GESTIÓN DE USUARIOS"
- ✅ Tabla con columnas:
  - Nombre Completo
  - Email
  - Rol (badge con color)
  - Fecha de Registro
  - Acciones
- ✅ Al menos 3-5 usuarios listados:
  - 1 Administrador (badge morado)
  - 2-4 Usuarios regulares (badge azul)
- ✅ Botón "Eliminar" por cada usuario
- ✅ Estilos de hover en filas

**Cómo tomarla**:
1. Crear 3-5 usuarios de prueba si no existen
2. Login como administrador
3. Click en "Usuarios"
4. Pasar el mouse sobre una fila para mostrar efecto hover
5. Tomar captura de pantalla completa

**Archivo sugerido**: `06_gestion_usuarios.png`

---

#### **CAPTURA 7: Vista de Ajustes/Configuración**

**Dónde tomar la captura**:
- Sesión de administrador o usuario
- Click en "⚙️ Ajustes" en el menú lateral

**Qué debe mostrar**:
- ✅ Título "AJUSTES"
- ✅ Sección "Información de la Cuenta":
  - Email del usuario
  - Rol asignado
- ✅ Sección "Cambiar Contraseña":
  - Campo "Contraseña Actual"
  - Campo "Nueva Contraseña"
  - Campo "Confirmar Nueva Contraseña"
  - Botón "Cambiar Contraseña"

**Cómo tomarla**:
1. Click en "Ajustes"
2. Verificar que se muestre la información correcta
3. Tomar captura de pantalla completa

**Archivo sugerido**: `07_ajustes_perfil.png`

---

#### **CAPTURA 8: Vista Responsiva - Móvil**

**Dónde tomar la captura**:
- Cualquier vista del sistema
- Usar DevTools para simular dispositivo móvil

**Qué debe mostrar**:
- ✅ Vista adaptada a tamaño de smartphone (375x667px o 414x896px)
- ✅ Menú lateral colapsado o transformado en menú hamburguesa
- ✅ Cards de encuestas apiladas verticalmente
- ✅ Botones con tamaño táctil adecuado
- ✅ Texto legible sin necesidad de zoom

**Cómo tomarla**:
1. Abrir Chrome DevTools (F12)
2. Click en icono de dispositivo (Ctrl+Shift+M)
3. Seleccionar "iPhone 12 Pro" o "Pixel 5"
4. Navegar a vista "Mis Encuestas"
5. Tomar captura desde DevTools (Ctrl+Shift+P → "Capture screenshot")

**Archivo sugerido**: `08_responsive_mobile.png`

---

#### **CAPTURA 9: Sistema de Alertas/Notificaciones**

**Dónde tomar la captura**:
- Cualquier acción que genere notificación

**Qué debe mostrar**:
- ✅ Toast de éxito (verde) en esquina superior derecha:
  - "Encuesta creada exitosamente"
  - Icono de check
  - Animación de entrada

O

- ✅ Toast de error (rojo):
  - "Error: El email ya está registrado"
  - Icono de X
  - Borde izquierdo rojo

**Cómo tomarla**:
1. Realizar acción que genere toast (ej: crear encuesta)
2. Rápidamente tomar captura cuando aparezca el toast
3. Alternativamente, usar herramienta de grabación de pantalla y capturar frame

**Archivo sugerido**: `09_alertas_toasts.png`

---

#### **CAPTURA 10: Código Fuente - Ejemplo Backend**

**Dónde tomar la captura**:
- Visual Studio 2024
- Archivo: `AuthController.cs`

**Qué debe mostrar**:
- ✅ Ventana de Visual Studio con código abierto
- ✅ Método `GenerateJwtToken` visible
- ✅ Comentarios en el código
- ✅ Syntax highlighting activo
- ✅ Barra lateral con estructura de archivos

**Cómo tomarla**:
1. Abrir `Ejemplo/Controllers/AuthController.cs`
2. Navegar al método `GenerateJwtToken` (línea ~95)
3. Ajustar zoom para que el código sea legible
4. Tomar captura de pantalla completa de Visual Studio

**Archivo sugerido**: `10_codigo_backend.png`

---

#### **CAPTURA 11: Código Fuente - Ejemplo Frontend**

**Dónde tomar la captura**:
- VS Code
- Archivo: `app.js`

**Qué debe mostrar**:
- ✅ Ventana de VS Code con código abierto
- ✅ Función `addQuestion` o `loadAnalytics` visible
- ✅ Comentarios explicativos
- ✅ Syntax highlighting activo
- ✅ Minimap visible

**Cómo tomarla**:
1. Abrir `Ejemplo/wwwroot/app.js` en VS Code
2. Navegar a función `addQuestion` o `drawPieChart`
3. Ajustar zoom para legibilidad
4. Tomar captura de pantalla completa

**Archivo sugerido**: `11_codigo_frontend.png`

---

#### **CAPTURA 12: Base de Datos - SQL Server Management Studio**

**Dónde tomar la captura**:
- SQL Server Management Studio
- Tabla: `Surveys` o `SurveyResponses`

**Qué debe mostrar**:
- ✅ Explorador de objetos con estructura de base de datos
- ✅ Tabla seleccionada con datos
- ✅ Ventana de query con SELECT
- ✅ Resultados mostrando datos de ejemplo

**Cómo tomarla**:
1. Abrir SSMS
2. Conectar a la base de datos del proyecto
3. Expandir tablas
4. Click derecho en tabla `Surveys` → "Select Top 1000 Rows"
5. Tomar captura mostrando tanto el explorador como los resultados

**Archivo sugerido**: `12_base_datos.png`

---

### 8.3 Especificaciones Técnicas de Capturas

**Formato**:
- Tipo de archivo: PNG (recomendado para mejor calidad)
- Resolución mínima: 1920x1080 (Full HD)
- DPI: 96 o superior

**Calidad**:
- Sin compresión excesiva
- Texto legible
- Colores nítidos
- Sin artefactos visuales

**Organización**:
```
/Propuesta/
  /Capturas/
    01_login_registro.png
    02_dashboard_admin.png
    03_crear_encuesta.png
    04_responder_encuesta.png
    05_analiticas_graficos.png
    06_gestion_usuarios.png
    07_ajustes_perfil.png
    08_responsive_mobile.png
    09_alertas_toasts.png
    10_codigo_backend.png
    11_codigo_frontend.png
    12_base_datos.png
```

---

## 9. RESULTADOS ESPERADOS

### 9.1 Productos Entregables

1. **Código Fuente Completo**
   - Backend (ASP.NET Core 10)
   - Frontend (HTML/CSS/JS)
   - Migraciones de base de datos
   - Archivo de configuración

2. **Documentación Técnica**
   - Manual de instalación
   - Guía de usuario
   - Documentación de API (endpoints)
   - Diagrama de arquitectura

3. **Base de Datos**
   - Script de creación de tablas
   - Datos de prueba (seed data)
   - Diagrama entidad-relación

4. **Sistema Funcional**
   - Aplicación web desplegada
   - Base de datos configurada
   - Pruebas realizadas

### 9.2 Métricas de Éxito

| Métrica | Objetivo | Método de Medición |
|---------|----------|-------------------|
| **Funcionalidad** | 100% de requisitos implementados | Checklist de funcionalidades |
| **Rendimiento** | Tiempo de respuesta < 2 segundos | Pruebas de carga |
| **Usabilidad** | Satisfacción ≥ 4.5/5 | Encuesta a usuarios |
| **Seguridad** | 0 vulnerabilidades críticas | Análisis de seguridad |
| **Disponibilidad** | Uptime ≥ 99% | Monitoreo de servidor |

### 9.3 Beneficios Cuantificables

**Ahorro de Costos**:
- Plataforma comercial (SurveyMonkey): $32/mes × 12 meses = $384/año
- Solución propia: $0 (solo hosting ~$5/mes = $60/año)
- **Ahorro anual**: $324

**Aumento de Eficiencia**:
- Tiempo de creación de encuesta: 5 minutos (vs 10 minutos en Excel)
- Tiempo de análisis de resultados: 2 minutos (vs 30 minutos manual)
- **Ahorro de tiempo**: 43 minutos por encuesta

**Mejora en Toma de Decisiones**:
- Visualización inmediata de datos (vs esperar días por reportes)
- Análisis en tiempo real
- Acceso 24/7 a resultados

---

## 10. CRONOGRAMA

### 10.1 Fases del Proyecto (12 Semanas)

#### **Fase 1: Planificación y Análisis (Semanas 1-2)**
- Semana 1:
  - ✅ Definición de requisitos funcionales
  - ✅ Definición de requisitos no funcionales
  - ✅ Análisis de tecnologías
  
- Semana 2:
  - ✅ Diseño de arquitectura
  - ✅ Diseño de base de datos
  - ✅ Creación de mockups

**Entregable**: Documento de especificaciones y diseños

---

#### **Fase 2: Desarrollo Backend (Semanas 3-6)**
- Semana 3:
  - ✅ Configuración del proyecto ASP.NET Core
  - ✅ Configuración de Entity Framework
  - ✅ Creación de modelos de datos
  
- Semana 4:
  - ✅ Implementación de autenticación (AuthController)
  - ✅ Sistema de roles
  - ✅ Generación de JWT
  
- Semana 5:
  - ✅ Implementación de SurveysController
  - ✅ Implementación de ResponsesController
  - ✅ Implementación de SurveyService
  
- Semana 6:
  - ✅ Implementación de AnalyticsController
  - ✅ Implementación de UsersController
  - ✅ Pruebas unitarias de servicios

**Entregable**: API REST funcional con endpoints documentados

---

#### **Fase 3: Desarrollo Frontend (Semanas 7-9)**
- Semana 7:
  - ✅ Estructura HTML
  - ✅ Estilos CSS (diseño base)
  - ✅ Sistema de autenticación (app.js)
  
- Semana 8:
  - ✅ Módulo de gestión de encuestas
  - ✅ Módulo de creación de encuestas
  - ✅ Módulo de respuestas
  
- Semana 9:
  - ✅ Módulo de analíticas
  - ✅ Integración de Chart.js
  - ✅ Integración de Google Charts
  - ✅ Módulo de gestión de usuarios

**Entregable**: Frontend completo integrado con backend

---

#### **Fase 4: Pruebas y Despliegue (Semanas 10-12)**
- Semana 10:
  - ✅ Pruebas de integración
  - ✅ Pruebas de seguridad
  - ✅ Corrección de bugs
  
- Semana 11:
  - ✅ Pruebas con usuarios reales
  - ✅ Ajustes de UX/UI
  - ✅ Optimización de rendimiento
  
- Semana 12:
  - ✅ Despliegue en servidor
  - ✅ Documentación final
  - ✅ Capacitación a usuarios
  - ✅ Entrega del proyecto

**Entregable**: Sistema completo desplegado y documentado

---

### 10.2 Diagrama de Gantt

```
Semana  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10│11│12│
────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Análisis│███│███│   │   │   │   │   │   │   │   │   │   │
Diseño  │   │███│███│   │   │   │   │   │   │   │   │   │
Backend │   │   │███│███│███│███│   │   │   │   │   │   │
Frontend│   │   │   │   │   │   │███│███│███│   │   │   │
Pruebas │   │   │   │   │   │   │   │   │   │███│███│   │
Desplieg│   │   │   │   │   │   │   │   │   │   │   │███│
```

---

## 11. PRESUPUESTO (OPCIONAL)

### 11.1 Costos de Desarrollo

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Desarrollador Full-Stack | 480 horas | $15/hora | $7,200 |
| Diseñador UX/UI | 40 horas | $20/hora | $800 |
| QA/Testing | 60 horas | $12/hora | $720 |
| **TOTAL DESARROLLO** | | | **$8,720** |

### 11.2 Costos de Infraestructura (Primer Año)

| Concepto | Costo Mensual | Costo Anual |
|----------|---------------|-------------|
| Hosting VPS (2GB RAM, 50GB SSD) | $5 | $60 |
| Dominio (.com) | - | $12 |
| Certificado SSL | Gratis (Let's Encrypt) | $0 |
| Base de datos SQL Server Express | Gratis | $0 |
| **TOTAL INFRAESTRUCTURA** | **$5** | **$72** |

### 11.3 Costo Total del Proyecto

- **Desarrollo**: $8,720 (inversión única)
- **Operación anual**: $72
- **Total primer año**: $8,792

**Retorno de Inversión (ROI)**:
- Ahorro anual vs plataforma comercial: $324
- Periodo de recuperación: ~27 años

**NOTA**: Para instituciones educativas, el ROI es mayor considerando:
- Uso ilimitado
- Múltiples encuestas simultáneas
- Sin límite de respuestas
- Personalización completa

---

## 12. RIESGOS Y MITIGACIÓN

### 12.1 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Retrasos en desarrollo** | Media | Alto | Buffer de 2 semanas en cronograma |
| **Bugs críticos en producción** | Media | Alto | Pruebas exhaustivas antes de despliegue |
| **Problemas de rendimiento** | Baja | Medio | Optimización de queries, índices en BD |
| **Vulnerabilidades de seguridad** | Media | Alto | Revisión de código, pruebas de penetración |
| **Falta de adopción por usuarios** | Baja | Alto | Capacitación, manual de usuario intuitivo |

### 12.2 Plan de Contingencia

**Si se detectan bugs críticos**:
1. Rollback a versión estable anterior
2. Análisis de logs y stack traces
3. Corrección en entorno de desarrollo
4. Re-despliegue con hotfix

**Si hay problemas de rendimiento**:
1. Análisis de queries lentas
2. Optimización de índices en base de datos
3. Implementación de caché
4. Escalamiento horizontal si es necesario

---

## 13. CONCLUSIONES

### 13.1 Resumen Ejecutivo

El **Sistema de Gestión de Encuestas Web (Survey Hub)** es una solución completa, moderna y escalable que permite a organizaciones educativas y empresariales:

✅ **Crear encuestas** de forma rápida e intuitiva
✅ **Recopilar respuestas** de manera eficiente
✅ **Analizar resultados** con visualizaciones avanzadas
✅ **Tomar decisiones** basadas en datos

### 13.2 Ventajas Competitivas

1. **Costo-efectivo**: Sin licencias mensuales
2. **Personalizable**: Código abierto modificable
3. **Seguro**: Autenticación robusta con JWT
4. **Escalable**: Arquitectura N-Capas
5. **Moderno**: Tecnologías de última generación (.NET 10)

### 13.3 Impacto Esperado

**Para Instituciones Educativas**:
- Mejora continua del proceso de enseñanza-aprendizaje
- Toma de decisiones basada en evidencia
- Ahorro significativo de costos

**Para Empresas**:
- Retroalimentación constante de empleados
- Medición de satisfacción de clientes
- Cultura organizacional orientada a datos

---

## 14. ANEXOS

### Anexo A: Referencias Técnicas

1. **Microsoft. (2024)**. *ASP.NET Core Documentation*. 
   https://docs.microsoft.com/aspnet/core

2. **Entity Framework Core Documentation**.
   https://docs.microsoft.com/ef/core

3. **JWT.io** - JSON Web Tokens Introduction.
   https://jwt.io/introduction

4. **Chart.js Documentation**.
   https://www.chartjs.org/docs/

5. **Google Charts Documentation**.
   https://developers.google.com/chart

### Anexo B: Glosario Técnico

- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **ORM**: Object-Relational Mapping
- **SPA**: Single Page Application
- **CRUD**: Create, Read, Update, Delete
- **DTO**: Data Transfer Object
- **EF Core**: Entity Framework Core
- **CORS**: Cross-Origin Resource Sharing

---

## 15. CONTACTO Y SOPORTE

**Desarrollador Principal**: [Tu Nombre]
**Email**: [tu.email@ejemplo.com]
**Institución**: [Nombre de tu Universidad/Empresa]
**Repositorio**: [URL de GitHub si aplica]

---

**Fecha de elaboración**: [Fecha actual]
**Versión del documento**: 1.0
**Estado**: Propuesta para aprobación

---

## 🎯 CHECKLIST FINAL ANTES DE PRESENTAR

Antes de entregar la propuesta, verifica:

- [ ] Todas las capturas de pantalla están tomadas y guardadas
- [ ] Las capturas muestran datos realistas (no "test" o "prueba")
- [ ] El documento está libre de errores ortográficos
- [ ] Los objetivos están claramente definidos
- [ ] El cronograma es realista
- [ ] El presupuesto está justificado (si aplica)
- [ ] Las referencias bibliográficas están completas
- [ ] El formato es consistente en todo el documento
- [ ] Se incluyen diagramas y tablas claras
- [ ] La propuesta tiene coherencia desde inicio hasta fin

---

**¡ÉXITO EN TU PROPUESTA!** 🚀
