using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace Ejemplo.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navegación
    [JsonIgnore]
    public ICollection<Survey> Surveys { get; set; } = new List<Survey>();
    [JsonIgnore]
    public ICollection<SurveyResponse> Responses { get; set; } = new List<SurveyResponse>();
}
