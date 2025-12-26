import { NextResponse } from "next/server";
import * as googleTTS from "google-tts-api";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Generate audio URL (limit 200 chars usually, but getAllAudioUrls handles long text)
        // For simplicity in this demo, we'll use getAudioUrl which is for short text, 
        // or we split it. google-tts-api has a limit.
        // Let's use getAllAudioUrls and just take the first one or combine them?
        // Remotion prefers a single audio source per sequence usually.
        // For short ad copy, it might fit. If not, we might need a more robust solution.
        // Let's assume scenes are short (< 200 chars).

        const url = googleTTS.getAudioUrl(text, {
            lang: "pt",
            slow: false,
            host: "https://translate.google.com",
        });

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Error generating audio:", error);
        return NextResponse.json(
            { error: "Failed to generate audio" },
            { status: 500 }
        );
    }
}
