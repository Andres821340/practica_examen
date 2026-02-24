using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Ejemplo.Models;

namespace Ejemplo.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Survey> Surveys { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<SurveyResponse> SurveyResponses { get; set; }
    public DbSet<Answer> Answers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configurar relaciones Survey <-> User
        modelBuilder.Entity<Survey>()
            .HasOne(s => s.CreatedBy)
            .WithMany(u => u.Surveys)
            .HasForeignKey(s => s.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Configurar relaciones Survey <-> Questions
        modelBuilder.Entity<Question>()
            .HasOne(q => q.Survey)
            .WithMany(s => s.Questions)
            .HasForeignKey(q => q.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Configurar relaciones SurveyResponse <-> Survey
        modelBuilder.Entity<SurveyResponse>()
            .HasOne(sr => sr.Survey)
            .WithMany(s => s.Responses)
            .HasForeignKey(sr => sr.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Configurar relaciones SurveyResponse <-> User
        modelBuilder.Entity<SurveyResponse>()
            .HasOne(sr => sr.SubmittedBy)
            .WithMany(u => u.Responses)
            .HasForeignKey(sr => sr.SubmittedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
        
        // Configurar relaciones Answer <-> SurveyResponse
        modelBuilder.Entity<Answer>()
            .HasOne(a => a.SurveyResponse)
            .WithMany(sr => sr.Answers)
            .HasForeignKey(a => a.SurveyResponseId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Configurar relaciones Answer <-> Question
        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany()
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Configurar conversión de List<string> a JSON para Options
        modelBuilder.Entity<Question>()
            .Property(q => q.Options)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );
    }
}
