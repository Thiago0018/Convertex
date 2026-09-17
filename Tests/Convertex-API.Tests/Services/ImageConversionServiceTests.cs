using Convertex_API.Services.ImageFormatConversionService;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Xunit;

namespace Convertex_API.Tests.Services;

public class ImageConversionServiceTests
{
    private readonly ImageConversionService _sut = new();

    [Theory]
    [InlineData("heic")]
    [InlineData("heif")]
    public async Task ConvertAsync_WhenFormatIsHeicOrHeif_ShouldThrowInvalidImageContentException(string format)
    {
        var fileMock = Substitute.For<IFormFile>();
        fileMock.Length.Returns(100);

        Func<Task> act = async () => await _sut.ConvertAsync(fileMock, format);

        await act.Should()
            .ThrowAsync<InvalidImageContentException>()
            .WithMessage("*HEIC é suportado apenas para leitura*");
    }

    [Fact]
    public async Task ConvertAsync_WhenFileIsNull_ShouldThrowArgumentException()
    {
        Func<Task> act = async () => await _sut.ConvertAsync(null!, "png");

        await act.Should()
            .ThrowAsync<ArgumentException>()
            .WithMessage("Nenhum arquivo encontrado*");
    }

    [Fact]
    public async Task ConvertAsync_WhenFormatIsUnsupported_ShouldThrowInvalidImageContentException()
    {
        var fileMock = Substitute.For<IFormFile>();
        fileMock.Length.Returns(100);

        Func<Task> act = async () => await _sut.ConvertAsync(fileMock, "unsupported_format");

        await act.Should()
            .ThrowAsync<InvalidImageContentException>()
            .WithMessage("*não é suportado para conversão*");
    }

    [Fact]
    public async Task ConvertAsync_WhenValidPngImage_ShouldConvertToJpegSuccessfully()
    {
        // Arrange
        byte[] imageBytes;
        using (var image = new Image<Rgba32>(10, 10))
        {
            image[0, 0] = Color.Red;

            using var tempStream = new MemoryStream();
            await image.SaveAsPngAsync(tempStream);
            imageBytes = tempStream.ToArray();
        }

        var fileMock = Substitute.For<IFormFile>();
        fileMock.Length.Returns(imageBytes.Length);
        fileMock.FileName.Returns("foto_teste.png");
        fileMock.ContentType.Returns("image/png");

        fileMock.OpenReadStream().Returns(_ => new MemoryStream(imageBytes));

        // Act
        var (fileBytes, contentType, fileName) = await _sut.ConvertAsync(fileMock, "jpeg");

        // Assert
        fileBytes.Should().NotBeEmpty();
        contentType.Should().Be("image/jpeg");
        fileName.Should().Be("foto_teste.jpg");
    }
}