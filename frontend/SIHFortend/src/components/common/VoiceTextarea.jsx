import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { Mic, MicOff, Square, AlertCircle, Globe } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Combines existing base text with new addition ensuring single space separator
 */
function appendWithSpacing(base, addition) {
  const cleanBase = base != null ? String(base).trimEnd() : '';
  const cleanAddition = addition != null ? String(addition).trim() : '';

  if (!cleanBase) return cleanAddition;
  if (!cleanAddition) return cleanBase;
  return `${cleanBase} ${cleanAddition}`;
}

export const VoiceTextarea = forwardRef(({
  id = 'voice-textarea',
  label,
  value = '',
  onChange,
  placeholder,
  rows = 4,
  className,
  disabled = false,
  error,
  ...props
}, ref) => {
  const { speechLanguage, currentLanguageMeta, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const isSupported = typeof window !== 'undefined'
    ? Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
    : false;

  // References to maintain transcript streams across events without duplication
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const sessionFinalRef = useRef('');
  const isStoppingManuallyRef = useRef(false);

  const displayLabel = label !== undefined ? label : t('healthCheck.describeLabel', 'Describe what is happening (Optional)');
  const displayPlaceholder = placeholder !== undefined ? placeholder : t('healthCheck.describePlaceholder', "Describe your animal's behaviour, specific symptoms, and recent observations...");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    isStoppingManuallyRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore if already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript('');

    // Commit final accumulated speech into the state
    const finalResult = appendWithSpacing(baseTextRef.current, sessionFinalRef.current);
    if (onChange && finalResult !== value) {
      onChange(finalResult);
    }
  }, [onChange, value]);

  // If global speech language changes while listening, safely stop active session
  useEffect(() => {
    if (isListening) {
      stopListening();
    }
  }, [speechLanguage]);

  const startListening = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
      : null;

    if (!SpeechRecognition) {
      setErrorMessage(t('voice.unsupportedNote', 'Voice input is not supported in this browser. Please type your message.'));
      return;
    }

    setErrorMessage('');
    setInterimTranscript('');
    isStoppingManuallyRef.current = false;
    baseTextRef.current = value || '';
    sessionFinalRef.current = '';

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Global language selection automatically determines speech recognition language:
      // English -> en-IN, Marathi -> mr-IN, Hindi -> hi-IN
      recognition.lang = speechLanguage;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let accumulatedFinal = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';
          if (result.isFinal) {
            accumulatedFinal = appendWithSpacing(accumulatedFinal, transcript);
          } else {
            currentInterim = appendWithSpacing(currentInterim, transcript);
          }
        }

        sessionFinalRef.current = accumulatedFinal;
        setInterimTranscript(currentInterim);

        // Combine base with finalized session speech and interim preview
        const combinedCommitted = appendWithSpacing(baseTextRef.current, accumulatedFinal);
        const fullDisplay = currentInterim
          ? appendWithSpacing(combinedCommitted, currentInterim)
          : combinedCommitted;

        if (onChange) {
          onChange(fullDisplay);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'aborted' && isStoppingManuallyRef.current) {
          return;
        }

        let userMsg = '';
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            userMsg = t('voice.micPermissionRequired', 'Microphone permission is required. Please allow microphone access in your browser.');
            break;
          case 'no-speech':
            userMsg = t('voice.noSpeechDetected', 'Could not understand the speech. Please try speaking again.');
            break;
          case 'audio-capture':
            userMsg = t('voice.micBusyOrMissing', 'No microphone was found or microphone is busy.');
            break;
          case 'network':
            userMsg = t('voice.networkError', 'Network error during speech recognition. Please check your internet connection.');
            break;
          case 'aborted':
            userMsg = '';
            break;
          default:
            userMsg = t('voice.noSpeechDetected', 'Could not understand the speech. Please try again.');
            break;
        }

        if (userMsg) {
          setErrorMessage(userMsg);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');

        // Ensure final recognized text is permanently preserved without interim leftovers
        const finalCommitted = appendWithSpacing(baseTextRef.current, sessionFinalRef.current);
        if (onChange && finalCommitted !== value) {
          onChange(finalCommitted);
        }
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setErrorMessage(t('voice.micBusyOrMissing', 'Could not access microphone. Please try again.'));
      setIsListening(false);
      setInterimTranscript('');
    }
  }, [onChange, speechLanguage, value, t]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextareaChange = (e) => {
    if (isListening) {
      // If user types directly while listening, synchronize base text
      baseTextRef.current = e.target.value;
      sessionFinalRef.current = '';
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {displayLabel}
        </label>
        {isListening && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {t('voice.listening', 'Listening')} ({currentLanguageMeta?.nativeName})...
          </span>
        )}
      </div>

      <div className={cn(
        "relative rounded-md border border-slate-300 bg-white transition-all focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent",
        isListening && "border-red-400 ring-1 ring-red-400",
        error && "border-critical-500 focus-within:ring-critical-500",
        className
      )}>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={handleTextareaChange}
          placeholder={displayPlaceholder}
          rows={rows}
          disabled={disabled}
          className="w-full rounded-t-md p-3 text-sm focus:outline-none resize-y border-0 placeholder:text-slate-400 text-slate-900 bg-transparent"
          {...props}
        />

        {/* Action Toolbar inside the textarea card */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-t border-slate-100 bg-slate-50/80 rounded-b-md">
          {/* Active Global Language Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium min-w-0">
            <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{t('voice.language', 'Language:')}</span>
            <span className="font-semibold text-slate-700">{currentLanguageMeta?.nativeName}</span>
          </div>

          {/* Microphone Speak / Stop Button */}
          <div className="flex items-center gap-2">
            {isSupported ? (
              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                aria-label={isListening ? t('voice.stopInputAria', 'Stop voice input') : t('voice.startInputAria', 'Start voice input')}
                title={isListening ? t('voice.stopInputAria', 'Stop voice input') : t('voice.startInputAria', 'Start voice input')}
                aria-pressed={isListening}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer",
                  isListening
                    ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-red-600"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 border border-emerald-600"
                )}
              >
                {isListening ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current text-white shrink-0" />
                    <span>{t('voice.stop', 'Stop')}</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5 text-white shrink-0" />
                    <span>{t('voice.speak', 'Speak')}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                aria-label={t('voice.unsupportedNote', 'Voice input not supported in this browser')}
                title={t('voice.unsupportedNote', 'Voice input is not supported in this browser. Please type your message.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              >
                <MicOff className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{t('voice.speak', 'Speak')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Interim Speech Preview */}
      {isListening && interimTranscript && (
        <div className="mt-1.5 text-xs text-slate-600 flex items-center gap-1.5 italic">
          <span className="font-semibold text-emerald-600 not-italic">{t('voice.hearing', 'Hearing:')}</span>
          <span>"{interimTranscript}"</span>
        </div>
      )}

      {/* Friendly Error Message */}
      {errorMessage && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-amber-600 hover:text-amber-900 font-bold ml-2 text-sm leading-none cursor-pointer"
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      {/* Fallback Note if Browser Has No Speech Support */}
      {!isSupported && (
        <p className="mt-1.5 text-xs text-slate-500">
          {t('voice.unsupportedNote', 'Voice input is not supported in this browser. Please type your message.')}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-critical-600">{error}</p>
      )}
    </div>
  );
});

VoiceTextarea.displayName = "VoiceTextarea";
