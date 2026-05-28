using FlexGCC.WRT.Application.Common;

namespace FlexGCC.WRT.Tests;

public class GuardTests
{
    [Fact]
    public void NotNull_NonNullValue_Returns() => Guard.NotNull("value", "param");

    [Fact]
    public void NotNull_NullValue_Throws()
    {
        var ex = Assert.Throws<ArgumentNullException>(() => Guard.NotNull<string>(null!, "param"));
        Assert.Equal("param", ex.ParamName);
    }

    [Fact]
    public void NotNullOrWhiteSpace_ValidString_Returns() =>
        Guard.NotNullOrWhiteSpace("hello", "param");

    [Fact]
    public void NotNullOrWhiteSpace_EmptyString_Throws()
    {
        var ex = Assert.Throws<ArgumentException>(() => Guard.NotNullOrWhiteSpace("  ", "name"));
        Assert.Equal("name", ex.ParamName);
    }

    [Fact]
    public void Positive_PositiveInt_Returns() => Guard.Positive(1, "id");

    [Fact]
    public void Positive_Zero_Throws()
    {
        var ex = Assert.Throws<ArgumentOutOfRangeException>(() => Guard.Positive(0, "id"));
        Assert.Equal("id", ex.ParamName);
    }
}

