import { useState, useRef, useEffect, useCallback } from 'react';

interface UseSpeechReturn {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setIsSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) setTranscript((prev) => prev + final + ' ');
      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      isRecordingRef.current = false;
    };
    recognition.onend = () => {
      if (isRecordingRef.current) {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };
    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setIsRecording(true);
    isRecordingRef.current = true;
    try { recognitionRef.current?.start(); } catch { /* ignore */ }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    isRecordingRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return { isRecording, transcript, interimTranscript, startRecording, stopRecording, resetTranscript, isSupported };
}
