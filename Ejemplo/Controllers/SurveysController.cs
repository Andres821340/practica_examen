using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ejemplo.Models;
using Ejemplo.Services;
using System.Security.Claims;

namespace Ejemplo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación para todos los endpoints
public class SurveysController : ControllerBase
{
    private readonly ISurveyService _surveyService;

    public SurveysController(ISurveyService surveyService)
    {
        _surveyService = surveyService;
    }

    [HttpGet]
    [AllowAnonymous] // Todos pueden ver encuestas
    public async Task<ActionResult<IEnumerable<Survey>>> GetAll()
    {
        var surveys = await _surveyService.GetAllSurveysAsync();
        return Ok(surveys);
    }

    [HttpGet("{id}")]
    [AllowAnonymous] // Todos pueden ver una encuesta específica
    public async Task<ActionResult<Survey>> GetById(int id)
    {
        var survey = await _surveyService.GetSurveyByIdAsync(id);
        if (survey == null)
            return NotFound();

        return Ok(survey);
    }

    [HttpPost]
    [Authorize(Roles = "Administrador")] // Solo administradores pueden crear
    public async Task<ActionResult<Survey>> Create([FromBody] Survey survey)
    {
        // Obtener el userId del token JWT
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        survey.CreatedByUserId = userId;
        survey.CreatedAt = DateTime.UtcNow;

        var created = await _surveyService.CreateSurveyAsync(survey);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")] // Solo administradores pueden eliminar
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _surveyService.DeleteSurveyAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
