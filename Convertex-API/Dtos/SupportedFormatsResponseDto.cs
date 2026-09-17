namespace Convertex_API.Dtos;

public record SupportedFormatsResponseDto(
    List<string> Formats,
    int TotalCount
);