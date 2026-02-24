using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ejemplo.Models;
using Ejemplo.Services;
using System.Security.Claims;

namespace Ejemplo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requiere autenticación
public class ResponsesController : ControllerBase
{
    private readonly IResponseService _responseService;

    public ResponsesController(IResponseService responseService)
    {
        _responseService = responseService;
    }

    [HttpGet("survey/{surveyId}")]
    [Authorize(Roles = "Administrador")] // Solo administradores pueden ver respuestas
    public async Task<ActionResult<IEnumerable<SurveyResponse>>> GetBySurvey(int surveyId)
    {
        var responses = await _responseService.GetResponsesBySurveyIdAsync(surveyId);
        return Ok(responses);
    }

    [HttpPost]
    [Authorize] // Tanto administradores como usuarios pueden responder
    public async Task<ActionResult<SurveyResponse>> Submit([FromBody] SurveyResponse response)
    {
        // Obtener userId del token
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            response.SubmittedByUserId = userId;
        }

        response.SubmittedAt = DateTime.UtcNow;

        var submitted = await _responseService.SubmitResponseAsync(response);
        return Ok(submitted);
    }
}
