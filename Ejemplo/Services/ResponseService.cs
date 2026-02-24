using Ejemplo.Models;
using Ejemplo.Data;
using Microsoft.EntityFrameworkCore;

namespace Ejemplo.Services;

public interface IResponseService
{
    Task<IEnumerable<SurveyResponse>> GetResponsesBySurveyIdAsync(int surveyId);
    Task<SurveyResponse> SubmitResponseAsync(SurveyResponse response);
}

public class ResponseService : IResponseService
{
    private readonly ApplicationDbContext _context;

    public ResponseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SurveyResponse>> GetResponsesBySurveyIdAsync(int surveyId)
    {
        return await _context.SurveyResponses
            .Include(r => r.Answers)
            .Include(r => r.SubmittedBy)
            .Where(r => r.SurveyId == surveyId)
            .ToListAsync();
    }

    public async Task<SurveyResponse> SubmitResponseAsync(SurveyResponse response)
    {
        response.SubmittedAt = DateTime.UtcNow;

        _context.SurveyResponses.Add(response);
        await _context.SaveChangesAsync();
        return response;
    }
}
