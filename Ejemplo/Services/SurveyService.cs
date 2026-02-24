using Ejemplo.Models;
using Ejemplo.Data;
using Microsoft.EntityFrameworkCore;

namespace Ejemplo.Services;

public interface ISurveyService
{
    Task<IEnumerable<Survey>> GetAllSurveysAsync();
    Task<Survey?> GetSurveyByIdAsync(int id);
    Task<Survey> CreateSurveyAsync(Survey survey);
    Task<bool> DeleteSurveyAsync(int id);
}

public class SurveyService : ISurveyService
{
    private readonly ApplicationDbContext _context;

    public SurveyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Survey>> GetAllSurveysAsync()
    {
        return await _context.Surveys
            .Include(s => s.Questions)
            .Include(s => s.CreatedBy)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<Survey?> GetSurveyByIdAsync(int id)
    {
        return await _context.Surveys
            .Include(s => s.Questions)
            .Include(s => s.CreatedBy)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Survey> CreateSurveyAsync(Survey survey)
    {
        survey.CreatedAt = DateTime.UtcNow;

        _context.Surveys.Add(survey);
        await _context.SaveChangesAsync();
        return survey;
    }

    public async Task<bool> DeleteSurveyAsync(int id)
    {
        var survey = await _context.Surveys.FindAsync(id);
        if (survey == null) return false;

        _context.Surveys.Remove(survey);
        await _context.SaveChangesAsync();
        return true;
    }
}
