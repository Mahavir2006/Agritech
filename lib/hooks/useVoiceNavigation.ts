'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { voiceService } from '@/lib/services/VoiceService';
import { useI18n } from '@/lib/i18n/context';

type VoiceCommandStatus = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export function useVoiceNavigation() {
    const [status, setStatus] = useState<VoiceCommandStatus>('idle');
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const router = useRouter();
    const { locale } = useI18n();

    const handleCommand = useCallback(async (text: string) => {
        setStatus('processing');
        setTranscript(text);

        const normalizedText = text.trim();
        console.log('Voice Command Recognized:', normalizedText);

        // --- AUTH & ROLE CHECK ---
        let userRole: 'farmer' | 'buyer' | 'guest' = 'guest';
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    userRole = parsed.role || 'guest';
                } catch (e) {
                    console.error('Error parsing user data', e);
                }
            }
        }

        try {
            // Call our new LLM-based API
            const res = await fetch('/api/voice-nav', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: normalizedText,
                    userRole: userRole
                })
            });

            if (!res.ok) throw new Error('API Request Failed');

            const data = await res.json();

            // Process the LLM Decision
            if (data.action === 'NAVIGATE' && data.url) {
                setStatus('success');
                setFeedback(data.feedback || 'Navigating...');
                voiceService.speak(data.feedback || 'Opening', locale === 'hi' ? 'hi-IN' : 'en-US');

                console.log(`Voice Navigating to: ${data.url}`);
                router.push(data.url);
            }
            else if (data.action === 'LOGOUT') {
                setStatus('success');
                setFeedback(data.feedback || 'Logging out...');
                voiceService.speak(data.feedback, locale === 'hi' ? 'hi-IN' : 'en-US');

                localStorage.removeItem('user');
                router.push('/login');
            }
            else {
                // UNKNOWN or No Action
                setStatus('error');
                setFeedback(data.feedback || 'Could not understand command');
                voiceService.speak(data.feedback || 'Sorry, I did not understand', locale === 'hi' ? 'hi-IN' : 'en-US');
            }

        } catch (error) {
            console.error('Voice Nav Error:', error);
            setStatus('error');
            setFeedback(locale === 'hi' ? 'संपर्क नहीं हो पाया' : 'Connection failed');
        }

        // Reset status
        setTimeout(() => {
            setStatus('idle');
            setTranscript('');
            setFeedback('');
        }, 4000);

    }, [locale, router]);

    const startListening = useCallback(() => {
        if (!voiceService.isSupported()) {
            alert('Voice navigation is not supported in this browser.');
            return;
        }

        setStatus('listening');
        setTranscript('');
        setFeedback('');

        const lang = locale === 'hi' ? 'hi-IN' : 'en-US';

        voiceService.startListening(
            lang,
            (text) => handleCommand(text),
            (error) => {
                // console.error('Voice error:', error); // Suppressed generic error
                setStatus('error');
                // Don't show "Error" for no-speech, already handled in Service logging.
                // But generally setStatus error is fine for UI feedback.
                setFeedback(locale === 'hi' ? 'कोशिश करें' : 'Try again');
                setTimeout(() => {
                    setStatus('idle');
                    setFeedback('');
                }, 2000);
            },
            () => {
                setStatus(prev => prev === 'listening' ? 'idle' : prev);
            }
        );
    }, [locale, handleCommand]);

    const stopListening = useCallback(() => {
        voiceService.stopListening();
        setStatus('idle');
    }, []);

    return {
        isSupported: voiceService.isSupported(),
        startListening,
        stopListening,
        status,
        transcript,
        feedback
    };
}
