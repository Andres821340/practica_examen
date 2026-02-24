using System.Text.Json.Serialization;

namespace Ejemplo.Models;

public class Survey
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Relaciones
    public string CreatedByUserId { get; set; } = string.Empty;
    [JsonIgnore]
    public ApplicationUser? CreatedBy { get; set; }

    public ICollection<Question> Questions { get; set; } = new List<Question>();

    [JsonIgnore]
    public ICollection<SurveyResponse> Responses { get; set; } = new List<SurveyResponse>();
}

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public List<string> Options { get; set; } = new();

    // Relación
    public int SurveyId { get; set; }
    [JsonIgnore]
    public Survey? Survey { get; set; }
}

public enum QuestionType
{
    MultipleChoice,
    Text,
    Rating
}
