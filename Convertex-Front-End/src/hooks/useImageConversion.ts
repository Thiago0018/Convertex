import { useState, useEffect } from "react";
import { imageConversionService } from "../services/imageConversionService";

export function useImageConversion() {
    const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

    useEffect(() => {
        async function fetchFormats() {
            try {
                const data = await imageConversionService.getSupportedFormats();
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

            const blobResult = await imageConversionService.convertImage(file, format);
            setConvertedBlob(blobResult);

            const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
            const downloadName = `${baseName}.${format.toLowerCase()}`;
            const blobUrl = window.URL.createObjectURL(blobResult);

            const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

            if (isIOS) {
                window.open(blobUrl, '_blank');
            } else {
                const downloadLink = document.createElement('a');
                downloadLink.href = blobUrl;
                downloadLink.download = downloadName;

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(blobUrl);
            }
        } catch (err: any) {
            if (err.response?.data instanceof Blob) {
                const textError = await err.response.data.text();
                const parsedError = JSON.parse(textError);
                setError(parsedError.message || "Falha ao processar e converter a imagem.");
            } else {
                setError(err.response?.data?.message || "Falha ao processar e converter a imagem.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setConvertedBlob(null);
        setError(null);
    };

    return {
        convertedBlob,
        loading,
        error,
        supportedFormats,
        handleConvert,
        reset
    };
}