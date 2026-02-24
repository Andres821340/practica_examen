using Ejemplo.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Ejemplo.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        try
        {
            // Asegurar que la base de datos esté creada y migrada
            await context.Database.MigrateAsync();

            // Inicializar roles (Administrador, Usuario)
            await SeedRolesAsync(roleManager);

            // Crear usuario administrador por defecto
            var adminUser = await SeedAdminUserAsync(userManager);

            if (adminUser == null || string.IsNullOrEmpty(adminUser.Id))
            {
                Console.WriteLine("ERROR: Falló al crear o recuperar el usuario administrador");
                return;
            }

            Console.WriteLine($"ID del usuario administrador: {adminUser.Id}");

            // Inicializar datos de ejemplo solo si la base de datos está vacía
            var surveyCount = await context.Surveys.CountAsync();
            Console.WriteLine($"Número actual de encuestas: {surveyCount}");

            if (surveyCount == 0)
            {
                Console.WriteLine("Inicializando encuestas de ejemplo...");
                await SeedSurveysAsync(context, adminUser.Id);
                Console.WriteLine("Encuestas inicializadas exitosamente");
            }
            else
            {
                Console.WriteLine("La base de datos ya tiene encuestas, verificando actualizaciones...");
                // Actualizar encuestas existentes si es necesario
                await UpdateExistingSurveysAsync(context);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR durante la inicialización: {ex.Message}");
            Console.WriteLine($"Trace de pila: {ex.StackTrace}");
        }
    }
    
    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Administrador", "Usuario" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
    
    private static async Task<ApplicationUser> SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "admin@surveyhub.com";
        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin != null)
            return existingAdmin;

        var adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FullName = "Administrador del Sistema",
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(adminUser, "Admin123!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Administrador");
            // Recargar usuario para asegurar que el ID esté poblado
            return await userManager.FindByEmailAsync(adminEmail) ?? adminUser;
        }

        return adminUser;
    }
    
    private static async Task SeedSurveysAsync(ApplicationDbContext context, string adminUserId)
    {
        // Encuesta 1: Satisfacción del Servicio al Cliente
        var survey1 = new Survey
        {
            Title = "Satisfaccion del Servicio al Cliente",
            Description = "Ayudanos a mejorar nuestro servicio con tus comentarios",
            CreatedByUserId = adminUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-7),
            Questions = new List<Question>
            {
                new Question
                {
                    Text = "Como calificarias nuestro servicio?",
                    Type = QuestionType.Rating,
                    Options = new List<string> { "1", "2", "3", "4", "5" }
                },
                new Question
                {
                    Text = "Recomendarias nuestro servicio a un amigo?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Definitivamente si", 
                        "Probablemente si", 
                        "No estoy seguro", 
                        "Probablemente no", 
                        "Definitivamente no" 
                    }
                },
                new Question
                {
                    Text = "Que podriamos mejorar?",
                    Type = QuestionType.Text,
                    Options = new List<string>()
                }
            }
        };
        
        context.Surveys.Add(survey1);
        await context.SaveChangesAsync();

        // Agregar respuestas de ejemplo para la encuesta 1
        var responses1 = new List<SurveyResponse>
        {
            new SurveyResponse
            {
                SurveyId = survey1.Id,
                SubmittedAt = DateTime.UtcNow.AddDays(-6),
                Answers = new List<Answer>
                {
                    new Answer { QuestionId = survey1.Questions.ElementAt(0).Id, Value = "5" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(1).Id, Value = "Definitivamente si" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(2).Id, Value = "Todo esta excelente!" }
                }
            },
            new SurveyResponse
            {
                SurveyId = survey1.Id,
                SubmittedAt = DateTime.UtcNow.AddDays(-5),
                Answers = new List<Answer>
                {
                    new Answer { QuestionId = survey1.Questions.ElementAt(0).Id, Value = "4" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(1).Id, Value = "Probablemente si" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(2).Id, Value = "Mejorar los tiempos de respuesta" }
                }
            },
            new SurveyResponse
            {
                SurveyId = survey1.Id,
                SubmittedAt = DateTime.UtcNow.AddDays(-4),
                Answers = new List<Answer>
                {
                    new Answer { QuestionId = survey1.Questions.ElementAt(0).Id, Value = "5" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(1).Id, Value = "Definitivamente si" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(2).Id, Value = "El servicio es muy bueno" }
                }
            },
            new SurveyResponse
            {
                SurveyId = survey1.Id,
                SubmittedAt = DateTime.UtcNow.AddDays(-3),
                Answers = new List<Answer>
                {
                    new Answer { QuestionId = survey1.Questions.ElementAt(0).Id, Value = "3" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(1).Id, Value = "No estoy seguro" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(2).Id, Value = "Podrian ser mas rapidos" }
                }
            },
            new SurveyResponse
            {
                SurveyId = survey1.Id,
                SubmittedAt = DateTime.UtcNow.AddDays(-2),
                Answers = new List<Answer>
                {
                    new Answer { QuestionId = survey1.Questions.ElementAt(0).Id, Value = "4" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(1).Id, Value = "Definitivamente si" },
                    new Answer { QuestionId = survey1.Questions.ElementAt(2).Id, Value = "Excelente atencion" }
                }
            }
        };
        
        context.SurveyResponses.AddRange(responses1);
        await context.SaveChangesAsync();
        
        // Survey 2: Encuesta de Satisfacción Estudiantil 2026
        var survey2 = new Survey
        {
            Title = "Encuesta de Satisfacción Estudiantil 2026",
            Description = "Ayúdanos a mejorar la experiencia educativa con tus opiniones",
            CreatedByUserId = adminUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-3),
            Questions = new List<Question>
            {
                new Question
                {
                    Text = "¿Cómo calificarías la calidad de la enseñanza en general?",
                    Type = QuestionType.Rating,
                    Options = new List<string> { "1", "2", "3", "4", "5" }
                },
                new Question
                {
                    Text = "¿Qué tan satisfecho estás con los recursos tecnológicos disponibles?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Muy satisfecho", 
                        "Satisfecho", 
                        "Neutral", 
                        "Insatisfecho", 
                        "Muy insatisfecho" 
                    }
                },
                new Question
                {
                    Text = "¿Los profesores responden tus preguntas de manera clara y oportuna?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Siempre", 
                        "Frecuentemente", 
                        "A veces", 
                        "Raramente", 
                        "Nunca" 
                    }
                },
                new Question
                {
                    Text = "¿Cómo evaluarías la infraestructura de las instalaciones?",
                    Type = QuestionType.Rating,
                    Options = new List<string> { "1", "2", "3", "4", "5" }
                },
                new Question
                {
                    Text = "¿Qué método de enseñanza prefieres?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Clases presenciales", 
                        "Clases virtuales", 
                        "Híbrido (presencial y virtual)", 
                        "Autoaprendizaje con tutorías"
                    }
                },
                new Question
                {
                    Text = "¿El contenido del curso es relevante para tu carrera profesional?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Totalmente de acuerdo", 
                        "De acuerdo", 
                        "Neutral", 
                        "En desacuerdo", 
                        "Totalmente en desacuerdo" 
                    }
                },
                new Question
                {
                    Text = "¿Cómo calificarías la comunicación con el personal administrativo?",
                    Type = QuestionType.Rating,
                    Options = new List<string> { "1", "2", "3", "4", "5" }
                },
                new Question
                {
                    Text = "¿Recomendarías esta institución a otros estudiantes?",
                    Type = QuestionType.MultipleChoice,
                    Options = new List<string> 
                    { 
                        "Definitivamente sí", 
                        "Probablemente sí", 
                        "No estoy seguro", 
                        "Probablemente no", 
                        "Definitivamente no" 
                    }
                },
                new Question
                {
                    Text = "¿Qué aspecto consideras que debería mejorarse con mayor urgencia?",
                    Type = QuestionType.Text,
                    Options = new List<string>()
                },
                new Question
                {
                    Text = "Comentarios adicionales o sugerencias:",
                    Type = QuestionType.Text,
                    Options = new List<string>()
                }
            }
        };

        context.Surveys.Add(survey2);
        await context.SaveChangesAsync();
    }

    private static async Task UpdateExistingSurveysAsync(ApplicationDbContext context)
    {
        // Find survey with 2024 in the title
        var survey2024 = await context.Surveys
            .FirstOrDefaultAsync(s => s.Title.Contains("2024"));

        if (survey2024 != null)
        {
            // Update title to 2026
            survey2024.Title = "Encuesta de Satisfacción Estudiantil 2026";

            // Remove all responses for this survey
            var responsesToRemove = await context.SurveyResponses
                .Include(r => r.Answers)
                .Where(r => r.SurveyId == survey2024.Id)
                .ToListAsync();

            context.SurveyResponses.RemoveRange(responsesToRemove);

            await context.SaveChangesAsync();
        }
    }
}
