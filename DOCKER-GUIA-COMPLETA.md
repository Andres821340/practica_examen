# 🐳 GUÍA COMPLETA DE DOCKER - SURVEY HUB

## 📚 ¿Qué es Docker?

Docker es una plataforma que te permite empaquetar tu aplicación con todas sus dependencias en un **contenedor** que puede ejecutarse en cualquier lugar.

### **Beneficios:**
- ✅ **Portabilidad**: Funciona igual en desarrollo, testing y producción
- ✅ **Aislamiento**: Cada contenedor es independiente
- ✅ **Reproducibilidad**: Misma configuración siempre
- ✅ **Ligereza**: Más rápido que una máquina virtual
- ✅ **Escalabilidad**: Fácil de replicar y distribuir

---

## 🏗️ ARQUITECTURA DEL DOCKERFILE

### **Multi-Stage Build Explicado**

Tu Dockerfile usa 3 etapas para optimizar el tamaño final:

```dockerfile
┌──────────────────────────────────────────────────┐
│ STAGE 1: BUILD (SDK - 1.2 GB)                   │
├──────────────────────────────────────────────────┤
│ FROM mcr.microsoft.com/dotnet/sdk:10.0-preview  │
│                                                  │
│ ✓ Contiene compilador de C#                     │
│ ✓ Herramientas de desarrollo                    │
│ ✓ NuGet                                          │
│ ✓ MSBuild                                        │
│                                                  │
│ Acciones:                                        │
│ 1. COPY Ejemplo.csproj                           │
│ 2. RUN dotnet restore                            │
│ 3. COPY código fuente                            │
│ 4. RUN dotnet build                              │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 2: PUBLISH                                 │
├──────────────────────────────────────────────────┤
│ FROM build (usa resultado del stage 1)          │
│                                                  │
│ Acciones:                                        │
│ 1. RUN dotnet publish                            │
│    - Optimiza código                             │
│    - Elimina símbolos de debug                   │
│    - Comprime archivos                           │
│    - Prepara para producción                     │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ STAGE 3: RUNTIME (FINAL - 200 MB)               │
├──────────────────────────────────────────────────┤
│ FROM mcr.microsoft.com/dotnet/aspnet:10.0       │
│                                                  │
│ ✓ Solo runtime de ASP.NET                       │
│ ✓ Sin compilador                                 │
│ ✓ Sin herramientas de desarrollo                │
│ ✓ Imagen MUY liviana                            │
│                                                  │
│ Acciones:                                        │
│ 1. COPY --from=publish /app/publish .           │
│ 2. EXPOSE 8080 8081                              │
│ 3. ENTRYPOINT ["dotnet", "Ejemplo.dll"]         │
└──────────────────────────────────────────────────┘
```

### **Ventaja del Multi-Stage:**
- **Build image**: 1.2 GB (no se incluye en el resultado final)
- **Final image**: ~200-300 MB (solo runtime + tu app)
- **Ahorro**: ~1 GB de espacio

---

## 🚀 COMANDOS DOCKER PASO A PASO

### **1️⃣ Construir la Imagen Docker**

```powershell
# Desde la carpeta raíz del proyecto (donde está el .sln)
docker build -t survey-hub:latest -f Ejemplo/Dockerfile .
```

**Explicación:**
- `docker build`: Construye una imagen
- `-t survey-hub:latest`: Nombre y tag de la imagen
- `-f Ejemplo/Dockerfile`: Ubicación del Dockerfile
- `.`: Contexto de build (directorio actual)

**Output esperado:**
```
[+] Building 45.3s (18/18) FINISHED
 => [build 1/6] FROM mcr.microsoft.com/dotnet/sdk:10.0-preview
 => [build 2/6] COPY [Ejemplo/Ejemplo.csproj, Ejemplo/]
 => [build 3/6] RUN dotnet restore
 => [build 4/6] COPY . .
 => [build 5/6] RUN dotnet build
 => [publish 1/1] RUN dotnet publish
 => [final 1/3] FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
 => [final 2/3] COPY --from=publish /app/publish .
 => exporting to image
 => => naming to docker.io/library/survey-hub:latest
```

---

### **2️⃣ Verificar que la Imagen se Creó**

```powershell
docker images
```

**Output esperado:**
```
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
survey-hub      latest    a1b2c3d4e5f6   2 minutes ago   285MB
```

---

### **3️⃣ Ejecutar el Contenedor**

```powershell
docker run -d -p 8080:8080 --name survey-hub-app survey-hub:latest
```

**Explicación:**
- `docker run`: Ejecuta un contenedor
- `-d`: Modo detached (background)
- `-p 8080:8080`: Mapea puerto host:contenedor
- `--name survey-hub-app`: Nombre del contenedor
- `survey-hub:latest`: Imagen a usar

**Con variables de entorno:**
```powershell
docker run -d \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  --name survey-hub-app \
  survey-hub:latest
```

