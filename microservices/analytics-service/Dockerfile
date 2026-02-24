# Analytics Service Dockerfile
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
ENTRYPOINT ["dotnet", "Ejemplo.dll"]
