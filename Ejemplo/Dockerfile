# ========================================
# SURVEY HUB - DOCKERFILE (.NET 10)
# Sistema de Encuestas Profesional
# ========================================

# ============================================
# STAGE 1: BUILD
# Usa SDK completo para compilar
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar dependencias
# (Esto se cachea si el .csproj no cambia)
COPY ["Ejemplo/Ejemplo.csproj", "Ejemplo/"]
RUN dotnet restore "Ejemplo/Ejemplo.csproj"

# Copiar todo el código fuente
COPY . .
WORKDIR "/src/Ejemplo"

# Compilar en modo Release
RUN dotnet build "Ejemplo.csproj" -c Release -o /app/build

# ============================================
# STAGE 2: PUBLISH
# Optimiza y prepara para producción
# ============================================
FROM build AS publish
RUN dotnet publish "Ejemplo.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false \
    /p:PublishTrimmed=false

# ============================================
# STAGE 3: RUNTIME (FINAL)
# Imagen mínima solo con runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app

# Metadata
LABEL maintainer="Survey Hub Team"
LABEL description="Sistema profesional de encuestas con .NET 10"
LABEL version="3.0"

# Exponer puertos
# 8080 = HTTP
# 8081 = HTTPS (opcional)
EXPOSE 8080
EXPOSE 8081

# Variables de entorno para producción
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Copiar archivos publicados desde stage anterior
COPY --from=publish /app/publish .

# Punto de entrada
ENTRYPOINT ["dotnet", "Ejemplo.dll"]
