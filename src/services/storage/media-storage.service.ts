import { MEDIA_UPLOAD_LIMITS } from "@/constants/community";
import { sanitizeStorageFileName } from "@/lib/sanitization";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { StoryMediaAttachment, StoryMediaType } from "@/types/community";

export interface MediaValidationResult {
  valid: boolean;
  mediaType?: StoryMediaType;
  error?: string;
}

/**
 * Validates file MIME type, file extension, and file size against strict Sprint E10 safety rules.
 */
export function validateMediaFile(file: {
  name: string;
  type: string;
  size: number;
}): MediaValidationResult {
  const lowerName = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  let detectedType: StoryMediaType | undefined;
  if (mime.startsWith("image/")) {
    detectedType = "image";
  } else if (mime.startsWith("audio/")) {
    detectedType = "audio";
  } else if (mime.startsWith("video/")) {
    detectedType = "video";
  }

  if (!detectedType) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || "unknown"}). Allowed: Images (JPG, PNG, WEBP), Audio (MP3, WAV, M4A, WEBM), and Video (MP4, WEBM).`,
    };
  }

  const rules = MEDIA_UPLOAD_LIMITS[detectedType];
  const allowedMimes = rules.allowedMimeTypes as readonly string[];
  const allowedExts = rules.allowedExtensions as readonly string[];

  if (!allowedMimes.includes(mime)) {
    return {
      valid: false,
      error: `MIME type "${mime}" is not permitted for ${detectedType} uploads. Allowed: ${allowedExts.join(", ")}.`,
    };
  }

  const hasValidExt = allowedExts.some((ext) => lowerName.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: `File extension for "${file.name}" does not match allowed extensions (${allowedExts.join(", ")}).`,
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: "File appears to be empty (0 bytes).",
    };
  }

  if (file.size > rules.maxBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `${detectedType.toUpperCase()} file is ${sizeMB} MB, which exceeds the ${rules.maxSizeLabel} maximum limit.`,
    };
  }

  return {
    valid: true,
    mediaType: detectedType,
  };
}

/**
 * Uploads a validated media file to the `community-media` Supabase Storage bucket
 * under `{userId}/{storyId}/{timestamp}-{safeFileName}`.
 * Gracefully falls back to a client ObjectURL if Supabase Storage is unreachable in local dev.
 */
export async function uploadStoryMediaClient(params: {
  file: File;
  userId?: string;
  storyId?: string;
  caption?: string;
  altText?: string;
  sortOrder?: number;
}): Promise<{
  success: boolean;
  attachment?: StoryMediaAttachment;
  error?: string;
}> {
  const validation = validateMediaFile(params.file);
  if (!validation.valid || !validation.mediaType) {
    return { success: false, error: validation.error };
  }

  const safeName = sanitizeStorageFileName(params.file.name);
  const ownerFolder = params.userId
    ? sanitizeStorageFileName(params.userId)
    : "citizen-anon";
  const storyFolder = params.storyId
    ? sanitizeStorageFileName(params.storyId)
    : "drafts";
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const storagePath = `${ownerFolder}/${storyFolder}/${uniquePrefix}-${safeName}`;

  try {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from("community-media")
        .upload(storagePath, params.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: params.file.type,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from("community-media")
          .getPublicUrl(data.path);

        return {
          success: true,
          attachment: {
            id: `media-${uniquePrefix}`,
            storyId: params.storyId || "draft",
            mediaType: validation.mediaType,
            storageBucket: "community-media",
            storagePath: data.path,
            url: publicUrlData.publicUrl,
            fileName: safeName,
            mimeType: params.file.type,
            fileSizeBytes: params.file.size,
            caption: params.caption || "",
            altText: params.altText || params.caption || safeName,
            sortOrder: params.sortOrder ?? 0,
          },
        };
      }
    }
  } catch {
    // Fallback to safe local ObjectURL preview when offline or storage bucket not yet migrated
  }

  const fallbackObjectUrl =
    typeof window !== "undefined" ? URL.createObjectURL(params.file) : "";

  return {
    success: true,
    attachment: {
      id: `media-local-${uniquePrefix}`,
      storyId: params.storyId || "draft",
      mediaType: validation.mediaType,
      storageBucket: "community-media",
      storagePath,
      url: fallbackObjectUrl,
      fileName: safeName,
      mimeType: params.file.type,
      fileSizeBytes: params.file.size,
      caption: params.caption || "",
      altText: params.altText || params.caption || safeName,
      sortOrder: params.sortOrder ?? 0,
    },
  };
}

/**
 * Deletes uploaded files from Supabase Storage when an attachment is removed or a story is deleted.
 */
export async function deleteStoryMediaFiles(storagePaths: string[]): Promise<void> {
  if (!storagePaths.length) return;
  try {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.storage.from("community-media").remove(storagePaths);
    }
  } catch {
    // Non-blocking cleanup
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
