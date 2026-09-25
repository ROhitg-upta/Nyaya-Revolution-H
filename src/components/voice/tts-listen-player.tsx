"use client";

import * as React from "react";
import {
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { synthesizeEducationalTtsAction } from "@/actions/citizen-action.actions";
import type { SupportedCitizenLanguage } from "@/types/action-engine";

interface TTSListenPlayerProps {
  text: string;
  language?: SupportedCitizenLanguage;
  label?: string;
  compact?: boolean;
}

const BROWSER_LOCALE_BY_LANG: Record<SupportedCitizenLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  hinglish: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

/**
 * Sprint E12 Phase 6, 7 & 29: Optional Voice Readback (`[▶ Listen]`)
 * Supports Play, Pause, Resume, Stop, Progress bar, Retry, Loading & Unavailable states.
 * Never autoplays; uses Bhashini ULCA TTS when configured with seamless fallback to Browser SpeechSynthesis.
 */
export function TTSListenPlayer({
  text,
  language = "en",
  label = "Listen",
  compact = false,
}: TTSListenPlayerProps) {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "playing" | "paused" | "unavailable" | "error"
  >("idle");
  const [progress, setProgress] = React.useState<number>(0);
  const [activeProviderLabel, setActiveProviderLabel] =
    React.useState<string>("");

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const clearTimers = React.useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const stopPlayback = React.useCallback(() => {
    clearTimers();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setProgress(0);
    setStatus("idle");
  }, [clearTimers]);

  React.useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  const startBrowserSpeechFallback = React.useCallback(
    (cleanText: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setStatus("unavailable");
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLocale = BROWSER_LOCALE_BY_LANG[language] ?? "en-IN";
      utterance.lang = targetLocale;
      utterance.rate = 0.96;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLocale.toLowerCase())
        ) ??
        voices.find((v) => v.lang.toLowerCase().includes("-in")) ??
        null;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      const estimatedDurationMs = Math.max(
        3000,
        Math.min(45000, cleanText.split(/\s+/).length * 360)
      );
      const startedAt = Date.now();

      utterance.onstart = () => {
        setActiveProviderLabel(`Voice Readback (${targetLocale})`);
        setStatus("playing");
        clearTimers();
        progressTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - startedAt;
          setProgress(Math.min(96, Math.round((elapsed / estimatedDurationMs) * 100)));
        }, 250);
      };

      utterance.onend = () => {
        clearTimers();
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          setStatus("idle");
        }, 400);
      };

      utterance.onerror = () => {
        clearTimers();
        setStatus("error");
      };

      window.speechSynthesis.speak(utterance);
    },
    [clearTimers, language]
  );

  const handlePlayOrResume = async () => {
    const cleanText = text.trim().slice(0, 1200);
    if (!cleanText) return;

    if (status === "paused") {
      if (audioRef.current) {
        await audioRef.current.play();
        setStatus("playing");
        return;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.resume();
        setStatus("playing");
        return;
      }
    }

    setStatus("loading");
    setProgress(8);

    try {
      const res = await synthesizeEducationalTtsAction({
        text: cleanText,
        language,
      });

      if (res.ok && res.audioBase64 && !res.fallbackToBrowserTts) {
        const audio = new Audio(`data:${res.mimeType};base64,${res.audioBase64}`);
        audioRef.current = audio;
        setActiveProviderLabel("Bhashini ULCA TTS");

        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            setProgress(Math.round((audio.currentTime / audio.duration) * 100));
          }
        };
        audio.onended = () => {
          setProgress(0);
          setStatus("idle");
        };
        audio.onerror = () => {
          startBrowserSpeechFallback(cleanText);
        };

        await audio.play();
        setStatus("playing");
        return;
      }

      startBrowserSpeechFallback(cleanText);
    } catch {
      startBrowserSpeechFallback(cleanText);
    }
  };

  const handlePause = () => {
    clearTimers();
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  };

  if (status === "unavailable") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900"
        role="status"
      >
        <VolumeX className="size-3.5" aria-hidden />
        Audio readback unavailable in this browser
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-2.5 py-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90 ${
        compact ? "text-[11px]" : "text-xs"
      }`}
      role="region"
      aria-label="Educational voice readback controls"
    >
      {status === "idle" || status === "paused" ? (
        <button
          type="button"
          onClick={handlePlayOrResume}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-amber-600 focus:outline-none dark:text-slate-100 dark:hover:text-amber-400"
          aria-label={status === "paused" ? "Resume voice readback" : `${label} via voice readback`}
        >
          <Play className="size-3.5 fill-current text-amber-600 dark:text-amber-400" />
          <span>{status === "paused" ? "Resume" : label}</span>
        </button>
      ) : status === "loading" ? (
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Preparing voice...</span>
        </span>
      ) : status === "playing" ? (
        <button
          type="button"
          onClick={handlePause}
          className="inline-flex items-center gap-1.5 font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300"
          aria-label="Pause voice readback"
        >
          <Pause className="size-3.5 fill-current" />
          <span>Pause</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePlayOrResume}
          className="inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700"
          aria-label="Retry voice readback"
        >
          <RotateCcw className="size-3.5" />
          <span>Retry Listen</span>
        </button>
      )}

      {(status === "playing" || status === "paused") && (
        <>
          <button
            type="button"
            onClick={stopPlayback}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            aria-label="Stop voice readback"
          >
            <Square className="size-3 fill-current" />
            Stop
          </button>
          <div
            className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-amber-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          {activeProviderLabel && !compact && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
              <Volume2 className="size-3" />
              {activeProviderLabel}
            </span>
          )}
        </>
      )}
    </div>
  );
}
