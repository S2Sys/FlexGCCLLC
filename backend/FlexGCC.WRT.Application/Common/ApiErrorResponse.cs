namespace FlexGCC.WRT.Application.Common;

public sealed record ApiErrorResponse(string Code, string Message, IReadOnlyList<string> Details);

