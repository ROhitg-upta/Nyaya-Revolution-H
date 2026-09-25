import crypto from "crypto";
import {
  assertWorkspaceOwner,
  DEFAULT_AUTHORIZED_CITIZEN_ID,
  getWorkspaceForUser,
  updateWorkspaceSummaryAndLanguages,
} from "@/services/action/case-prep-workspace.service";
import type {
  CasePrepHandoffAuditEvent,
  CasePrepHandoffSession,
  CitizenCasePrepWorkspace,
  FrozenHandoffSnapshot,
  HandoffExpiryDuration,
  HandoffSectionKey,
  HandoffShareScope,
} from "@/types/case-prep";

export const DEMO_INITIAL_OPAQUE_TOKEN =
  "nyh_k9Xz7Qp2Lm8Vw4Rt6Bn1Yc5Jh3Gf0Ds9Ae2Wq8Ui";

export function hashHandoffTokenSha256(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

function generateCryptographicOpaqueToken(): string {
  return `nyh_${crypto.randomBytes(24).toString("base64url")}`;
}

function resolveExpiryDurationMs(duration: HandoffExpiryDuration): number {
  switch (duration) {
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "4h":
      return 4 * 60 * 60 * 1000;
    case "24h":
      return 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
}

interface GlobalHandoffStore {
  snapshots: Map<string, FrozenHandoffSnapshot>;
  sessionsById: Map<string, CasePrepHandoffSession>;
  sessionIdByTokenHash: Map<string, string>;
  events: CasePrepHandoffAuditEvent[];
  invalidAttempts: Map<string, { count: number; windowStartMs: number }>;
}

const globalForHandoff = globalThis as unknown as {
  __nyayaHandoffStoreE15?: GlobalHandoffStore;
};

function createFrozenSnapshotFromWorkspace(
  ws: CitizenCasePrepWorkspace,
  sections: HandoffSectionKey[],
  includedAttachmentIds: string[],
  purpose: string,
  shareLabel: string,
  snapshotVersion: number
): FrozenHandoffSnapshot {
  const secSet = new Set<HandoffSectionKey>(sections);
  const attIdSet = new Set<string>(includedAttachmentIds);

  return {
    id: `snap-handoff-${Date.now().toString(36)}-v${snapshotVersion}`,
    workspaceId: ws.id,
    snapshotVersion,
    workspaceVersionAtShare: ws.exportHistory.length || 1,
    authorityVersionAtShare:
      ws.linkedAuthoritySnapshot?.publishedVersionNumber ?? 1,
    primaryLanguage: ws.primaryLanguage,
    secondaryLanguage: ws.secondaryLanguage,
    selectedSections: [...sections],
    purpose,
    shareLabel,
    createdAt: new Date().toISOString(),
    title: ws.title,
    situationCategory: ws.situationCategory,
    situationSummaryEn: secSet.has("situationSummary")
      ? ws.situationSummaryEn
      : undefined,
    situationSummaryHi: secSet.has("situationSummary")
      ? ws.situationSummaryHi
      : undefined,
    timeline: secSet.has("timeline")
      ? ws.timeline.map((t) => ({ ...t }))
      : undefined,
    checklist: secSet.has("checklist")
      ? ws.checklist.map((c) => ({ ...c }))
      : undefined,
    participants: secSet.has("participants")
      ? ws.participants.map((p) => ({ ...p }))
      : undefined,
    linkedAuthoritySnapshot: secSet.has("verifiedResources")
      ? ws.linkedAuthoritySnapshot
        ? { ...ws.linkedAuthoritySnapshot }
        : null
      : undefined,
    lokAdalatBridge: secSet.has("lokAdalatPreparation")
      ? {
          ...ws.lokAdalatBridge,
          settlementDiscussionPoints: [
            ...ws.lokAdalatBridge.settlementDiscussionPoints,
          ],
          preparationQuestions: [...ws.lokAdalatBridge.preparationQuestions],
        }
      : undefined,
    linkedDrafts: secSet.has("existingDrafts")
      ? ws.linkedDrafts.map((d) => ({
          ...d,
          sourceReferences: [...d.sourceReferences],
        }))
      : undefined,
    questionsToDiscuss: secSet.has("questions")
      ? ws.questionsToDiscuss.filter((q) => q.isIncluded).map((q) => ({ ...q }))
      : undefined,
    userPrivateNotes: secSet.has("notes") ? ws.userPrivateNotes : undefined,
    includedAttachments: ws.attachments
      .filter((a) => attIdSet.has(a.id))
      .map((a) => ({
        id: a.id,
        filename: a.filename,
        mimeType: a.mimeType,
        fileSizeBytes: a.fileSizeBytes,
        description: a.description,
      })),
  };
}

function createInitialHandoffStore(): GlobalHandoffStore {
  const snapshots = new Map<string, FrozenHandoffSnapshot>();
  const sessionsById = new Map<string, CasePrepHandoffSession>();
  const sessionIdByTokenHash = new Map<string, string>();
  const events: CasePrepHandoffAuditEvent[] = [];

  const { workspace } = getWorkspaceForUser({
    requestingUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
  });

  const defaultSections: HandoffSectionKey[] = [
    "situationSummary",
    "timeline",
    "checklist",
    "verifiedResources",
    "lokAdalatPreparation",
    "existingDrafts",
    "questions",
  ];

  const seedSnapshot = createFrozenSnapshotFromWorkspace(
    workspace,
    defaultSections,
    [], // 0 attachments by default (strict opt-in privacy)
    "DLSA Front Office Consultation",
    "Patiala House Court DLSA Desk",
    1
  );
  snapshots.set(seedSnapshot.id, seedSnapshot);

  const tokenHash = hashHandoffTokenSha256(DEMO_INITIAL_OPAQUE_TOKEN);
  const seedSession: CasePrepHandoffSession = {
    id: "handoff-sess-demo-01",
    workspaceId: workspace.id,
    createdByUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
    snapshotId: seedSnapshot.id,
    tokenHash,
    tokenPrefix: `${DEMO_INITIAL_OPAQUE_TOKEN.slice(0, 11)}...`,
    purpose: "DLSA Front Office Consultation",
    shareLabel: "Patiala House Court DLSA Desk",
    expiresAt: new Date(Date.now() + 54 * 60 * 1000).toISOString(),
    revokedAt: null,
    maxAccesses: 25,
    accessCount: 2,
    lastAccessedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    selectedCountsSummary: {
      hasSituationSummary: true,
      timelineCount: workspace.timeline.length,
      checklistCount: workspace.checklist.length,
      participantsCount: 0,
      hasVerifiedAuthority: true,
      attachmentsCount: 0,
      draftsCount: workspace.linkedDrafts.length,
    },
  };

  sessionsById.set(seedSession.id, seedSession);
  sessionIdByTokenHash.set(tokenHash, seedSession.id);

  events.push(
    {
      id: "hevt-2",
      sessionId: seedSession.id,
      workspaceId: workspace.id,
      eventType: "handoff_opened",
      safeSummary:
        "Read-only snapshot viewed via valid temporary token (access #2/25)",
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
      id: "hevt-1",
      sessionId: seedSession.id,
      workspaceId: workspace.id,
      eventType: "handoff_created",
      safeSummary:
        "Created temporary read-only handoff (DLSA Front Office Consultation, 0 attachments shared)",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    }
  );

  return {
    snapshots,
    sessionsById,
    sessionIdByTokenHash,
    events,
    invalidAttempts: new Map(),
  };
}

function getHandoffStore(): GlobalHandoffStore {
  if (!globalForHandoff.__nyayaHandoffStoreE15) {
    globalForHandoff.__nyayaHandoffStoreE15 = createInitialHandoffStore();
  }
  return globalForHandoff.__nyayaHandoffStoreE15;
}

/**
 * Lists active and historical handoff sessions and security audit events for a citizen's workspace.
 */
export function listWorkspaceHandoffs(params: {
  workspaceId: string;
  requestingUserId: string;
}): {
  sessions: CasePrepHandoffSession[];
  events: CasePrepHandoffAuditEvent[];
} {
  const { workspace } = getWorkspaceForUser({
    workspaceId: params.workspaceId,
    requestingUserId: params.requestingUserId,
  });
  assertWorkspaceOwner(workspace, params.requestingUserId);

  const store = getHandoffStore();
  const sessions = Array.from(store.sessionsById.values())
    .filter((s) => s.workspaceId === workspace.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const events = store.events
    .filter((e) => e.workspaceId === workspace.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { sessions, events };
}

/**
 * Creates a frozen, granular read-only handoff snapshot and returns the plaintext opaque token ONCE.
 * Only the SHA-256 token hash is persisted at rest.
 */
export function createHandoff(params: {
  workspaceId: string;
  requestingUserId: string;
  scope: HandoffShareScope;
}): {
  session: CasePrepHandoffSession;
  snapshot: FrozenHandoffSnapshot;
  oneTimeOpaqueToken: string;
  oneTimeSharePath: string;
} {
  const { workspace } = getWorkspaceForUser({
    workspaceId: params.workspaceId,
    requestingUserId: params.requestingUserId,
  });
  assertWorkspaceOwner(workspace, params.requestingUserId);

  const store = getHandoffStore();

  // Enforce max 5 active simultaneous handoffs per workspace (Phase 46)
  const activeForWorkspace = Array.from(store.sessionsById.values()).filter(
    (s) =>
      s.workspaceId === workspace.id &&
      !s.revokedAt &&
      new Date(s.expiresAt).getTime() > Date.now()
  );
  if (activeForWorkspace.length >= 5) {
    throw new Error(
      "Maximum active simultaneous handoffs (5) reached for this workspace. Please revoke an existing link first."
    );
  }

  const rawOpaqueToken = generateCryptographicOpaqueToken();
  const tokenHash = hashHandoffTokenSha256(rawOpaqueToken);
  const nextSnapVer = store.snapshots.size + 1;

  const snapshot = createFrozenSnapshotFromWorkspace(
    workspace,
    params.scope.sections,
    params.scope.includedAttachmentIds,
    params.scope.purpose.trim() || "Assisted Legal Aid Clinic Visit",
    params.scope.shareLabel.trim() || "Para-Legal Volunteer / Helper",
    nextSnapVer
  );
  store.snapshots.set(snapshot.id, snapshot);

  const durationMs = resolveExpiryDurationMs(params.scope.expiryDuration);
  const expiresAtIso = new Date(Date.now() + durationMs).toISOString();

  const session: CasePrepHandoffSession = {
    id: `handoff-sess-${Date.now().toString(36)}`,
    workspaceId: workspace.id,
    createdByUserId: params.requestingUserId,
    snapshotId: snapshot.id,
    tokenHash,
    tokenPrefix: `${rawOpaqueToken.slice(0, 11)}...`,
    purpose: snapshot.purpose,
    shareLabel: snapshot.shareLabel,
    expiresAt: expiresAtIso,
    revokedAt: null,
    maxAccesses: params.scope.maxAccesses ?? 25,
    accessCount: 0,
    lastAccessedAt: null,
    createdAt: new Date().toISOString(),
    selectedCountsSummary: {
      hasSituationSummary: Boolean(snapshot.situationSummaryEn),
      timelineCount: snapshot.timeline?.length ?? 0,
      checklistCount: snapshot.checklist?.length ?? 0,
      participantsCount: snapshot.participants?.length ?? 0,
      hasVerifiedAuthority: Boolean(snapshot.linkedAuthoritySnapshot),
      attachmentsCount: snapshot.includedAttachments.length,
      draftsCount: snapshot.linkedDrafts?.length ?? 0,
    },
  };

  store.sessionsById.set(session.id, session);
  store.sessionIdByTokenHash.set(tokenHash, session.id);

  store.events.unshift({
    id: `hevt-${Date.now().toString(36)}`,
    sessionId: session.id,
    workspaceId: workspace.id,
    eventType: "handoff_created",
    safeSummary: `Created temporary handoff (${session.purpose}, expires ${params.scope.expiryDuration}, ${session.selectedCountsSummary.attachmentsCount} opt-in attachment(s))`,
    createdAt: new Date().toISOString(),
  });

  return {
    session,
    snapshot,
    oneTimeOpaqueToken: rawOpaqueToken,
    oneTimeSharePath: `/handoff/${rawOpaqueToken}`,
  };
}

/**
 * Immediately revokes an active handoff token session so any subsequent helper access fails.
 */
export function revokeHandoff(params: {
  sessionId: string;
  workspaceId: string;
  requestingUserId: string;
}): CasePrepHandoffSession {
  const { workspace } = getWorkspaceForUser({
    workspaceId: params.workspaceId,
    requestingUserId: params.requestingUserId,
  });
  assertWorkspaceOwner(workspace, params.requestingUserId);

  const store = getHandoffStore();
  const session = store.sessionsById.get(params.sessionId);
  if (!session || session.workspaceId !== workspace.id) {
    throw new Error("Handoff session not found.");
  }

  session.revokedAt = new Date().toISOString();
  store.events.unshift({
    id: `hevt-rev-${Date.now().toString(36)}`,
    sessionId: session.id,
    workspaceId: workspace.id,
    eventType: "handoff_revoked",
    safeSummary: `Citizen immediately revoked temporary handoff (${session.tokenPrefix})`,
    createdAt: new Date().toISOString(),
  });

  return session;
}

/**
 * Server-mediated zero-trust validation for `/handoff/[token]` (Phases 11–16 & 43–44).
 * Enforces rate limiting, SHA-256 hash verification, server UTC expiration, and revocation.
 * Never reveals whether a token or workspace once existed on failure.
 */
export function getHandoffSnapshotByOpaqueToken(params: {
  rawToken: string;
  clientKey?: string;
}):
  | {
      ok: true;
      session: Omit<CasePrepHandoffSession, "tokenHash" | "createdByUserId">;
      snapshot: FrozenHandoffSnapshot;
      remainingMinutes: number;
    }
  | {
      ok: false;
      safeErrorMessage: string;
      isRateLimited?: boolean;
    } {
  const store = getHandoffStore();
  const clientKey = params.clientKey || "anonymous-helper-client";

  // Check brute-force rate limit window (max 8 invalid attempts per 10 minutes)
  const nowMs = Date.now();
  const rateRecord = store.invalidAttempts.get(clientKey);
  if (rateRecord) {
    if (nowMs - rateRecord.windowStartMs > 10 * 60 * 1000) {
      store.invalidAttempts.delete(clientKey);
    } else if (rateRecord.count >= 8) {
      return {
        ok: false,
        isRateLimited: true,
        safeErrorMessage:
          "Too many invalid handoff link attempts. Temporary rate limit active. Please ask the citizen to generate a fresh link.",
      };
    }
  }

  const recordInvalidAttempt = () => {
    const cur = store.invalidAttempts.get(clientKey);
    const nextCount = (cur?.count ?? 0) + 1;
    store.invalidAttempts.set(clientKey, {
      count: nextCount,
      windowStartMs: cur?.windowStartMs ?? nowMs,
    });
    store.events.unshift({
      id: `hevt-inv-${Date.now().toString(36)}`,
      workspaceId: "ws-e14-tenancy-deposit-01",
      eventType: nextCount >= 8 ? "rate_limit_triggered" : "invalid_token",
      safeSummary:
        nextCount >= 8
          ? "Rate limit triggered after repeated invalid handoff token requests"
          : "Rejected invalid, expired, or revoked handoff token request (zero information disclosure)",
      createdAt: new Date().toISOString(),
    });
  };

  if (!params.rawToken || !params.rawToken.startsWith("nyh_")) {
    recordInvalidAttempt();
    return {
      ok: false,
      safeErrorMessage:
        "This temporary handoff link is invalid, expired, or has been revoked by the citizen.",
    };
  }

  const candidateHash = hashHandoffTokenSha256(params.rawToken);
  const sessionId = store.sessionIdByTokenHash.get(candidateHash);
  if (!sessionId) {
    recordInvalidAttempt();
    return {
      ok: false,
      safeErrorMessage:
        "This temporary handoff link is invalid, expired, or has been revoked by the citizen.",
    };
  }

  const session = store.sessionsById.get(sessionId);
  if (!session) {
    recordInvalidAttempt();
    return {
      ok: false,
      safeErrorMessage:
        "This temporary handoff link is invalid, expired, or has been revoked by the citizen.",
    };
  }

  // Check revocation and server-side UTC expiration
  const expiresMs = new Date(session.expiresAt).getTime();
  if (
    session.revokedAt !== null ||
    nowMs >= expiresMs ||
    session.accessCount >= session.maxAccesses
  ) {
    if (nowMs >= expiresMs && session.revokedAt === null) {
      store.events.unshift({
        id: `hevt-exp-${Date.now().toString(36)}`,
        sessionId: session.id,
        workspaceId: session.workspaceId,
        eventType: "handoff_expired",
        safeSummary: `Blocked access to expired handoff (${session.tokenPrefix})`,
        createdAt: new Date().toISOString(),
      });
    }
    recordInvalidAttempt();
    return {
      ok: false,
      safeErrorMessage:
        "This temporary handoff link is invalid, expired, or has been revoked by the citizen.",
    };
  }

  const snapshot = store.snapshots.get(session.snapshotId);
  if (!snapshot) {
    return {
      ok: false,
      safeErrorMessage:
        "This temporary handoff link is invalid, expired, or has been revoked by the citizen.",
    };
  }

  session.accessCount += 1;
  session.lastAccessedAt = new Date().toISOString();
  store.events.unshift({
    id: `hevt-open-${Date.now().toString(36)}`,
    sessionId: session.id,
    workspaceId: session.workspaceId,
    eventType: "handoff_opened",
    safeSummary: `Helper opened read-only snapshot (${session.tokenPrefix}, view ${session.accessCount}/${session.maxAccesses})`,
    createdAt: new Date().toISOString(),
  });

  const remainingMinutes = Math.max(
    1,
    Math.ceil((expiresMs - nowMs) / (60 * 1000))
  );

  return {
    ok: true,
    session: {
      id: session.id,
      workspaceId: session.workspaceId,
      snapshotId: session.snapshotId,
      tokenPrefix: session.tokenPrefix,
      purpose: session.purpose,
      shareLabel: session.shareLabel,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
      maxAccesses: session.maxAccesses,
      accessCount: session.accessCount,
      lastAccessedAt: session.lastAccessedAt,
      createdAt: session.createdAt,
      selectedCountsSummary: session.selectedCountsSummary,
    },
    snapshot,
    remainingMinutes,
  };
}

/**
 * Safe Reconnection Sync & Multi-Device Conflict Resolution Engine (Phases 34–39).
 */
export function syncOfflineWorkspaceDraft(params: {
  workspaceId: string;
  requestingUserId: string;
  localDraftTitle: string;
  localDraftSummaryEn: string;
  localDraftNotes: string;
  clientBaseUpdatedAt: string;
  forceConflictSimulation?: boolean;
  resolutionStrategy?: "keep_local" | "keep_server";
}): {
  status: "synced" | "conflict";
  workspace: CitizenCasePrepWorkspace;
  serverTitle: string;
  serverSummaryEn: string;
  serverNotes: string;
} {
  const { workspace } = getWorkspaceForUser({
    workspaceId: params.workspaceId,
    requestingUserId: params.requestingUserId,
  });
  assertWorkspaceOwner(workspace, params.requestingUserId);

  const store = getHandoffStore();
  const hasDiverged =
    params.forceConflictSimulation ||
    (params.clientBaseUpdatedAt !== workspace.updatedAt &&
      !params.resolutionStrategy);

  if (hasDiverged && !params.resolutionStrategy) {
    store.events.unshift({
      id: `hevt-sync-conf-${Date.now().toString(36)}`,
      workspaceId: workspace.id,
      eventType: "sync_conflict",
      safeSummary:
        "Detected offline draft divergence against newer server version; awaiting user resolution (Keep Local vs Keep Server)",
      createdAt: new Date().toISOString(),
    });
    return {
      status: "conflict",
      workspace,
      serverTitle: workspace.title,
      serverSummaryEn: workspace.situationSummaryEn,
      serverNotes: workspace.userPrivateNotes,
    };
  }

  if (params.resolutionStrategy === "keep_server") {
    store.events.unshift({
      id: `hevt-sync-srv-${Date.now().toString(36)}`,
      workspaceId: workspace.id,
      eventType: "sync_success",
      safeSummary:
        "Resolved multi-device sync conflict by keeping authoritative server workspace version",
      createdAt: new Date().toISOString(),
    });
    return {
      status: "synced",
      workspace,
      serverTitle: workspace.title,
      serverSummaryEn: workspace.situationSummaryEn,
      serverNotes: workspace.userPrivateNotes,
    };
  }

  // Apply local draft changes cleanly
  const updated = updateWorkspaceSummaryAndLanguages({
    workspaceId: workspace.id,
    requestingUserId: params.requestingUserId,
    title: params.localDraftTitle,
    situationCategory: workspace.situationCategory,
    situationSummaryEn: params.localDraftSummaryEn,
    userDescriptionEn: workspace.userDescriptionEn,
    primaryLanguage: workspace.primaryLanguage,
    secondaryLanguage: workspace.secondaryLanguage,
    userPrivateNotes: params.localDraftNotes,
  });

  store.events.unshift({
    id: `hevt-sync-ok-${Date.now().toString(36)}`,
    workspaceId: workspace.id,
    eventType: "sync_success",
    safeSummary:
      "Synchronized local offline draft changes to verified server workspace",
    createdAt: new Date().toISOString(),
  });

  return {
    status: "synced",
    workspace: updated,
    serverTitle: updated.title,
    serverSummaryEn: updated.situationSummaryEn,
    serverNotes: updated.userPrivateNotes,
  };
}
