using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Ejemplo.Models;

namespace Ejemplo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    
    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }
    
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "El correo ya está registrado" });
        
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            CreatedAt = DateTime.UtcNow
        };
        
        var result = await _userManager.CreateAsync(user, request.Password);
        
        if (!result.Succeeded)
            return BadRequest(new { message = "Error al crear usuario", errors = result.Errors });
        
        // Asignar rol de Usuario por defecto
        await _userManager.AddToRoleAsync(user, "Usuario");
        
        var token = await GenerateJwtToken(user);
        
        return Ok(token);
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized(new { message = "Credenciales inválidas" });
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        
        if (!result.Succeeded)
            return Unauthorized(new { message = "Credenciales inválidas" });
        
        var token = await GenerateJwtToken(user);
        
        return Ok(token);
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<object>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            fullName = user.FullName,
            role = roles.FirstOrDefault() ?? "Usuario",
            createdAt = user.CreatedAt
        });
    }

    // POST: api/auth/change-password - Cambiar contraseña del usuario actual
    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "Usuario no encontrado" });

        // Verificar la contraseña actual
        var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
        if (!isPasswordCorrect)
            return BadRequest(new { message = "La contraseña actual es incorrecta" });

        // Cambiar a la nueva contraseña
        var changeResult = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (!changeResult.Succeeded)
        {
            var errors = string.Join(", ", changeResult.Errors.Select(e => e.Description));
            return BadRequest(new { message = "Error al cambiar la contraseña", errors });
        }

        return Ok(new { message = "Contraseña cambiada exitosamente" });
    }

    private async Task<AuthResponse> GenerateJwtToken(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "Usuario";
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, role)
        };
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "your-very-secret-key-min-32-characters-long!!!")
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiration = DateTime.UtcNow.AddDays(7);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "SurveyHubAPI",
            audience: _configuration["Jwt:Audience"] ?? "SurveyHubClient",
            claims: claims,
            expires: expiration,
            signingCredentials: creds
        );
        
        return new AuthResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Email = user.Email!,
            FullName = user.FullName,
            Role = role,
            Expiration = expiration
        };
    }
}
