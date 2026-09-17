using FluentAssertions;
using MeuProjetoVision.Services;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using StackExchange.Redis;
using Xunit;

namespace Convertex_API.Tests.Services;

public class RedisDailyRequestCounterTests
{
    private readonly IConnectionMultiplexer _redisConnectionMock = Substitute.For<IConnectionMultiplexer>();
    private readonly IDatabase _databaseMock = Substitute.For<IDatabase>();

    public RedisDailyRequestCounterTests()
    {
        _redisConnectionMock.GetDatabase(Arg.Any<int>(), Arg.Any<object>()).Returns(_databaseMock);
    }

    [Fact]
    public async Task TryConsumeAsync_WhenRedisScriptReturnsOne_ShouldReturnTrue()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "1000"},
            {"Ocr:ReservedRequests", "100"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _databaseMock.ScriptEvaluateAsync(
            Arg.Any<string>(),
            Arg.Any<RedisKey[]>(),
            Arg.Any<RedisValue[]>(),
            Arg.Any<CommandFlags>()
        ).Returns(Task.FromResult(RedisResult.Create(1)));

        var counter = new RedisDailyRequestCounter(_redisConnectionMock, configuration);

        var result = await counter.TryConsumeAsync();

        result.Should().BeTrue();
    }

    [Fact]
    public async Task TryConsumeAsync_WhenRedisScriptReturnsZero_ShouldReturnFalse()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "1000"},
            {"Ocr:ReservedRequests", "100"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _databaseMock.ScriptEvaluateAsync(
            Arg.Any<string>(),
            Arg.Any<RedisKey[]>(),
            Arg.Any<RedisValue[]>(),
            Arg.Any<CommandFlags>()
        ).Returns(Task.FromResult(RedisResult.Create(0)));

        var counter = new RedisDailyRequestCounter(_redisConnectionMock, configuration);

        var result = await counter.TryConsumeAsync();

        result.Should().BeFalse();
    }

    [Fact]
    public void Constructor_WhenConfigurationIsInvalid_ShouldThrowInvalidOperationException()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Ocr:DailyRequestLimit", "0"},
            {"Ocr:ReservedRequests", "0"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        Action act = () => new RedisDailyRequestCounter(_redisConnectionMock, configuration);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("A configuração diária de OCR é inválida.");
    }
}