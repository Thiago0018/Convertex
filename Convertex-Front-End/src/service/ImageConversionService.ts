import { api } from "./api";

export interface ImageResponseDto {
    fileName: string;
    contentType: string;
    base64Dto: string;
}

export interface SupportedFormatsResponseDto {
    formats: string[];
    totalCount: number;
}

export const ImageConversionService = {
    getSupportedFormats: async (): Promise<SupportedFormatsResponseDto> => {
        const response = await api.get<SupportedFormatsResponseDto>('/ImageConverter/supported-formats');
        return response.data;
    },

    convertImage: async (file: File, format: string): Promise<ImageResponseDto> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        const response = await api.post<ImageResponseDto>('/ImageConverter/Conversion', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
};