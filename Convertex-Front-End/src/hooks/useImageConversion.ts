import { useState, useEffect } from "react";
import { ImageConversionService, ImageResponseDto } from "../service/ImageConversionService";

export function useImageConversion() {
    const [convertedData, setConvertedData] = useState<ImageResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

    useEffect(() => {
        async function fetchFormats() {
            try {
                const data = await ImageConversionService.getSupportedFormats();
                setSupportedFormats(data.formats);
            } catch (err) {
                console.error("Erro ao carregar formatos da API:", err);
            }
        }
        fetchFormats();
    }, []);

    const handleConvert = async (file: File, format: string) => {
        try {
            setLoading(true);
            setError(null);

            const result = await ImageConversionService.convertImage(file, format);

            setConvertedData(result);

            triggerDownload(result.base64Dto, result.contentType, result.fileName);

        } catch (err: any) {
            const apiMessage = err.response?.data?.message || "Falha ao processar e converter a imagem.";
            setError(apiMessage);
            console.error(err);

        } finally {
            setLoading(false);
        }
    };


    const triggerDownload = (base64: string, contentType: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = `data:${contentType};base64,${base64}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const reset = () => {
        setConvertedData(null);
        setError(null);
    };

    return {
        convertedData,
        loading,
        error,
        supportedFormats,
        handleConvert,
        reset
    };
}