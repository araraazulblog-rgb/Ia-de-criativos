import { AbsoluteFill, Audio, Img, Sequence, useVideoConfig } from "remotion";

interface Scene {
    id: number;
    duration: number;
    imagePrompt: string;
    voiceover: string;
    overlayText: string;
    imageUrl?: string;
    audioUrl?: string;
}

interface MyCompositionProps {
    scenes: Scene[];
}

export const MyComposition: React.FC<MyCompositionProps> = ({ scenes }) => {
    return (
        <AbsoluteFill className="bg-black">
            {scenes.map((scene, index) => {
                // Calculate start frame based on previous scenes
                // But Sequence handles this if we just chain them? 
                // No, Sequence needs 'from'. But we can use a helper or just calculate.
                // Actually, simpler: use a variable to track current frame.
                // Wait, in React render, we can't easily maintain state like that across map without care.
                // Better: Calculate start frames beforehand or use a reduce.

                const startFrame = scenes
                    .slice(0, index)
                    .reduce((acc, s) => acc + s.duration * 30, 0); // Assuming 30fps

                const durationInFrames = scene.duration * 30;

                return (
                    <Sequence key={scene.id} from={startFrame} durationInFrames={durationInFrames}>
                        <AbsoluteFill>
                            {scene.imageUrl ? (
                                <Img
                                    src={scene.imageUrl}
                                    className="w-full h-full object-cover"
                                    style={{
                                        transform: 'scale(1.1)', // Slight zoom effect could be animated
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                                    No Image
                                </div>
                            )}

                            {/* Overlay Text */}
                            <div className="absolute bottom-20 left-0 w-full text-center px-4">
                                <span className="bg-black/70 text-white text-4xl font-black uppercase px-4 py-2 rounded-lg shadow-xl">
                                    {scene.overlayText}
                                </span>
                            </div>

                            {/* Audio */}
                            {scene.audioUrl && <Audio src={scene.audioUrl} />}
                        </AbsoluteFill>
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
