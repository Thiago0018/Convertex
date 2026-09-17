using System.Net;
using System.Net.Http.Json;
using Convertex_API.Dtos;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Convertex_API.Tests.Controllers;

public class ImageConverterControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ImageConverterControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetSupportedFormats_DeveRetornarStatus200EExcluirFormatosHeic()
    {
        var response = await _client.GetAsync("/api/ImageConverter/supported-formats");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var dto = await response.Content.ReadFromJsonAsync<SupportedFormatsResponseDto>();
        dto.Should().NotBeNull();
        dto!.Formats.Should().NotContain("heic");
        dto.Formats.Should().NotContain("heif");
        dto.Formats.Should().Contain("png");
        dto.TotalCount.Should().Be(dto.Formats.Count);
    }
}