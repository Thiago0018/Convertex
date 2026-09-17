using System.Text;
using FluentAssertions;
using MeuProjetoVision.Controllers;
using MeuProjetoVision.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Xunit;

namespace Convertex_API.Tests.Controllers;

public class OcrControllerTests
{
    private readonly IOcrService _ocrServiceMock = Substitute.For<IOcrService>();
    private readonly IDailyRequestCounter _dailyRequestCounterMock = Substitute.For<IDailyRequestCounter>();
    private readonly OcrController _sut;

    public OcrControllerTests()
    {
        _sut = new OcrController(_ocrServiceMock, _dailyRequestCounterMock);
    }

    [Fact]
    public async Task ExtractText_WhenFileIsNull_ShouldReturnBadRequest()
    {
        var result = await _sut.ExtractText(null!, "txt");

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value.Should().Be("Nenhum arquivo enviado.");
    }

    [Fact]
    public async Task ExtractText_WhenFileExtensionIsInvalid_ShouldReturnBadRequest()
    {
        var fileMock = Substitute.For<IFormFile>();
        fileMock.FileName.Returns("documento.pdf");
        fileMock.Length.Returns(100);

        var result = await _sut.ExtractText(fileMock, "txt");

        var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequestResult.Value?.ToString().Should().Contain("Envie uma imagem JPG ou PNG");
    }

    [Fact]
    public async Task ExtractText_WhenDailyLimitIsReached_ShouldReturn429TooManyRequests()
    {
        var fileMock = Substitute.For<IFormFile>();
        fileMock.FileName.Returns("imagem.png");
        fileMock.Length.Returns(1024);

        _dailyRequestCounterMock.TryConsumeAsync().Returns(false);

        var result = await _sut.ExtractText(fileMock, "txt");

        var objectResult = result.Should().BeOfType<ObjectResult>().Subject;
        objectResult.StatusCode.Should().Be(StatusCodes.Status429TooManyRequests);
        objectResult.Value.Should().Be("Limite diário de OCR atingido. Tente novamente amanhã.");
    }

    [Fact]
    public async Task ExtractText_WhenRequestIsValid_ShouldReturnFileResult()
    {
        var fileMock = Substitute.For<IFormFile>();
        fileMock.FileName.Returns("imagem.jpg");
        fileMock.Length.Returns(1024);

        _dailyRequestCounterMock.TryConsumeAsync().Returns(true);

        byte[] dummyBytes = Encoding.UTF8.GetBytes("resultado ocr");
        _ocrServiceMock.ProcessAndExportAsync(fileMock, "txt")
            .Returns((dummyBytes, "text/plain", "resultado-ocr.txt"));

        var result = await _sut.ExtractText(fileMock, "txt");

        var fileResult = result.Should().BeOfType<FileContentResult>().Subject;
        fileResult.ContentType.Should().Be("text/plain");
        fileResult.FileDownloadName.Should().Be("resultado-ocr.txt");
        fileResult.FileContents.Should().BeEquivalentTo(dummyBytes);
    }
}