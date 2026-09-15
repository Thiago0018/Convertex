import { useState, ChangeEvent, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useImageConversion } from "../hooks/useImageConversion";

export function ConvertionPage() {
    const { supportedFormats, handleConvert, loading, error, reset } = useImageConversion();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState<string>("");

    useEffect(() => {
        if (supportedFormats && supportedFormats.length > 0) {
            setTargetFormat(supportedFormats[0]);
        } else {
            setTargetFormat("png");
        }
    }, [supportedFormats]);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            reset();
        }
    };

    const handleSubmit = () => {
        if (selectedFile && targetFormat) {
            handleConvert(selectedFile, targetFormat);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#070d19] text-white font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
            <Header />

            <main className="flex-1 flex items-center justify-center w-full px-4 py-12">
                <div className="w-full max-w-xl bg-[#0d1b2e]/80 backdrop-blur-md border border-[#1a2b42] rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">

                    {/* Título da Seção */}
                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Conversor de Imagens
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 font-light">
                            Converta fotos em alta resolução ou formatos do iOS (HEIC) em memória.
                        </p>
                    </div>

                    {/* Área de Seleção de Arquivo (Drag & Drop Look) */}
                    <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-[#1e324d] hover:border-blue-500/70 bg-[#0a1324]/50 hover:bg-[#0f1c33]/60 rounded-xl p-8 transition-all cursor-pointer text-center">
                        <input
                            type="file"
                            accept="image/*,.heic,.heif"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        <div className="p-3 bg-[#17263d] group-hover:bg-blue-600/20 text-blue-400 rounded-full mb-3 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>

                        {selectedFile ? (
                            <div className="space-y-1 z-0">
                                <p className="text-xs font-semibold text-emerald-400 truncate max-w-xs">
                                    {selectedFile.name}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Clique para trocar
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 z-0">
                                <p className="text-xs md:text-sm font-medium text-slate-200">
                                    Clique ou arraste sua imagem aqui
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500">
                                    Suporta PNG, JPG, WEBP, HEIC e mais
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Opções de Conversão */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">
                            Converter para o formato:
                        </label>
                        <select
                            value={targetFormat}
                            onChange={(e) => setTargetFormat(e.target.value)}
                            className="w-full bg-[#0a1324] text-slate-200 border border-[#1e324d] rounded-lg px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-blue-500 font-mono uppercase transition-colors cursor-pointer"
                        >
                            {supportedFormats && supportedFormats.length > 0 ? (
                                supportedFormats.map((fmt) => (
                                    <option key={fmt} value={fmt} className="bg-[#0a1324] text-slate-200">
                                        {fmt.toUpperCase()}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WEBP</option>
                                    <option value="bmp">BMP</option>
                                </>
                            )}
                        </select>
                    </div>

                    {/* Exibição de Erros da API */}
                    {error && (
                        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 text-xs">
                            {error}
                        </div>
                    )}

                    {/* Botão de Ação */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedFile || loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs md:text-sm rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processando imagem no servidor...
                            </span>
                        ) : (
                            <span>Converter e Baixar</span>
                        )}
                    </button>

                </div>
            </main>

            <Footer />
        </div>
    );
}