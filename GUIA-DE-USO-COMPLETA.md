# 🎯 Survey Hub - Guía Completa de Uso

## 📋 Tabla de Contenidos
1. [Dos Arquitecturas Disponibles](#dos-arquitecturas-disponibles)
2. [Opción A: Monolito (Recomendado para Producción)](#opción-a-monolito)
3. [Opción B: Microservicios (Para Aprendizaje)](#opción-b-microservicios)
4. [Comparación y Recomendaciones](#comparación-y-recomendaciones)

---

## 🏗️ Dos Arquitecturas Disponibles

Este proyecto incluye **DOS implementaciones completas**:

### 1️⃣ **Monolito Modular** (Carpeta `Ejemplo/`)
- Una aplicación ASP.NET Core
- Ideal para desarrollo rápido
- Bajo costo operacional
- **RECOMENDADO** para uso en producción

### 2️⃣ **Microservicios** (Carpeta `microservices/`)
- 7 servicios independientes con Docker
- Ideal para aprendizaje y escalabilidad
- Mayor complejidad
- **RECOMENDADO** para portfolio y práctica

---

## 🚀 Opción A: Monolito (Recomendado para Producción)

### Prerrequisitos
- .NET 10 SDK
- SQL Server 2019+
- Visual Studio 2024 o VS Code

### Instalación

#### 1. Configurar Base de Datos

Editar `Ejemplo/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SurveyHubDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

#### 2. Ejecutar Migraciones

```bash
cd Ejemplo
dotnet ef database update
```

#### 3. Ejecutar la Aplicación

```bash
dotnet run
```

### Acceso
- URL: http://localhost:5000
- Frontend integrado en el mismo puerto

### Ventajas del Monolito
✅ Configuración simple (5 minutos)  
✅ Debugging fácil  
✅ Sin Docker requerido  
✅ Bajo uso de recursos  
✅ Ideal para equipos pequeños  

---

## 🐳 Opción B: Microservicios (Para Aprendizaje)

### Prerrequisitos
- Docker Desktop
- Docker Compose
- 4GB RAM mínimo disponible

### Instalación Rápida

#### 1. Iniciar Docker Desktop
Asegúrate de que Docker Desktop esté corriendo.

#### 2. Construir Imágenes (Primera vez - ~10 minutos)

```powershell
docker-compose -f docker-compose.microservices.yml build
```

#### 3. Iniciar Servicios (~3 minutos)

```powershell
docker-compose -f docker-compose.microservices.yml up -d
```

#### 4. Verificar Estado

```powershell
docker-compose -f docker-compose.microservices.yml ps
```

#### 5. Ver Logs

```powershell
docker-compose -f docker-compose.microservices.yml logs -f
```

### Acceso a los Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz web |
| **API Gateway** | http://localhost:8080 | Punto de entrada APIs |
| **Auth Service** | http://localhost:5001 | Autenticación |
| **Surveys Service** | http://localhost:5002 | Encuestas |
| **Responses Service** | http://localhost:5003 | Respuestas |
| **Analytics Service** | http://localhost:5004 | Analíticas |

### Gestión con Script

```powershell
# Construir
.\microservices-manager.ps1 build

# Iniciar
.\microservices-manager.ps1 up

# Detener
.\microservices-manager.ps1 down

# Ver logs
.\microservices-manager.ps1 logs

# Ver estado
.\microservices-manager.ps1 ps

# Reiniciar
.\microservices-manager.ps1 restart

# Limpiar todo
.\microservices-manager.ps1 clean
```

### Ventajas de Microservicios
✅ Escalabilidad independiente por servicio  
✅ Deploys independientes  
✅ Resiliencia (un fallo no afecta todo)  
✅ Portfolio impresionante  
✅ Aprendizaje de arquitectura moderna  

---

## 📊 Comparación y Recomendaciones

### ¿Cuál Usar?

| Escenario | Recomendación |
|-----------|---------------|
| **Proyecto escolar/académico** | Monolito |
| **Portfolio personal** | Microservicios |
| **Startup/MVP** | Monolito |
| **Empresa grande** | Microservicios |
| **Aprendiendo Docker/K8s** | Microservicios |
| **Producción real** | Monolito (por ahora) |

### Matriz de Decisión

```
Complejidad vs Escalabilidad

Alto  │                     ╔══════════╗
      │                     ║  Micro-  ║
      │                     ║ services ║
      │                     ╚══════════╝
      │
      │        ┌──────────┐
      │        │ Monolito │
      │        │ Modular  │
Bajo  │        └──────────┘
      └─────────────────────────────────►
           Bajo                    Alto
              Necesidad de Escalabilidad
```

### Uso Recomendado por Fase

#### Fase 1: Desarrollo (AHORA)
**Usar:** Monolito  
**Razón:** Desarrollo rápido, fácil debugging

#### Fase 2: Demostración/Portfolio
**Usar:** Microservicios  
**Razón:** Muestra conocimientos avanzados

#### Fase 3: Producción Inicial
**Usar:** Monolito  
**Razón:** < 1000 usuarios, equipo pequeño

#### Fase 4: Crecimiento
**Usar:** Microservicios  
**Razón:** > 1000 usuarios, necesitas escalar

---

## 🎓 Guías Detalladas

### Para Monolito
📖 Ver: `README.md` en la raíz del proyecto

### Para Microservicios
📖 Ver: `microservices/README.md`  
📖 Ver: `INICIO-RAPIDO-MICROSERVICIOS.md`  
📖 Ver: `ARQUITECTURA-MICROSERVICIOS.md`

### Comparación Técnica
📖 Ver: `MONOLITO-VS-MICROSERVICIOS.md`

---

## 🔧 Comandos Rápidos

### Monolito

```bash
# Desarrollo local
cd Ejemplo
dotnet run

# Con Docker (opcional)
docker-compose up -d
```

### Microservicios

```bash
# Inicio rápido
docker-compose -f docker-compose.microservices.yml up -d

# Ver todo
docker-compose -f docker-compose.microservices.yml ps

# Detener
docker-compose -f docker-compose.microservices.yml down
```

---

## 🐛 Solución de Problemas

### Monolito

**Problema:** "Cannot connect to SQL Server"  
**Solución:**
```bash
# Verificar que SQL Server esté corriendo
# Revisar cadena de conexión en appsettings.json
dotnet ef database update
```

### Microservicios

**Problema:** "Cannot connect to Docker daemon"  
**Solución:** Iniciar Docker Desktop

**Problema:** "Port already allocated"  
**Solución:**
```bash
docker-compose -f docker-compose.microservices.yml down
docker-compose -f docker-compose.microservices.yml up -d
```

---

## 📈 Siguientes Pasos

### Si elegiste Monolito:
1. ✅ Ejecutar `dotnet run`
2. ✅ Abrir http://localhost:5000
3. ✅ Registrar usuario administrador
4. ✅ Crear primera encuesta
5. ✅ Probar todas las funcionalidades

### Si elegiste Microservicios:
1. ✅ Iniciar Docker Desktop
2. ✅ Ejecutar `docker-compose -f docker-compose.microservices.yml up -d`
3. ✅ Abrir http://localhost:3000
4. ✅ Registrar usuario administrador
5. ✅ Explorar cada microservicio
6. ✅ Ver logs: `docker logs surveyhub-auth -f`

---

## 💡 Consejos

### Para Demostración en Entrevista:
1. Mostrar **monolito** primero (simplicidad)
2. Explicar arquitectura de **microservicios**
3. Mencionar cuándo usarías cada uno
4. Destacar que implementaste ambos

### Para Proyecto Escolar:
- **Usa monolito** para entregar rápido
- **Menciona microservicios** como trabajo futuro
- Incluye diagramas de ambas arquitecturas

### Para Portfolio:
- **Destaca microservicios** en README principal
- Muestra conocimiento de Docker/DevOps
- Explica decisiones arquitectónicas

---

## 📚 Documentación Completa

Todos los documentos están en la raíz del proyecto:

- `README.md` - Guía principal del monolito
- `INICIO-RAPIDO-MICROSERVICIOS.md` - Inicio rápido con Docker
- `ARQUITECTURA-MICROSERVICIOS.md` - Diagramas y explicación
- `MONOLITO-VS-MICROSERVICIOS.md` - Comparación detallada
- `microservices/README.md` - Guía completa de microservicios

---

## 🎯 Resumen Ejecutivo

**Para estudiantes/desarrolladores:**
```
Desarrollo: Monolito ✅
Aprendizaje: Microservicios ✅
Portfolio: Ambos ✅✅
```

**Para empresas/startups:**
```
MVP: Monolito ✅
< 1000 usuarios: Monolito ✅
> 1000 usuarios: Microservicios ✅
```

---

**¿Necesitas ayuda?**  
Revisa la documentación específica de cada arquitectura o abre un issue en GitHub.

**Repositorio:** https://github.com/Andres821340/practica_examen.git
