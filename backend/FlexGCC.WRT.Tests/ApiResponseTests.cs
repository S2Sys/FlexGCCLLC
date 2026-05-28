using FlexGCC.WRT.Application.Common;

namespace FlexGCC.WRT.Tests;

public class ApiResponseTests
{
    [Fact]
    public void Ok_WrapsDataAndSetsSuccess()
    {
        var response = ApiResponse<string>.Ok("hello");
        Assert.True(response.Success);
        Assert.Equal("hello", response.Data);
        Assert.Null(response.Error);
    }

    [Fact]
    public void Fail_SetsErrorAndClearsData()
    {
        var error = new ApiErrorResponse("NotFound", "Not found.", []);
        var response = ApiResponse<string>.Fail(error);
        Assert.False(response.Success);
        Assert.Null(response.Data);
        Assert.Equal("NotFound", response.Error!.Code);
    }
}

