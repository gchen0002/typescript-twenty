import { SAMPLE_TEXTS } from "./constants";

export function getRandomText(): string {
    return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

export async function fetchRandomQuote(): Promise<string> {
    try {
        const response = await fetch(
            'https://motivational-spark-api.vercel.app/api/quotes/random'
        );
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        return data.quote;
    } catch {
        return getRandomText();
    }
}
