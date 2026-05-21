using FlexGCCLLC.WorkRequestTracker.Api.Contracts.WorkRequests;

namespace FlexGCCLLC.WorkRequestTracker.Api.Features.WorkRequests.Validation;

public static class WorkRequestValidator
{
    public static IReadOnlyList<string> ValidateCreate(CreateWorkRequestRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            errors.Add("Title is required.");
        }

        if (string.IsNullOrWhiteSpace(request.ClientName))
        {
            errors.Add("Client name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            errors.Add("Description is required.");
        }

        if (!Enum.IsDefined(typeof(WorkRequestPriority), request.Priority))
        {
            errors.Add("Priority must be Low, Medium, or High.");
        }

        if (!Enum.IsDefined(typeof(WorkRequestStatus), request.Status))
        {
            errors.Add("Status must be New, InProgress, Blocked, or Completed.");
        }

        if (request.DueDate == default)
        {
            errors.Add("Due date is required.");
        }

        return errors;
    }
}
