using System.Text.Json.Serialization;

namespace Ejemplo.Models;

public class SurveyResponse
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public DateTime SubmittedAt { get; set; }

    // Relaciones
    public string? SubmittedByUserId { get; set; }
    [JsonIgnore]
    public ApplicationUser? SubmittedBy { get; set; }

    [JsonIgnore]
    public Survey? Survey { get; set; }
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Value { get; set; } = string.Empty;

    // Relación
    public int SurveyResponseId { get; set; }
    [JsonIgnore]
    public SurveyResponse? SurveyResponse { get; set; }

    [JsonIgnore]
    public Question? Question { get; set; }
}
