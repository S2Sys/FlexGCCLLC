using FlexGCC.WRT.Application.Common;
using FlexGCC.WRT.Application.WorkRequests;
using FlexGCC.WRT.Domain.WorkRequests;
using Microsoft.Extensions.Logging;

namespace FlexGCC.WRT.Infrastructure.Persistence;

public sealed class LoggingWorkRequestRepository : IWorkRequestRepository
{
    private readonly IWorkRequestRepository _inner;
    private readonly ILogger<LoggingWorkRequestRepository> _logger;

    public LoggingWorkRequestRepository(
        IWorkRequestRepository inner,
        ILogger<LoggingWorkRequestRepository> logger)
    {
        _inner = Guard.NotNull(inner, nameof(inner));
        _logger = Guard.NotNull(logger, nameof(logger));
    }

    public IReadOnlyList<WorkRequest> GetAll(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize)
    {
        _logger.LogInformation(
            "Repository: GetAll Status={Status} Search={Search} Page={Page} PageSize={PageSize}",
            status, search, page, pageSize);
        return _inner.GetAll(status, search, page, pageSize);
    }

    public (IReadOnlyList<WorkRequest> Items, int TotalCount) GetPage(
        WorkRequestStatus? status,
        string? search,
        int page,
        int pageSize)
    {
        _logger.LogInformation(
            "Repository: GetPage Status={Status} Search={Search} Page={Page} PageSize={PageSize}",
            status, search, page, pageSize);
        return _inner.GetPage(status, search, page, pageSize);
    }

    public WorkRequest? GetById(int id)
    {
        _logger.LogInformation("Repository: GetById {Id}", id);
        return _inner.GetById(id);
    }

    public WorkRequest Add(WorkRequest request)
    {
        _logger.LogInformation("Repository: Add Title={Title}", request.Title);
        return _inner.Add(request);
    }

    public WorkRequest Update(WorkRequest request)
    {
        _logger.LogInformation("Repository: Update Id={Id}", request.Id);
        return _inner.Update(request);
    }

    public WorkRequestNote AddNote(int workRequestId, string noteText, DateTime createdDate)
    {
        _logger.LogInformation("Repository: AddNote WorkRequestId={Id}", workRequestId);
        return _inner.AddNote(workRequestId, noteText, createdDate);
    }
}

