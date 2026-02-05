'use client';

import { useVoiceNavigation } from '@/lib/hooks/useVoiceNavigation';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VoiceControl() {
    const { isSupported, startListening, stopListening, status, transcript, feedback } = useVoiceNavigation();
    const [showFeedback, setShowFeedback] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (status !== 'idle' || feedback) {
            setShowFeedback(true);
        } else {
            const timer = setTimeout(() => setShowFeedback(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [status, feedback]);

    if (!isMounted || !isSupported) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 pointer-events-none">
            {/* Feedback Bubble */}
            <div
                className={`
           transition-all duration-300 ease-in-out transform
           ${showFeedback ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
           bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 max-w-[280px] pointer-events-auto
           border border-gray-100 dark:border-gray-700
         `}
            >
                <div className="flex items-start space-x-3">
                    {status === 'listening' && (
                        <div className="flex space-x-1 items-center h-6">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-150"></div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-300"></div>
                        </div>
                    )}

                    <div className="flex-1 min-h-[24px] flex items-center">
                        {status === 'listening' && !transcript ? (
                            <span className="text-sm text-gray-400 italic">Listening...</span>
                        ) : (
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                                {feedback || transcript}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Mic Button */}
            <button
                onClick={status === 'listening' ? stopListening : startListening}
                className={`
          pointer-events-auto
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${status === 'listening'
                        ? 'bg-red-500 text-white shadow-red-500/30 ring-4 ring-red-100'
                        : status === 'processing'
                            ? 'bg-amber-500 text-white shadow-amber-500/30'
                            : 'bg-green-600 text-white shadow-green-600/30 hover:bg-green-700'
                    }
        `}
                aria-label={status === 'listening' ? 'Stop listening' : 'Start voice navigation'}
            >
                {status === 'processing' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : status === 'listening' ? (
                    <Mic className="w-6 h-6 animate-pulse" />
                ) : (
                    <Mic className="w-6 h-6" />
                )}

                {/* Ripple Effect when listening */}
                {status === 'listening' && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20 duration-1000"></span>
                )}
            </button>
        </div>
    );
}