---

### **4️⃣ Ver Contenedores Corriendo**

```powershell
docker ps
```

**Output esperado:**
```
CONTAINER ID   IMAGE                STATUS         PORTS                  NAMES
a1b2c3d4e5f6   survey-hub:latest    Up 2 minutes   0.0.0.0:8080->8080/tcp survey-hub-app
```

---

### **5️⃣ Ver Logs del Contenedor**

```powershell
docker logs survey-hub-app
```

**Output esperado:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://[::]:8080
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Ver logs en tiempo real:**
```powershell
docker logs -f survey-hub-app
```

---

### **6️⃣ Acceder a la Aplicación**

Abre tu navegador en:
```
http://localhost:8080
```

---

### **7️⃣ Detener el Contenedor**

```powershell
docker stop survey-hub-app
```

---

### **8️⃣ Eliminar el Contenedor**

```powershell
docker rm survey-hub-app
```

---

### **9️⃣ Eliminar la Imagen**

```powershell
docker rmi survey-hub:latest
```

---

## 🔄 FLUJO COMPLETO

```
DESARROLLO          DOCKER BUILD              DOCKER RUN
┌─────────┐         ┌─────────┐              ┌─────────┐
│  Código │  ──→    │ Imagen  │  ──→         │Container│  ──→  🌐 Navegador
│  .NET   │         │ Docker  │              │Ejecutando│       http://localhost:8080
└─────────┘         └─────────┘              └─────────┘
    │                    │                         │
    ↓                    ↓                         ↓
  Edit code         docker build             docker run
  Save files        → Crea imagen            → Levanta app
                    → 285 MB                 → Expone puerto
```

---

## 📦 ESTRUCTURA DE ARCHIVOS EN EL CONTENEDOR

```
/app/  (WORKDIR en el contenedor)
├── Ejemplo.dll                    ← Tu aplicación compilada
├── Ejemplo.deps.json              ← Dependencias
├── Ejemplo.runtimeconfig.json     ← Configuración de runtime
├── wwwroot/                       ← Archivos estáticos
│   ├── index.html
│   ├── app.js
│   └── ...
└── ... (otros archivos necesarios)
```

---

## 🎯 VARIABLES DE ENTORNO

Puedes configurar tu app con variables de entorno:

```powershell
docker run -d \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=db;..." \
  --name survey-hub-app \
  survey-hub:latest
```

---

## 🐳 DOCKER COMPOSE (OPCIONAL)

Crea un archivo `docker-compose.yml` para simplificar:

```yaml
version: '3.8'

services:
  survey-hub:
    build:
      context: .
      dockerfile: Ejemplo/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:8080
    container_name: survey-hub-app
```

**Ejecutar con Docker Compose:**
```powershell
docker-compose up -d
```

**Detener:**
```powershell
docker-compose down
```

---

## 📊 COMPARACIÓN: LOCAL vs DOCKER

| Característica | Ejecutar Local | Ejecutar en Docker |
|----------------|----------------|-------------------|
| **Comando** | `dotnet run` | `docker run ...` |
| **Dependencias** | Necesitas .NET SDK instalado | Solo necesitas Docker |
| **Puerto** | 5000, 5001 | 8080, 8081 |
| **Configuración** | launchSettings.json | Variables de entorno |
| **Aislamiento** | Afecta tu sistema | Totalmente aislado |
| **Portabilidad** | Solo en tu máquina | Funciona en cualquier lado |

---

## 🛠️ COMANDOS ÚTILES

### **Ver todas las imágenes**
```powershell
docker images
```

### **Ver todos los contenedores (incluso detenidos)**
```powershell
docker ps -a
```

### **Entrar al contenedor (bash)**
```powershell
docker exec -it survey-hub-app /bin/bash
```

### **Ver uso de recursos**
```powershell
docker stats survey-hub-app
```

### **Inspeccionar contenedor**
```powershell
docker inspect survey-hub-app
```

### **Limpiar todo (CUIDADO: elimina todo)**
```powershell
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Limpiar todo
docker system prune -a
```

---

## 🚢 PUBLICAR EN DOCKER HUB

### **1. Login en Docker Hub**
```powershell
docker login
```

### **2. Etiquetar la imagen**
```powershell
docker tag survey-hub:latest tu-usuario/survey-hub:latest
```

### **3. Subir a Docker Hub**
```powershell
docker push tu-usuario/survey-hub:latest
```

### **4. Descargar desde otro lugar**
```powershell
docker pull tu-usuario/survey-hub:latest
docker run -d -p 8080:8080 tu-usuario/survey-hub:latest
```

---

## ☁️ DESPLEGAR EN LA NUBE

### **Azure Container Instances**
```powershell
az container create \
  --resource-group myResourceGroup \
  --name survey-hub \
  --image tu-usuario/survey-hub:latest \
  --dns-name-label survey-hub-demo \
  --ports 8080
```

