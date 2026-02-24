using Ejemplo.Models;

namespace Ejemplo.Services;

public interface IAnalyticsService
{
    Task<AnalyticsData> GetSurveyAnalyticsAsync(int surveyId);
}

public class AnalyticsService : IAnalyticsService
{
    private readonly ISurveyService _surveyService;
    private readonly IResponseService _responseService;

    public AnalyticsService(ISurveyService surveyService, IResponseService responseService)
    {
        _surveyService = surveyService;
        _responseService = responseService;
    }

    public async Task<AnalyticsData> GetSurveyAnalyticsAsync(int surveyId)
    {
        var survey = await _surveyService.GetSurveyByIdAsync(surveyId);
        if (survey == null)
            throw new ArgumentException($"Survey with ID {surveyId} not found");

        var responses = await _responseService.GetResponsesBySurveyIdAsync(surveyId);
        var responsesList = responses.ToList();

        var analyticsData = new AnalyticsData
        {
            SurveyId = surveyId,
            SurveyTitle = survey.Title,
            TotalResponses = responsesList.Count
        };

        foreach (var question in survey.Questions)
        {
            var questionAnalytics = new QuestionAnalytics
            {
                QuestionId = question.Id,
                QuestionText = question.Text,
                QuestionType = question.Type
            };

            var answersForQuestion = responsesList
                .SelectMany(r => r.Answers)
                .Where(a => a.QuestionId == question.Id);

            if (question.Type == QuestionType.Text)
            {
                questionAnalytics.TextResponses = answersForQuestion
                    .Select(a => a.Value)
                    .ToList();
            }
            else
            {
                questionAnalytics.ResponseDistribution = answersForQuestion
                    .GroupBy(a => a.Value)
                    .ToDictionary(g => g.Key, g => g.Count());
            }

            analyticsData.QuestionAnalytics.Add(questionAnalytics);
        }

        return analyticsData;
    }
}
