import { api } from "./api";

export interface SupportedFormatsResponseDto {
    formats: string[];
    totalCount: number;
}

export const imageConversionService = {
    getSupportedFormats: async (): Promise<SupportedFormatsResponseDto> => {
        const response = await api.get<SupportedFormatsResponseDto>('/ImageConverter/supported-formats');
        return response.data;
    },

    convertImage: async (file: File, format: string): Promise<Blob> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);

        const response = await api.post('/ImageConverter/Conversion', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            responseType: 'blob'
        });

        return response.data;
    }
};