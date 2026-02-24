namespace Ejemplo.Models;

public class AnalyticsData
{
    public int SurveyId { get; set; }
    public string SurveyTitle { get; set; } = string.Empty;
    public int TotalResponses { get; set; }
    public List<QuestionAnalytics> QuestionAnalytics { get; set; } = new();
}

public class QuestionAnalytics
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }
    public Dictionary<string, int> ResponseDistribution { get; set; } = new();
    public List<string> TextResponses { get; set; } = new();
}
