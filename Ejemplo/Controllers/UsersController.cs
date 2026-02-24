using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ejemplo.Models;
using Ejemplo.Data;
using System.Security.Claims;

namespace Ejemplo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")] // Solo administradores
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public UsersController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    // GET: api/users - Obtener todos los usuarios
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();

        var usersWithRoles = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            usersWithRoles.Add(new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.CreatedAt,
                Roles = roles
            });
        }

        return Ok(usersWithRoles);
    }

    // GET: api/users/{userId}/responses - Obtener respuestas de un usuario específico
    [HttpGet("{userId}/responses")]
    public async Task<ActionResult<object>> GetUserResponses(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "Usuario no encontrado" });

        var responses = await _context.SurveyResponses
            .Include(r => r.Survey)
            .Include(r => r.Answers)
                .ThenInclude(a => a.Question)
            .Where(r => r.SubmittedByUserId == userId)
            .OrderByDescending(r => r.SubmittedAt)
            .Select(r => new
            {
                r.Id,
                r.SurveyId,
                SurveyTitle = r.Survey.Title,
                r.SubmittedAt,
                AnswersCount = r.Answers.Count,
                Answers = r.Answers.Select(a => new
                {
                    QuestionText = a.Question.Text,
                    a.Value
                })
            })
            .ToListAsync();

        return Ok(new
        {
            User = new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.CreatedAt
            },
            TotalResponses = responses.Count,
            Responses = responses
        });
    }

    // PUT: api/users/{userId}/role - Cambiar el rol de un usuario
    [HttpPut("{userId}/role")]
    public async Task<ActionResult> UpdateUserRole(string userId, [FromBody] UpdateRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "Usuario no encontrado" });

        // Validar que el rol sea válido
        if (request.Role != "Administrador" && request.Role != "Usuario")
            return BadRequest(new { message = "Rol inválido" });

        // Remover todos los roles actuales del usuario
        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        // Asignar el nuevo rol al usuario
        await _userManager.AddToRoleAsync(user, request.Role);

        return Ok(new { message = $"Rol actualizado a {request.Role}" });
    }

    // PUT: api/users/{userId}/update - Actualizar información de un usuario
    [HttpPut("{userId}/update")]
    [Authorize(Roles = "Administrador")] // Solo administradores
    public async Task<ActionResult> UpdateUser(string userId, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // Actualizar nombre completo del usuario
            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                user.FullName = request.FullName;
            }

            // Actualizar correo electrónico del usuario (solo si es diferente)
            if (!string.IsNullOrWhiteSpace(request.Email) && request.Email != user.Email)
            {
                // Verificar que el email no esté siendo usado por otro usuario
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != userId)
                {
                    return BadRequest(new { message = "El correo electrónico ya está en uso" });
                }

                user.Email = request.Email;
                user.UserName = request.Email;
                user.NormalizedEmail = request.Email.ToUpper();
                user.NormalizedUserName = request.Email.ToUpper();
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                return BadRequest(new { message = "Error al actualizar el usuario", errors });
            }

            // Actualizar contraseña si se proporciona una nueva (solo admins o el mismo usuario)
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, request.Password);

                if (!passwordResult.Succeeded)
                {
                    var errors = string.Join(", ", passwordResult.Errors.Select(e => e.Description));
                    return BadRequest(new { message = "Error al actualizar la contraseña", errors });
                }
            }

            // Guardar todos los cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario actualizado exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    // DELETE: api/users/{userId}/delete - Eliminar un usuario
    [HttpDelete("{userId}/delete")]
    public async Task<ActionResult> DeleteUser(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // No permitir eliminar la propia cuenta del administrador actual
            if (user.Id == User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value)
                return BadRequest(new { message = "No puedes eliminar tu propia cuenta" });

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
                return Ok(new { message = "Usuario eliminado exitosamente" });

            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(new { message = "Error al eliminar usuario", errors });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }
}

public class UpdateRoleRequest
{
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
}
