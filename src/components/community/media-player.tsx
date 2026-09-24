"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Maximize2,
  Volume2,
  Video as VideoIcon,
  X,
} from "lucide-react";

import { formatBytes } from "@/services/storage/media-storage.service";
import type { StoryMediaAttachment } from "@/types/community";

interface StoryMediaGalleryProps {
  media: StoryMediaAttachment[];
  compact?: boolean;
}

export function StoryMediaGallery({
  media,
  compact = false,
}: StoryMediaGalleryProps) {
  const [lightboxImage, setLightboxImage] =
    useState<StoryMediaAttachment | null>(null);
  const [openTranscriptId, setOpenTranscriptId] = useState<string | null>(null);

  if (!media || media.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
          Citizen Media Evidence & Walkthroughs ({media.length})
        </span>
      </div>

      <div
        className={`grid gap-4 ${
          compact || media.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {media.map((item) => {
          if (item.mediaType === "image") {
            return (
              <figure
                key={item.id}
                className="border-border/70 bg-background/60 overflow-hidden rounded-2xl border"
              >
                <div className="group relative aspect-video w-full overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.altText || item.caption || item.fileName}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxImage(item)}
                    className="bg-background/85 text-foreground hover:bg-background absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition"
                    aria-label="Expand image attachment"
                  >
                    <Maximize2 className="size-3.5" />
                    Inspect Full Image
                  </button>
                  <span className="bg-background/85 text-foreground absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase backdrop-blur-md">
                    <ImageIcon className="text-brand size-3" />
                    Image • {formatBytes(item.fileSizeBytes)}
                  </span>
                </div>
                {item.caption && (
                  <figcaption className="text-muted-foreground p-3.5 text-xs leading-relaxed">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (item.mediaType === "audio") {
            const isTranscriptOpen = openTranscriptId === item.id;
            return (
              <div
                key={item.id}
                className="border-border/70 bg-background/70 flex flex-col justify-between rounded-2xl border p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-brand/10 text-brand inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase">
                      <Volume2 className="size-3.5" />
                      Citizen Voice Note
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {item.durationSeconds
                        ? `${Math.round(item.durationSeconds)}s • `
                        : ""}
                      {formatBytes(item.fileSizeBytes)}
                    </span>
                  </div>

                  {item.caption && (
                    <p className="text-foreground mt-2.5 text-xs font-medium leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  <div className="mt-3">
                    <audio
                      controls
                      preload="metadata"
                      className="w-full"
                      aria-label={item.caption || "Citizen audio voice note"}
                    >
                      <source src={item.url} type={item.mimeType} />
                      Your browser does not support HTML5 audio playback.
                    </audio>
                  </div>
                </div>

                {item.transcript && (
                  <div className="border-border/60 mt-3 border-t pt-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenTranscriptId(isTranscriptOpen ? null : item.id)
                      }
                      className="text-brand inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <FileText className="size-3.5" />
                      {isTranscriptOpen ? "Hide Transcript" : "Read Voice Note Transcript"}
                    </button>
                    {isTranscriptOpen && (
                      <p className="bg-muted/50 text-muted-foreground mt-2 rounded-xl p-3 text-xs leading-relaxed">
                        &ldquo;{item.transcript}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // Video Attachment
          return (
            <figure
              key={item.id}
              className="border-border/70 bg-background/60 overflow-hidden rounded-2xl border"
            >
              <div className="relative aspect-video w-full bg-black">
                <video
                  controls
                  preload="metadata"
                  playsInline
                  poster={item.posterUrl}
                  className="h-full w-full object-contain"
                  aria-label={item.altText || item.caption || "Citizen video walkthrough"}
                >
                  <source src={item.url} type={item.mimeType} />
                  Your browser does not support HTML5 video playback.
                </video>
                <span className="bg-background/85 text-foreground pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase backdrop-blur-md">
                  <VideoIcon className="text-brand size-3" />
                  Video Walkthrough • {formatBytes(item.fileSizeBytes)}
                </span>
              </div>
              {item.caption && (
                <figcaption className="text-muted-foreground p-3.5 text-xs leading-relaxed">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {/* Lightbox Modal for Full Image Inspection */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size citizen image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="bg-background border-border relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
              <span className="text-foreground text-sm font-semibold">
                {lightboxImage.fileName}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="text-muted-foreground hover:text-foreground rounded-full p-1.5 transition"
                aria-label="Close image preview"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[72vh] overflow-auto bg-black/95 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImage.url}
                alt={lightboxImage.altText || lightboxImage.fileName}
                className="mx-auto max-h-[68vh] w-auto object-contain"
              />
            </div>
            {lightboxImage.caption && (
              <div className="text-muted-foreground px-5 py-3.5 text-xs leading-relaxed">
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
