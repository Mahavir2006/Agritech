type VoiceCommandCallback = (text: string) => void;

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

class VoiceService {
    private recognition: any = null;
    private isListening: boolean = false;
    private synthesis: SpeechSynthesis | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const { SpeechRecognition, webkitSpeechRecognition } = window as unknown as IWindow;
            const Recognition = SpeechRecognition || webkitSpeechRecognition;

            if (Recognition) {
                this.recognition = new Recognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
            }

            this.synthesis = window.speechSynthesis;
        }
    }

    startListening(
        lang: string,
        onResult: VoiceCommandCallback,
        onError: (error: string) => void,
        onEnd: () => void
    ) {
        if (!this.recognition) {
            onError('Speech recognition not supported in this browser.');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        }

        try {
            this.recognition.lang = lang;
            this.recognition.onresult = (event: any) => {
                const last = event.results.length - 1;
                const text = event.results[last][0].transcript;
                onResult(text);
            };

            this.recognition.onerror = (event: any) => {
                // Handle specific error cases if needed
                if (event.error === 'no-speech') {
                    // Ignore or handle 'no-speech' differently if desired
                    console.log('VoiceService: No speech detected (timeout).');
                } else {
                    console.error('Speech recognition error', event.error);
                    onError(event.error);
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                onEnd();
            };

            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            console.error('Failed to start recognition:', error);
            onError('Failed to start voice recognition');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    speak(text: string, lang: string = 'en-US') {
        if (!this.synthesis) return;

        // Cancel any pending speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Optional: Select a specific voice if available (e.g., a female voice for better UX)
        const voices = this.synthesis.getVoices();
        // Try to find a voice that matches the language
        const voice = voices.find(v => v.lang.startsWith(lang));
        if (voice) {
            utterance.voice = voice;
        }

        this.synthesis.speak(utterance);
    }

    isSupported(): boolean {
        return !!this.recognition;
    }
}

export const voiceService = new VoiceService();
