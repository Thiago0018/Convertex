import { api } from './api';
import axios from 'axios';

export type FileFormat = 'txt' | 'json' | 'csv' | 'docx' | 'pdf';

export interface OcrExtractionResult {
    text: string;
    blobData: Blob;
}

export const ocrService = {
    async uploadToApi(file: File, format: FileFormat): Promise<OcrExtractionResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<Blob>('/ocr/extract', formData, {
                params: { format },
                responseType: 'blob',
            });

            const blobData = response.data;
            let text = '';

            if (format === 'docx' || format === 'pdf') {
                const textResponse = await api.post<Blob>('/ocr/extract', formData, {
                    params: { format: 'txt' },
                    responseType: 'blob',
                });
                text = await textResponse.data.text();
            } else {
                text = await blobData.text();
            }

            return { text, blobData };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (!error.response) {
                    throw new Error('Não foi possível conectar à API do Convertex.');
                }
                if (error.response.data instanceof Blob) {
                    const errorMessage = await error.response.data.text();
                    throw new Error(errorMessage || 'A API recusou a conversão.');
                }
                throw new Error(error.response.data?.message || 'Erro no processamento da imagem.');
            }
            throw new Error('Erro inesperado ao converter a imagem.');
        }
    },
};
