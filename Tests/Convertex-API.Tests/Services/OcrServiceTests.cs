using System.Text;
using FluentAssertions;
using MeuProjetoVision.Integrations;
using MeuProjetoVision.Services;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using Xunit;

namespace Convertex_API.Tests.Services;

public class OcrServiceTests
{
    private readonly IGoogleVisionClient _visionClientMock = Substitute.For<IGoogleVisionClient>();
    private readonly OcrService _sut;

    public OcrServiceTests()
    {
        _sut = new OcrService(_visionClientMock);
    }

    [Fact]
    public async Task ProcessAndExportAsync_WhenFormatIsTxt_ShouldReturnPlainTextFile()
    {
        var fileMock = Substitute.For<IFormFile>();
        _visionClientMock.DetectTextAsync(fileMock).Returns("Extracted OCR Text");

        var (fileBytes, contentType, fileName) = await _sut.ProcessAndExportAsync(fileMock, "txt");

        string content = Encoding.UTF8.GetString(fileBytes);
        content.Should().Be("Extracted OCR Text");
        contentType.Should().Be("text/plain");
        fileName.Should().Be("resultado-ocr.txt");
    }

    [Fact]
    public async Task ProcessAndExportAsync_WhenFormatIsJson_ShouldReturnValidJsonStructure()
    {
        var fileMock = Substitute.For<IFormFile>();
        _visionClientMock.DetectTextAsync(fileMock).Returns("Extracted OCR Text");

        var (fileBytes, contentType, fileName) = await _sut.ProcessAndExportAsync(fileMock, "json");

        string content = Encoding.UTF8.GetString(fileBytes);
        content.Should().Contain("\"extractedText\": \"Extracted OCR Text\"");
        contentType.Should().Be("application/json");
        fileName.Should().Be("resultado-ocr.json");
    }

    [Fact]
    public async Task ProcessAndExportAsync_WhenFormatIsCsv_ShouldEscapeDoubleQuotes()
    {
        var fileMock = Substitute.For<IFormFile>();
        _visionClientMock.DetectTextAsync(fileMock).Returns("Text with \"quotes\"");

        var (fileBytes, contentType, fileName) = await _sut.ProcessAndExportAsync(fileMock, "csv");

        string content = Encoding.UTF8.GetString(fileBytes);
        content.Should().Contain("\"Text with \"\"quotes\"\"\"");
        contentType.Should().Be("text/csv");
        fileName.Should().Be("resultado-ocr.csv");
    }

    [Fact]
    public async Task ProcessAndExportAsync_WhenFormatIsDocx_ShouldGenerateWordDocument()
    {
        var fileMock = Substitute.For<IFormFile>();
        _visionClientMock.DetectTextAsync(fileMock).Returns("Line 1\nLine 2");

        var (fileBytes, contentType, fileName) = await _sut.ProcessAndExportAsync(fileMock, "docx");

        fileBytes.Should().NotBeEmpty();
        contentType.Should().Be("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        fileName.Should().Be("resultado-ocr.docx");
    }

    [Fact]
    public async Task ProcessAndExportAsync_WhenFormatIsPdf_ShouldGeneratePdfDocument()
    {
        var fileMock = Substitute.For<IFormFile>();
        _visionClientMock.DetectTextAsync(fileMock).Returns("PDF Document Content");

        var (fileBytes, contentType, fileName) = await _sut.ProcessAndExportAsync(fileMock, "pdf");

        fileBytes.Should().NotBeEmpty();
        contentType.Should().Be("application/pdf");
        fileName.Should().Be("resultado-ocr.pdf");
    }
}