### **AWS ECS / Fargate**
```powershell
aws ecs create-service \
  --cluster my-cluster \
  --service-name survey-hub \
  --task-definition survey-hub:1 \
  --desired-count 1
```

### **Google Cloud Run**
```powershell
gcloud run deploy survey-hub \
  --image gcr.io/tu-proyecto/survey-hub \
  --platform managed \
  --port 8080
```

---

## 🔐 MEJORES PRÁCTICAS

### ✅ **DO (Hacer)**
- Usar multi-stage builds
- Usar imágenes oficiales de Microsoft
- Usar .dockerignore para excluir archivos innecesarios
- Configurar variables de entorno
- Usar versiones específicas de imágenes (no `latest` en producción)

### ❌ **DON'T (No hacer)**
- No incluir secrets en el Dockerfile
- No usar `root` user (usar USER en producción)
- No copiar archivos innecesarios (obj, bin, etc.)
- No hardcodear valores en el Dockerfile

---

## 📝 .dockerignore

Crea un archivo `.dockerignore` en la raíz:

```
**/.vs
**/.vscode
**/bin
**/obj
**/*.user
**/node_modules
README.md
*.md
.git
.gitignore
```

---

## 🎓 CONCEPTOS CLAVE

### **Imagen vs Contenedor**
```
IMAGEN                    CONTENEDOR
(Blueprint)              (Instancia ejecutándose)
    │                           │
    │  docker run               │
    └──────────────────────────→│
                                │
    Una imagen puede crear      │
    múltiples contenedores      │
```

### **Layers (Capas)**
```
Layer 1: Base OS
Layer 2: .NET Runtime
Layer 3: Tu aplicación
Layer 4: wwwroot/
Layer 5: DLLs adicionales

Cada COPY, RUN, ADD crea una capa
Las capas se cachean para builds rápidos
```

---

## 📈 WORKFLOW COMPLETO

```
1. DESARROLLO
   ↓ escribes código
   
2. COMMIT
   ↓ git push
   
3. CI/CD (GitHub Actions, Azure DevOps, etc.)
   ↓ docker build
   ↓ docker push
   
4. REGISTRO (Docker Hub, ACR, ECR)
   ↓ docker pull
   
5. PRODUCCIÓN
   ↓ docker run
   
6. USUARIO FINAL
   → Accede a la app
```

---

## 🎯 CASOS DE USO

### **Desarrollo Local**
```powershell
docker run -d -p 8080:8080 -e ASPNETCORE_ENVIRONMENT=Development survey-hub
```

### **Testing**
```powershell
docker run -d -p 8080:8080 -e ASPNETCORE_ENVIRONMENT=Staging survey-hub
```

### **Producción**
```powershell
docker run -d \
  -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DB="..." \
  --restart unless-stopped \
  survey-hub
```

---

## 📊 MONITOREO

### **Ver logs continuos**
```powershell
docker logs -f survey-hub-app
```

### **Ver estadísticas de recursos**
```powershell
docker stats survey-hub-app
```

**Output:**
```
CONTAINER ID   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O
a1b2c3d4e5f6   0.05%   45MiB / 2GiB       2.25%   1.2kB / 0B
```

---

## 🔄 ACTUALIZAR LA APLICACIÓN

```powershell
# 1. Reconstruir imagen
docker build -t survey-hub:v2 -f Ejemplo/Dockerfile .

# 2. Detener contenedor anterior
docker stop survey-hub-app

# 3. Eliminar contenedor anterior
docker rm survey-hub-app

# 4. Ejecutar nueva versión
docker run -d -p 8080:8080 --name survey-hub-app survey-hub:v2
```

**O con Docker Compose:**
```powershell
docker-compose up -d --build
```

---

## ✅ CHECKLIST DE DOCKER

- [ ] Dockerfile actualizado a .NET 10
- [ ] Multi-stage build implementado
- [ ] .dockerignore creado
- [ ] Imagen construida exitosamente
- [ ] Contenedor ejecutándose
- [ ] Puerto 8080 accesible
- [ ] Logs sin errores
- [ ] Aplicación funciona correctamente

---

## 🎉 RESUMEN

**Docker en tu aplicación Survey Hub:**

1. ✅ Usa multi-stage build (3 etapas)
2. ✅ Optimizado para .NET 10
3. ✅ Imagen final liviana (~285 MB)
4. ✅ Expone puertos 8080 y 8081
5. ✅ Listo para desplegar en cualquier plataforma
6. ✅ Configuración con variables de entorno
7. ✅ Aislamiento completo

**Comando más simple para empezar:**
```powershell
# Build
docker build -t survey-hub -f Ejemplo/Dockerfile .

# Run
docker run -d -p 8080:8080 survey-hub

# Access
http://localhost:8080
```

---

**¡Tu aplicación ahora está dockerizada y lista para producción!** 🚀🐳
