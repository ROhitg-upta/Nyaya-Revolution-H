"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Languages,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Square,
  Volume2,
} from "@/lib/icons";
import { SUPPORTED_CITIZEN_LANGUAGES } from "@/constants/verified-resources";
import { detectAndRedactPII } from "@/lib/sanitization";
import type {
  SupportedCitizenLanguage,
  VoiceRecordingLifecycleState,
  VoiceStoragePreference,
} from "@/types/action-engine";

// Minimal browser SpeechRecognition declaration for TypeScript safety
interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface BrowserSpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const MAX_VOICE_DURATION_SEC = 180; // 3 minutes max

const MULTILINGUAL_SAMPLE_PROMPTS: Array<{
  label: string;
  lang: SupportedCitizenLanguage;
  text: string;
}> = [
  {
    label: "Hinglish: Landlord Deposit",
    lang: "hinglish",
    text: "Mera landlord flat vacate karne ke 2 mahine baad bhi ₹45,000 security deposit wapas nahi de raha aur phone uthana band kar diya hai.",
  },
  {
    label: "Hindi: यूपीआई साइबर धोखाधड़ी",
    lang: "hi",
    text: "मेरे बैंक खाते से बिना मेरी अनुमति के यूपीआई के माध्यम से ₹18,500 कट गए हैं। मुझे तुरंत क्या कदम उठाना चाहिए?",
  },
  {
    label: "Hinglish: Unpaid Salary",
    lang: "hinglish",
    text: "Company ne resignation ke baad pichle 2 mahine ki salary aur relieving letter rok liya hai. HR reply nahi kar raha.",
  },
  {
    label: "English: Defective Online Order",
    lang: "en",
    text: "I received a damaged laptop from an e-commerce platform and customer support rejected my refund request saying the 7-day window expired while their technician delayed inspection.",
  },
];

export interface VoiceSituationInputResult {
  rawTranscript: string;
  editedTranscript: string;
  language: SupportedCitizenLanguage;
  durationSeconds: number;
  storagePreference: VoiceStoragePreference;
  audioBlobUrl: string | null;
}

interface VoiceSituationInputProps {
  initialLanguage?: SupportedCitizenLanguage;
  onTranscriptConfirmed: (result: VoiceSituationInputResult) => void;
  compact?: boolean;
}

