using Ejemplo.Services;
using Ejemplo.Data;
using Ejemplo.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar Kestrel para manejar conflictos de puertos de manera más elegante
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false;
});

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configurar la base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Configurar Identity (sistema de autenticación)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configuración de contraseñas
    options.Password.RequireDigit = true;              // Requiere al menos un dígito
    options.Password.RequiredLength = 6;               // Longitud mínima de 6 caracteres
    options.Password.RequireNonAlphanumeric = false;   // No requiere caracteres especiales
    options.Password.RequireUppercase = false;         // No requiere mayúsculas
    options.Password.RequireLowercase = false;         // No requiere minúsculas

    // Configuración de usuarios
    options.User.RequireUniqueEmail = true;            // El email debe ser único
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configurar autenticación JWT (JSON Web Token)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your-very-secret-key-min-32-characters-long!!!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "SurveyHubAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "SurveyHubClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Registrar servicios de la aplicación (Scoped para Entity Framework Core)
builder.Services.AddScoped<ISurveyService, SurveyService>();      // Servicio para gestionar encuestas
builder.Services.AddScoped<IResponseService, ResponseService>();  // Servicio para gestionar respuestas
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>(); // Servicio para analíticas

// Agregar CORS (Cross-Origin Resource Sharing - permite peticiones desde otros dominios)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Inicializar roles y datos iniciales en la base de datos
await SeedData.InitializeAsync(app.Services);

// Configurar el pipeline de peticiones HTTP
app.UseCors("AllowAll");

// Servir archivos estáticos PRIMERO (HTML, CSS, JS, imágenes)
app.UseDefaultFiles();  // Permite servir index.html por defecto
app.UseStaticFiles();   // Sirve archivos desde wwwroot

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();

app.UseAuthentication(); // Agregar middleware de autenticación (verifica tokens JWT)
app.UseAuthorization();  // Agregar middleware de autorización (verifica permisos y roles)

app.MapControllers();

app.Run();
