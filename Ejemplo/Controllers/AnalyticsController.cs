using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ejemplo.Models;
using Ejemplo.Services;

namespace Ejemplo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")] // Solo administradores pueden ver analíticas
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("survey/{surveyId}")]
    public async Task<ActionResult<AnalyticsData>> GetSurveyAnalytics(int surveyId)
    {
        try
        {
            var analytics = await _analyticsService.GetSurveyAnalyticsAsync(surveyId);
            return Ok(analytics);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
