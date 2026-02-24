# Auth Service Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Ejemplo.csproj", "./"]
RUN dotnet restore "Ejemplo.csproj"
COPY . .
RUN dotnet build "Ejemplo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Ejemplo.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Instalar EF Core tools para migraciones
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Script de inicio para ejecutar migraciones
COPY <<EOF /app/entrypoint.sh
#!/bin/bash
echo "Waiting for SQL Server..."
sleep 20
echo "Running migrations..."
dotnet ef database update --no-build || true
echo "Starting application..."
dotnet Ejemplo.dll
EOF

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
