import { useState, ChangeEvent, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useImageConversion } from "../hooks/useImageConversion";

export function ConversionPage() {
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
        <div className="bg-slate-950 text-slate-100 flex flex-col min-h-screen w-full relative overflow-hidden select-none">

            {/* Esferas de luz no fundo para efeito de iluminação */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <Header />

            {/* Hero Header explicativo com o estilo de título da Home */}
            <section className="text-center pt-8 pb-2 px-4 z-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-300">
                    Conversor de Imagens
                </h1>
                <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                    Converta fotos em alta resolução ou formatos do iOS (HEIC) em memória de forma simples e rápida.
                </p>
            </section>

            <main className="flex-1 flex items-center justify-center w-full px-4 py-8 relative z-10">
                <div className="relative group w-full max-w-xl my-2">

                    {/* Efeito Glow neon atrás do card central */}
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500 pointer-events-none" />

                    {/* Card Container com vidro fosco e bordas do padrão da Home */}
                    <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">

                        {/* Área de Seleção de Arquivo */}
                        <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 bg-slate-900/80 hover:bg-slate-900 rounded-xl p-8 transition-all cursor-pointer text-center shadow-inner">
                            <input
                                type="file"
                                accept="image/*,.heic,.heif"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            <div className="p-3 bg-slate-800/80 group-hover:bg-blue-600/20 text-blue-400 rounded-full mb-3 transition-colors">
                                <svg
                                    className="w-8 h-8 shrink-0 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
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
                                    <p className="text-xs md:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                                        Clique ou arraste sua imagem aqui
                                    </p>
                                    <p className="text-[10px] md:text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
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
                                className="w-full bg-slate-900/90 text-slate-200 border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs md:text-sm focus:outline-none focus:border-blue-500 font-mono uppercase transition-colors cursor-pointer"
                            >
                                {supportedFormats && supportedFormats.length > 0 ? (
                                    supportedFormats.map((fmt) => (
                                        <option key={fmt} value={fmt} className="bg-slate-900 text-slate-200">
                                            {fmt.toUpperCase()}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="png" className="bg-slate-900 text-slate-200">PNG</option>
                                        <option value="jpeg" className="bg-slate-900 text-slate-200">JPEG</option>
                                        <option value="webp" className="bg-slate-900 text-slate-200">WEBP</option>
                                        <option value="bmp" className="bg-slate-900 text-slate-200">BMP</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Exibição de Erros da API */}
                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        {/* Botão de Ação (Com gradiente e sombra neon da Home) */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedFile || loading}
                            className={`w-full cursor-pointer py-3.5 px-8 rounded-xl font-extrabold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg ${!selectedFile || loading
                                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                                : 'bg-linear-to-r from-blue-600 via-cyan-500 to-blue-600 bg-size-[200%_auto] text-white shadow-blue-500/25 hover:shadow-cyan-500/40 hover:bg-position-[right_center] active:scale-95 hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-cyan-300" viewBox="0 0 24 24" fill="none">
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
                </div>
            </main>

            <Footer />
        </div>
    );
}