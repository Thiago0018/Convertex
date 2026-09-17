using FluentAssertions;
using MeuProjetoVision.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Convertex_API.Tests.Services;

public class DailyRequestCounterTests
{
    [Fact]
    public async Task TryConsumeAsync_WhenWithinLimit_ShouldReturnTrue()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "1000"},
            {"Ocr:ReservedRequests", "100"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var counter = new DailyRequestCounter(configuration);

        var result = await counter.TryConsumeAsync();

        result.Should().BeTrue();
    }

    [Fact]
    public async Task TryConsumeAsync_WhenReachingMaxAllowedLimit_ShouldReturnFalse()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "3"},
            {"Ocr:ReservedRequests", "1"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var counter = new DailyRequestCounter(configuration);

        var req1 = await counter.TryConsumeAsync();
        var req2 = await counter.TryConsumeAsync();
        var req3 = await counter.TryConsumeAsync();

        req1.Should().BeTrue();
        req2.Should().BeTrue();
        req3.Should().BeFalse();
    }

    [Fact]
    public void Constructor_WhenLimitIsInvalid_ShouldThrowInvalidOperationException()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "0"},
            {"Ocr:ReservedRequests", "0"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        Action act = () => new DailyRequestCounter(configuration);

        act.Should().Throw<InvalidOperationException>();
    }
}