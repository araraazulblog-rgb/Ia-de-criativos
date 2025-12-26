"use client";

import { Player } from "@remotion/player";
import { MyComposition } from "../remotion/Composition";

interface Scene {
    id: number;
    duration: number;
    imagePrompt: string;
    voiceover: string;
    overlayText: string;
    imageUrl?: string;
    audioUrl?: string;
}

interface VideoPlayerProps {
    scenes: Scene[];
}

export default function VideoPlayer({ scenes }: VideoPlayerProps) {
    // Calculate total duration
    const durationInFrames = scenes.reduce((acc, s) => acc + s.duration * 30, 0);

    return (
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
            <Player
                component={MyComposition}
                inputProps={{ scenes }}
                durationInFrames={durationInFrames || 1} // Avoid 0 duration
                compositionWidth={1080}
                compositionHeight={1920} // Vertical video (Shorts/Reels)
                fps={30}
                style={{
                    width: "1080px", // Scale down for preview
                    height: "1920px",
                }}
                controls
                autoPlay
                loop
                className="w-full h-full"
            />
        </div>
    );
}