export function VoiceSituationInput({
  initialLanguage = "hinglish",
  onTranscriptConfirmed,
  compact = false,
}: VoiceSituationInputProps) {
  const [lifecycleState, setLifecycleState] =
    React.useState<VoiceRecordingLifecycleState>("idle");
  const [selectedLang, setSelectedLang] =
    React.useState<SupportedCitizenLanguage>(initialLanguage);
  const [rawTranscript, setRawTranscript] = React.useState("");
  const [editedTranscript, setEditedTranscript] = React.useState("");
  const [durationSec, setDurationSec] = React.useState(0);
  const [storagePreference, setStoragePreference] =
    React.useState<VoiceStoragePreference>("transcript_only");
  const [audioBlobUrl, setAudioBlobUrl] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const speechRecRef = React.useRef<BrowserSpeechRecognitionInstance | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const piiPreview = React.useMemo(
    () => detectAndRedactPII(editedTranscript),
    [editedTranscript]
  );

  const stopTimersAndStreams = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
      speechRecRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  React.useEffect(() => {
    return () => {
      stopTimersAndStreams();
    };
  }, [stopTimersAndStreams]);

  const startVoiceRecording = async () => {
    setErrorMessage(null);
    setAudioBlobUrl(null);
    setDurationSec(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          setAudioBlobUrl(url);
        }
        setLifecycleState("complete");
      };

      recorder.start(250);
      setLifecycleState("recording");

      // Also start browser SpeechRecognition if available for real-time Indian language transcription
      const win = window as unknown as {
        SpeechRecognition?: new () => BrowserSpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => BrowserSpeechRecognitionInstance;
      };
      const SpeechConstructor =
        win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechConstructor) {
        const recognition = new SpeechConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        const bcpMap: Record<SupportedCitizenLanguage, string> = {
          en: "en-IN",
          hi: "hi-IN",
          hinglish: "en-IN",
          ta: "ta-IN",
          te: "te-IN",
          bn: "bn-IN",
          mr: "mr-IN",
          gu: "gu-IN",
          kn: "kn-IN",
          ml: "ml-IN",
          pa: "pa-IN",
        };
        recognition.lang = bcpMap[selectedLang] || "en-IN";
        recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
          let combined = "";
          for (let i = 0; i < event.results.length; i += 1) {
            combined += `${event.results[i][0].transcript} `;
          }
          const cleaned = combined.trim();
          if (cleaned) {
            setRawTranscript(cleaned);
            setEditedTranscript(cleaned);
          }
        };
        recognition.onerror = () => {
          // Allow MediaRecorder to continue even if browser speech-to-text has a transient hiccup
        };
        recognition.start();
        speechRecRef.current = recognition;
      }

      timerRef.current = setInterval(() => {
        setDurationSec((prev) => {
          if (prev + 1 >= MAX_VOICE_DURATION_SEC) {
            finishVoiceRecording();
            return MAX_VOICE_DURATION_SEC;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setLifecycleState("error");
      setErrorMessage(
        "Microphone access was blocked or is unavailable on this device. You can select one of the instant multilingual voice samples below or type/edit directly in the 'We heard:' box."
      );
    }
  };

  const pauseOrResumeRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (lifecycleState === "recording" && recorder.state === "recording") {
      recorder.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      setLifecycleState("paused");
    } else if (lifecycleState === "paused" && recorder.state === "paused") {
      recorder.resume();
      timerRef.current = setInterval(() => {
        setDurationSec((prev) => Math.min(prev + 1, MAX_VOICE_DURATION_SEC));
      }, 1000);
      setLifecycleState("recording");
    }
  };

  const finishVoiceRecording = () => {
    setLifecycleState("transcribing");
    stopTimersAndStreams();
    setTimeout(() => {
      setLifecycleState("complete");
    }, 350);
  };

  const resetVoiceSession = () => {
    stopTimersAndStreams();
    setRawTranscript("");
    setEditedTranscript("");
    setAudioBlobUrl(null);
    setDurationSec(0);
    setErrorMessage(null);
    setLifecycleState("idle");
  };

  const handleLoadSampleVoice = (sample: {
    label: string;
    lang: SupportedCitizenLanguage;
    text: string;
  }) => {
    setSelectedLang(sample.lang);
    setRawTranscript(sample.text);
    setEditedTranscript(sample.text);
    setDurationSec(14);
    setErrorMessage(null);
    setLifecycleState("complete");
  };

  const handleConfirmAndAnalyze = () => {
    const cleanText = piiPreview.redactedPreview.trim();
    if (!cleanText) return;
    onTranscriptConfirmed({
      rawTranscript: rawTranscript || cleanText,
      editedTranscript: cleanText,
      language: selectedLang,
      durationSeconds: durationSec,
      storagePreference,
      audioBlobUrl:
        storagePreference === "audio_and_transcript" ? audioBlobUrl : null,
    });
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
      {/* Header & Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Mic className="size-5" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Speak in Your Own Words (Voice-First Citizen Input)
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Hindi • Hinglish • Regional • English
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No legal jargon needed. Speak naturally about what happened—you can review and edit every word before proceeding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Languages className="size-4 text-slate-400" aria-hidden />
          <label htmlFor="citizen-voice-lang" className="sr-only">
            Preferred Language
          </label>
          <select
            id="citizen-voice-lang"
            value={selectedLang}
            onChange={(e) =>
              setSelectedLang(e.target.value as SupportedCitizenLanguage)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {SUPPORTED_CITIZEN_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel} ({lang.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Privacy & Sensitive Info Shield Notice */}
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-semibold">Citizen Privacy Guard:</span> Do not speak bank OTPs, PINs, full Aadhaar numbers, or passwords. Phone numbers and ID numbers are automatically masked before analysis.
        </div>
      </div>

      {/* Recording Control Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          {lifecycleState === "idle" || lifecycleState === "error" ? (
            <button
              type="button"
              onClick={startVoiceRecording}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-500"
            >
              <Mic className="size-4" aria-hidden />
              Start Speaking (Up to 3 min)
            </button>
          ) : null}

          {lifecycleState === "recording" || lifecycleState === "paused" ? (
            <>
              <button
                type="button"
                onClick={pauseOrResumeRecording}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {lifecycleState === "recording" ? (
                  <>
                    <Pause className="size-3.5" aria-hidden />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" aria-hidden />
                    Resume
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={finishVoiceRecording}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
              >
                <Square className="size-3.5" aria-hidden />
                Stop & Review Transcript
              </button>
            </>
          ) : null}

          {lifecycleState === "transcribing" ? (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Preparing your transcript for review...
            </div>
          ) : null}

          {lifecycleState === "complete" ? (
            <button
              type="button"
              onClick={resetVoiceSession}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Re-record Voice
            </button>
          ) : null}
        </div>

        {/* Live Status Badge & Timer */}
        <div className="flex items-center gap-3 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
              lifecycleState === "recording"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                : lifecycleState === "paused"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : lifecycleState === "complete"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                lifecycleState === "recording"
                  ? "animate-ping bg-rose-500"
                  : lifecycleState === "complete"
                    ? "bg-emerald-500"
                    : "bg-slate-400"
              }`}
            />
            State: {lifecycleState.toUpperCase()}
          </span>
          <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            {formatSeconds(durationSec)} / 3:00
          </span>
        </div>
      </div>

      {/* Instant Multilingual Demo Samples (for accessibility & no-mic environments) */}
      {!compact && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Or test with a spoken citizen example (Hinglish / Hindi / English):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MULTILINGUAL_SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleLoadSampleVoice(sample)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 transition hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
              >
                <Volume2 className="size-3 text-amber-500" aria-hidden />
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {errorMessage ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <MicOff className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* Optional Audio Playback Preview */}
      {audioBlobUrl ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Recorded Audio Preview:
          </span>
          <audio controls src={audioBlobUrl} className="h-8 max-w-xs" />
        </div>
      ) : null}

      {/* Editable "We heard:" Transcript Verification Box */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="we-heard-transcript-box"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <Edit3 className="size-3.5 text-amber-600" aria-hidden />
            We heard (Review & edit your words in Hindi, Hinglish, or English):
          </label>
          {piiPreview.hasPII ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-3" />
              Auto-redacting: {piiPreview.detectedTypes.join(", ")}
            </span>
          ) : null}
        </div>

        <textarea
          id="we-heard-transcript-box"
          rows={compact ? 3 : 4}
          value={editedTranscript}
          onChange={(e) => {
            setEditedTranscript(e.target.value);
            if (lifecycleState === "idle") {
              setLifecycleState("complete");
            }
          }}
          placeholder="Speak using the microphone above or type in Hinglish / Hindi / English (e.g., 'Mera landlord deposit wapas nahi de raha...')"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-inner focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      {/* Storage Preference Choice & Confirm Action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Voice Privacy Mode:
          </span>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="voice-storage-pref"
              checked={storagePreference === "transcript_only"}
              onChange={() => setStoragePreference("transcript_only")}
              className="accent-amber-600"
            />
            <span>Transcript only (Recommended)</span>
          </label>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="voice-storage-pref"
              checked={storagePreference === "audio_and_transcript"}
              onChange={() => setStoragePreference("audio_and_transcript")}
              className="accent-amber-600"
            />
            <span>Keep private audio + transcript</span>
          </label>
        </div>

        <button
          type="button"
          disabled={editedTranscript.trim().length < 4}
          onClick={handleConfirmAndAnalyze}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
        >
          <CheckCircle2 className="size-4" aria-hidden />
          Confirm Transcript & Understand Situation
          <Sparkles className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
