"use client";

import { useState } from "react";
import { Loader2, Play, Video, Wand2, Image as ImageIcon, Music } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

interface Scene {
    id: number;
    duration: number;
    imagePrompt: string;
    voiceover: string;
    overlayText: string;
    imageUrl?: string;
    audioUrl?: string;
}

interface Script {
    title: string;
    scenes: Scene[];
}

export default function ScriptGenerator() {
    const [loading, setLoading] = useState(false);
    const [generatingAssets, setGeneratingAssets] = useState(false);
    const [script, setScript] = useState<Script | null>(null);
    const [formData, setFormData] = useState({
        product: "",
        description: "",
        targetAudience: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setScript(null);
        try {
            const res = await fetch("/api/generate-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setScript(data);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar roteiro. Verifique sua chave de API.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAssets = async () => {
        if (!script) return;
        setGeneratingAssets(true);

        try {
            const updatedScenes = await Promise.all(
                script.scenes.map(async (scene) => {
                    // Generate Image URL (Pollinations.ai)
                    const encodedPrompt = encodeURIComponent(scene.imagePrompt);
                    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true`;

                    // Generate Audio URL (Google TTS)
                    let audioUrl = "";
                    try {
                        const audioRes = await fetch("/api/generate-audio", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: scene.voiceover }),
                        });
                        const audioData = await audioRes.json();
                        if (audioData.url) audioUrl = audioData.url;
                    } catch (e) {
                        console.error("Audio generation failed for scene", scene.id, e);
                    }

                    return { ...scene, imageUrl, audioUrl };
                })
            );

            setScript({ ...script, scenes: updatedScenes });
        } catch (error) {
            console.error("Error generating assets:", error);
            alert("Erro ao gerar imagens/áudio.");
        } finally {
            setGeneratingAssets(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Video className="w-6 h-6 text-blue-600" />
                    Gerador de Criativos
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            placeholder="Ex: Tênis de Corrida Ultra"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                            required
                            className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ex: Tênis leve, confortável, ideal para maratonas..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Público Alvo</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            placeholder="Ex: Corredores iniciantes e profissionais"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Gerando Roteiro...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                Gerar Roteiro Mágico
                            </>
                        )}
                    </button>
                </form>
            </div>

            {script && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-green-600">Roteiro: {script.title}</h3>
                        {!script.scenes[0].imageUrl && (
                            <button
                                onClick={handleGenerateAssets}
                                disabled={generatingAssets}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"
                            >
                                {generatingAssets ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                                Gerar Imagens e Áudio
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {script.scenes.map((scene, index) => (
                            <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm uppercase text-zinc-500">Cena {index + 1}</span>
                                    <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">{scene.duration}s</span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-500 mb-1">IMAGEM</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 italic mb-2">{scene.imagePrompt}</p>
                                        {scene.imageUrl && (
                                            <img src={scene.imageUrl} alt="Scene preview" className="w-full h-32 object-cover rounded-md border border-zinc-300" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-purple-500 mb-1">NARRAÇÃO</p>
                                        <p className="text-sm text-zinc-800 dark:text-zinc-100 mb-2">{scene.voiceover}</p>
                                        {scene.audioUrl && (
                                            <audio controls src={scene.audioUrl} className="w-full h-8" />
                                        )}
                                    </div>
                                </div>

                                {scene.overlayText && (
                                    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                                        <p className="text-xs font-semibold text-orange-500 mb-1">TEXTO NA TELA</p>
                                        <p className="text-lg font-black font-sans uppercase tracking-wide text-white bg-black/80 inline-block px-2 py-1 rounded">
                                            {scene.overlayText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {script.scenes[0].imageUrl && (
                        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-700 pt-8">
                            <h3 className="text-2xl font-bold mb-6 text-center text-blue-600 flex items-center justify-center gap-2">
                                <Video className="w-8 h-8" />
                                Seu Vídeo Está Pronto!
                            </h3>
                            <div className="flex justify-center bg-black/5 rounded-xl p-4">
                                <div className="w-[360px] h-[640px] shadow-2xl rounded-lg overflow-hidden ring-4 ring-zinc-900/10">
                                    <VideoPlayer scenes={script.scenes} />
                                </div>
                            </div>
                            <p className="text-center text-sm text-zinc-500 mt-4">
                                *O vídeo é gerado em tempo real no seu navegador.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
