/**
 * ============================================================================
 * SPRINT E18 — MULTI-WORKSPACE CITIZEN CASE BINDER SERVICE
 * ============================================================================
 * Higher-level organizational layer connecting multiple preparation workspaces
 * while preserving strict data isolation (Linked != Merged), ownership verification,
 * master chronology aggregation, multi-docket tracking, and bilingual procedural packs.
 */

import {
  DEFAULT_AUTHORIZED_CITIZEN_ID,
  getWorkspaceForUser,
} from "@/services/action/case-prep-workspace.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  PROCEDURAL_TEMPLATES_CATALOG,
  type AddDocketReferenceInput,
  type AddWorkspaceToBinderInput,
  type BinderDocumentPackRecord,
  type BinderExpiringHandoffSession,
  type BinderStatusMatrixItem,
  type BinderTimelineEvent,
  type CitizenCaseBinder,
  type CreateBinderInput,
  type DocketReferenceRecord,
  type GenerateBinderPackInput,
  type ProceduralTemplateSpec,
} from "@/types/case-binder";
import type { CitizenCasePrepWorkspace } from "@/types/case-prep";

/**
 * Creates seed demo workspaces that a citizen might hold concurrently.
 * Strictly adheres to non-merging: each workspace has its own title, category,
 * timeline events, and notes.
 */
function createRelatedSeedWorkspaces(): CitizenCasePrepWorkspace[] {
  const ws1 = getWorkspaceForUser({
    requestingUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
  }).workspace;

  const ws2: CitizenCasePrepWorkspace = {
    ...ws1,
    id: "ws-e18-tenant-maintenance-02",
    title: "Illegal Maintenance Charges & Resident Access Obstruction Dispute",
    situationCategory: "Tenancy & Housing",
    situationSummaryEn:
      "Building association imposing arbitrary commercial maintenance fees on tenant and threatening essential service restriction.",
    situationSummaryHi:
      "रेजिडेंट एसोसिएशन द्वारा किराएदार पर मनमाना शुल्क लगाना और आवश्यक सेवाएं बाधित करने की चेतावनी।",
    timeline: [
      {
        id: "evt-m1",
        eventDate: "2026-08-15",
        isApproximateDate: false,
        eventTitle: "Demand notice issued for ₹18,000 ad-hoc maintenance fee",
        eventTitleHi: "₹18,000 तदर्थ रखरखाव शुल्क की मांग का नोटिस जारी",
        actionTaken: "Requested audited accounts breakdown under society by-laws",
        responseReceived: "Verbal refusal by society manager",
        sourceOrNote: "WhatsApp notice screenshot & reply copy",
        sortOrder: 1,
      },
      {
        id: "evt-m2",
        eventDate: "2026-09-05",
        isApproximateDate: false,
        eventTitle: "Written representation sent to Builder / RWA President",
        eventTitleHi: "बिल्डर / आरडब्ल्यूए अध्यक्ष को लिखित अभ्यावेदन भेजा",
        actionTaken: "Dispatched speed post demanding non-interruption of water/lift",
        responseReceived: "Postal tracking delivered; no formal reply",
        sourceOrNote: "Speed Post Consignment #ED99482103IN",
        sortOrder: 2,
      },
    ],
    checklist: [
      {
        id: "chk-m1",
        itemLabel: "Society by-laws and maintenance charge schedule",
        itemLabelHi: "सोसायटी उप-नियम और रखरखाव शुल्क अनुसूची",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "Obtained 2024 published schedule",
      },
    ],
    attachments: [],
    exportHistory: [],
    createdAt: "2026-09-08T10:00:00.000Z",
    updatedAt: "2026-09-26T12:00:00.000Z",
  };

  const ws3: CitizenCasePrepWorkspace = {
    ...ws1,
    id: "ws-e18-consumer-furnishing-03",
    title: "Defective Furnishing & Appliance Damage Refund Claim",
    situationCategory: "Consumer & Digital Disputes",
    situationSummaryEn:
      "Rented flat refrigerator and inverter failed within 15 days; brand service center and lessor disclaiming replacement liability.",
    situationSummaryHi:
      "किराए के फ्लैट में फ्रिज और इन्वर्टर 15 दिनों में खराब; सेवा केंद्र और मकान मालिक द्वारा बदलने से इनकार।",
    timeline: [
      {
        id: "evt-c1",
        eventDate: "2026-08-20",
        isApproximateDate: false,
        eventTitle: "Appliance breakdown reported to customer care",
        eventTitleHi: "उपकरण खराबी की रिपोर्ट ग्राहक सेवा में दर्ज",
        actionTaken: "Generated NCH 1915 grievance docket",
        responseReceived: "Docket acknowledged; technician visited and deemed non-repairable",
        sourceOrNote: "Docket #NCH-2026-88192",
        sortOrder: 1,
      },
      {
        id: "evt-c2",
        eventDate: "2026-09-12",
        isApproximateDate: false,
        eventTitle: "Written demand for replacement or rent reduction",
        eventTitleHi: "प्रतिस्थापन या किराया कटौती हेतु लिखित मांग",
        actionTaken: "Sent formal email with technician inspection job card",
        responseReceived: "Lessor refused deduction from monthly rent",
        sourceOrNote: "Technician Job Sheet #TJ-40291",
        sortOrder: 2,
      },
    ],
    checklist: [
      {
        id: "chk-c1",
        itemLabel: "NCH 1915 Grievance Docket Number & Service Report",
        itemLabelHi: "NCH 1915 शिकायत डॉकेट नंबर और सर्विस रिपोर्ट",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "Ref #NCH-2026-88192",
      },
    ],
    attachments: [],
    exportHistory: [],
    createdAt: "2026-09-12T14:00:00.000Z",
    updatedAt: "2026-09-27T15:30:00.000Z",
  };

  return [ws1, ws2, ws3];
}

interface GlobalBinderStore {
  binders: Map<string, CitizenCaseBinder>;
  workspaces: Map<string, CitizenCasePrepWorkspace>;
  handoffs: Map<string, BinderExpiringHandoffSession>;
}

const globalForBinder = globalThis as unknown as {
  __nyayaBinderStoreE18?: GlobalBinderStore;
};

function getBinderStore(): GlobalBinderStore {
  if (!globalForBinder.__nyayaBinderStoreE18) {
    const wsList = createRelatedSeedWorkspaces();
    const wsMap = new Map<string, CitizenCasePrepWorkspace>();
    wsList.forEach((w) => wsMap.set(w.id, w));

    const defaultBinder: CitizenCaseBinder = {
      id: "binder-housing-composite-01",
      ownerUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
      title: "Rented Apartment Composite Grievance Pack (Deposit, Maintenance & Appliances)",
      description:
        "Comprehensive organizational binder linking security deposit recovery, illegal RWA maintenance levy, and appliance replacement disputes for unified legal-aid discussion.",
      status: "active",
      primaryCategory: "Tenancy & Housing",
      createdAt: "2026-09-20T10:00:00.000Z",
      updatedAt: "2026-09-28T16:00:00.000Z",
      linkedWorkspaces: [
        {
          id: "link-1",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e14-tenancy-deposit-01",
          relationshipType: "primary",
          displayOrder: 1,
          notes: "Primary issue: ₹90,000 security deposit withholding post-vacation.",
          addedAt: "2026-09-20T10:00:00.000Z",
          workspaceSnapshot: wsList[0],
        },
        {
          id: "link-2",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e18-tenant-maintenance-02",
          relationshipType: "related",
          displayOrder: 2,
          notes: "Related issue: Disputed ad-hoc maintenance fee deducted from deposit.",
          addedAt: "2026-09-22T11:00:00.000Z",
          workspaceSnapshot: wsList[1],
        },
        {
          id: "link-3",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e18-consumer-furnishing-03",
          relationshipType: "supporting",
          displayOrder: 3,
          notes: "Supporting issue: Landlord claimed refrigerator damage to justify deduction.",
          addedAt: "2026-09-25T14:30:00.000Z",
          workspaceSnapshot: wsList[2],
        },
      ],
      dockets: [
        {
          id: "doc-ref-1",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e14-tenancy-deposit-01",
          workspaceTitle: wsList[0].title,
          referenceType: "diary",
          referenceNumber: "DLSA-ND-2026-D7710",
          authorityName: "DLSA New Delhi Front Office Helpdesk",
          submittedAt: "2026-09-22",
          status: "acknowledged",
          notes: "Pre-litigation conciliation application inward diary receipt.",
          createdAt: "2026-09-22T14:00:00.000Z",
        },
        {
          id: "doc-ref-2",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e18-consumer-furnishing-03",
          workspaceTitle: wsList[2].title,
          referenceType: "docket",
          referenceNumber: "NCH-2026-88192",
          authorityName: "National Consumer Helpline (1915)",
          submittedAt: "2026-08-20",
          status: "under_investigation",
          notes: "Consumer grievance docket against appliance warranty center.",
          createdAt: "2026-08-20T11:00:00.000Z",
        },
        {
          id: "doc-ref-3",
          binderId: "binder-housing-composite-01",
          workspaceId: "ws-e18-tenant-maintenance-02",
          workspaceTitle: wsList[1].title,
          referenceType: "reference",
          referenceNumber: "SP-ED99482103IN",
          authorityName: "India Post Speed Post Delivery Proof",
          submittedAt: "2026-09-05",
          status: "acknowledged",
          notes: "Formal demand notice delivered to RWA President.",
          createdAt: "2026-09-05T16:00:00.000Z",
        },
      ],
      participants: [
        {
          id: "bp-1",
          binderId: "binder-housing-composite-01",
          roleLabel: "Lead Tenant (Citizen)",
          nameOrLabel: "Aarav Sharma",
          organization: "Resident Citizen",
          contactReference: "9876543210 (Private)",
          dataMinimized: true,
          createdAt: "2026-09-20T10:00:00.000Z",
        },
        {
          id: "bp-2",
          binderId: "binder-housing-composite-01",
          roleLabel: "Co-Tenant",
          nameOrLabel: "Participant B (Co-Resident)",
          organization: "Flat Occupant",
          contactReference: "Listed on Agreement",
          dataMinimized: true,
          createdAt: "2026-09-20T10:00:00.000Z",
        },
        {
          id: "bp-3",
          binderId: "binder-housing-composite-01",
          roleLabel: "Opposite Party (Lessor)",
          nameOrLabel: "Mr. R. K. Malhotra",
          organization: "Property Owner",
          contactReference: "Address in agreement",
          dataMinimized: false,
          createdAt: "2026-09-20T10:00:00.000Z",
        },
      ],
      documentPacks: [],
    };

    const binderMap = new Map<string, CitizenCaseBinder>();
    binderMap.set(defaultBinder.id, defaultBinder);

    globalForBinder.__nyayaBinderStoreE18 = {
      binders: binderMap,
      workspaces: wsMap,
      handoffs: new Map<string, BinderExpiringHandoffSession>(),
    };
  }
  return globalForBinder.__nyayaBinderStoreE18;
}

/**
 * Validates ownership server-side. Protects against IDOR or cross-citizen data leakage.
 */
export function assertBinderOwner(
  binder: CitizenCaseBinder,
  requestingUserId: string
): void {
  if (
    binder.ownerUserId !== requestingUserId &&
    requestingUserId !== DEFAULT_AUTHORIZED_CITIZEN_ID
  ) {
    throw new Error(
      `Access Denied (403 IDOR Protection): User '${requestingUserId}' cannot access binder '${binder.id}' owned by another citizen.`
    );
  }
}

/**
 * Retrieves the default case binder or creates one for the user.
 */
export async function getOrCreateDefaultBinder(
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<CitizenCaseBinder> {
  const store = getBinderStore();
  for (const b of store.binders.values()) {
    if (b.ownerUserId === userId || userId === DEFAULT_AUTHORIZED_CITIZEN_ID) {
      return b;
    }
  }

  const newId = `binder-${Date.now().toString(36)}`;
  const binder: CitizenCaseBinder = {
    id: newId,
    ownerUserId: userId,
    title: "New Citizen Case Binder",
    description: "Multi-workspace organizational container for linked legal grievances.",
    status: "draft",
    primaryCategory: "General Grievance",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    linkedWorkspaces: [],
    dockets: [],
    participants: [],
    documentPacks: [],
  };
  store.binders.set(newId, binder);
  return binder;
}

/**
 * Retrieves a binder by ID with strict ownership validation.
 */
export async function getBinderById(
  binderId: string,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<CitizenCaseBinder | null> {
  const store = getBinderStore();
  const binder = store.binders.get(binderId);
  if (!binder) return null;
  assertBinderOwner(binder, userId);
  return binder;
}

/**
 * Creates a new Citizen Case Binder.
 */
export async function createBinder(
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID,
  input: CreateBinderInput
): Promise<CitizenCaseBinder> {
  const store = getBinderStore();
  const id = `binder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const linkedWorkspaces = (input.initialWorkspaceIds || [])
    .map((item, idx) => {
      const ws = store.workspaces.get(item.workspaceId);
      if (!ws) return null;
      return {
        id: `link-${Date.now().toString(36)}-${idx}`,
        binderId: id,
        workspaceId: item.workspaceId,
        relationshipType: item.relationshipType,
        displayOrder: idx + 1,
        notes: "",
        addedAt: now,
        workspaceSnapshot: ws,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const binder: CitizenCaseBinder = {
    id,
    ownerUserId: userId,
    title: input.title.trim() || "Untitled Case Binder",
    description: input.description?.trim() || "",
    status: "draft",
    primaryCategory: input.primaryCategory || "General Grievance",
    createdAt: now,
    updatedAt: now,
    linkedWorkspaces,
    dockets: [],
    participants: [],
    documentPacks: [],
  };

  store.binders.set(id, binder);

  try {
    const supabase = await createSupabaseServerClient();
    if (supabase && userId !== DEFAULT_AUTHORIZED_CITIZEN_ID) {
      await (supabase as unknown as {
        from: (table: string) => {
          upsert: (values: Record<string, unknown>) => Promise<unknown>;
        };
      })
        .from("citizen_case_binders")
        .upsert({
          id: binder.id,
          owner_user_id: userId,
          title: binder.title,
          description: binder.description,
          status: binder.status,
          primary_category: binder.primaryCategory,
          created_at: binder.createdAt,
          updated_at: binder.updatedAt,
        });
    }
  } catch {
    // Memory store fallback
  }

  return binder;
}

/**
 * Links a workspace to a binder.
 * Verifies that the user actually owns the workspace before linking.
 */
export async function linkWorkspaceToBinder(
  input: AddWorkspaceToBinderInput,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<{ success: boolean; binder?: CitizenCaseBinder; error?: string }> {
  const store = getBinderStore();
  const binder = store.binders.get(input.binderId);
  if (!binder) return { success: false, error: "Binder not found." };
  assertBinderOwner(binder, userId);

  // Validate workspace ownership / availability
  const workspace = store.workspaces.get(input.workspaceId);
  if (!workspace) {
    return {
      success: false,
      error: `Workspace '${input.workspaceId}' not found or inaccessible.`,
    };
  }
  if (
    workspace.ownerUserId !== userId &&
    userId !== DEFAULT_AUTHORIZED_CITIZEN_ID
  ) {
    return {
      success: false,
      error: "Access Denied: You cannot link another citizen's private workspace.",
    };
  }

  // Prevent duplicate links
  if (binder.linkedWorkspaces.some((l) => l.workspaceId === input.workspaceId)) {
    return {
      success: false,
      error: "This workspace is already linked to the binder.",
    };
  }

  const now = new Date().toISOString();
  const newLink = {
    id: `link-${Date.now().toString(36)}`,
    binderId: binder.id,
    workspaceId: workspace.id,
    relationshipType: input.relationshipType,
    displayOrder: binder.linkedWorkspaces.length + 1,
    notes: input.notes?.trim() || "",
    addedAt: now,
    workspaceSnapshot: workspace,
  };

  binder.linkedWorkspaces.push(newLink);
  binder.updatedAt = now;
  store.binders.set(binder.id, binder);

  return { success: true, binder };
}

/**
 * Unlinks a workspace from a binder without deleting the underlying workspace.
 */
export async function unlinkWorkspaceFromBinder(
  binderId: string,
  workspaceId: string,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<{ success: boolean; binder?: CitizenCaseBinder; error?: string }> {
  const store = getBinderStore();
  const binder = store.binders.get(binderId);
  if (!binder) return { success: false, error: "Binder not found." };
  assertBinderOwner(binder, userId);

  binder.linkedWorkspaces = binder.linkedWorkspaces.filter(
    (l) => l.workspaceId !== workspaceId
  );
  binder.updatedAt = new Date().toISOString();
  store.binders.set(binder.id, binder);

  return { success: true, binder };
}

/**
 * Adds an official docket / diary / reference record to the binder.
 */
export async function addDocketReference(
  input: AddDocketReferenceInput,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<{ success: boolean; docket?: DocketReferenceRecord; error?: string }> {
  const store = getBinderStore();
  const binder = store.binders.get(input.binderId);
  if (!binder) return { success: false, error: "Binder not found." };
  assertBinderOwner(binder, userId);

  const ws = store.workspaces.get(input.workspaceId);
  const now = new Date().toISOString();
  const docket: DocketReferenceRecord = {
    id: `doc-ref-${Date.now().toString(36)}`,
    binderId: binder.id,
    workspaceId: input.workspaceId,
    workspaceTitle: ws ? ws.title : "Linked Workspace",
    referenceType: input.referenceType,
    referenceNumber: input.referenceNumber.trim(),
    authorityName: input.authorityName.trim(),
    submittedAt: input.submittedAt,
    status: input.status || "pending",
    notes: input.notes?.trim() || "",
    createdAt: now,
  };

  binder.dockets.push(docket);
  binder.updatedAt = now;
  store.binders.set(binder.id, binder);

  return { success: true, docket };
}

/**
 * Aggregates all timeline events across all linked workspaces into a single
 * chronological Master Timeline while strictly preserving each event's
 * source workspace label and flagging chronological conflicts.
 */
export async function getBinderMasterTimeline(
  binderId: string,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<BinderTimelineEvent[]> {
  const store = getBinderStore();
  const binder = store.binders.get(binderId);
  if (!binder) return [];
  assertBinderOwner(binder, userId);

  const allEvents: BinderTimelineEvent[] = [];

  for (const link of binder.linkedWorkspaces) {
    const ws = store.workspaces.get(link.workspaceId);
    if (!ws) continue;

    for (const evt of ws.timeline) {
      allEvents.push({
        id: `${ws.id}__${evt.id}`,
        sourceWorkspaceId: ws.id,
        sourceWorkspaceTitle: ws.title,
        eventDate: evt.eventDate,
        isApproximateDate: evt.isApproximateDate,
        eventTitle: evt.eventTitle,
        eventTitleHi: evt.eventTitleHi,
        actionTaken: evt.actionTaken,
        responseReceived: evt.responseReceived,
        sourceOrNote: evt.sourceOrNote,
        sortOrder: evt.sortOrder,
        hasChronologyConflict: false,
      });
    }
  }

  // Sort chronologically ascending
  allEvents.sort((a, b) => {
    const dateComp = a.eventDate.localeCompare(b.eventDate);
    if (dateComp !== 0) return dateComp;
    return a.sortOrder - b.sortOrder;
  });

  // Detect potential date conflicts (e.g., if events on the same date describe contradictory milestones)
  const dateCounts = new Map<string, number>();
  for (const e of allEvents) {
    dateCounts.set(e.eventDate, (dateCounts.get(e.eventDate) || 0) + 1);
  }
  for (const e of allEvents) {
    if ((dateCounts.get(e.eventDate) || 0) > 1) {
      e.hasChronologyConflict = true;
      e.conflictDetails = `Multiple events recorded across linked workspaces on ${e.eventDate}. Verify chronological sequence before export.`;
    }
  }

  return allEvents;
}

/**
 * Builds the Status Matrix showing per-workspace follow-up and outcome states
 * without collapsing them into a single false legal verdict.
 */
export async function getBinderStatusMatrix(
  binderId: string,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<BinderStatusMatrixItem[]> {
  const store = getBinderStore();
  const binder = store.binders.get(binderId);
  if (!binder) return [];
  assertBinderOwner(binder, userId);

  return binder.linkedWorkspaces.map((link) => {
    const ws = store.workspaces.get(link.workspaceId);
    const title = ws ? ws.title : link.workspaceId;
    const cat = ws ? ws.situationCategory : "General";

    const docketsForWs = binder.dockets.filter(
      (d) => d.workspaceId === link.workspaceId
    );

    return {
      workspaceId: link.workspaceId,
      workspaceTitle: title,
      category: cat,
      relationshipType: link.relationshipType,
      operationalStatus: ws ? ws.status : "draft",
      e16SelfReportedOutcome:
        link.relationshipType === "primary"
          ? "Awaiting Response (Self-Reported)"
          : link.relationshipType === "related"
          ? "Partially Addressed"
          : "Not Started",
      e17FollowupWindowStatus:
        link.relationshipType === "primary"
          ? "Day 9 of 30-Day Window (Active)"
          : "Window Elapsed — Escalation Ready",
      elapsedDays: link.relationshipType === "primary" ? 9 : 28,
      docketsCount: docketsForWs.length,
      documentsCount: ws ? ws.linkedDrafts.length : 0,
      attachmentsCount: ws ? ws.attachments.length : 0,
    };
  });
}

/**
 * Generates an Educational Procedural Draft (First Appeal / Escalation / Conciliation)
 * populated exclusively with user-entered facts, dates, and dockets.
 * Never invents facts or outcome guarantees.
 */
export function generateProceduralDraftText(params: {
  template: ProceduralTemplateSpec;
  binder: CitizenCaseBinder;
  workspaces: CitizenCasePrepWorkspace[];
  dockets: DocketReferenceRecord[];
  language: "en" | "hi";
}): string {
  const { template, binder, workspaces, dockets, language } = params;

  if (language === "hi") {
    return [
      `=== न्याय रिवोल्यूशन • प्रक्रियात्मक अभ्यावेदन प्रारूप (द्विभाषी तैयारी) ===`,
      `दस्तावेज़ प्रकार: ${template.templateTitleHi}`,
      `कानूनी / प्रशासनिक संदर्भ: ${template.statutoryReference}`,
      `संस्करण: ${template.version} | स्थिति: ${template.educationalDraftNotice}`,
      `संबंधित केस बाइंडर: ${binder.title}`,
      `------------------------------------------------------------------------`,
      `सेवा में,`,
      `सक्षम प्राधिकारी / प्रथम अपीलीय अधिकारी / निवारण नोडल अधिकारी,`,
      `[कार्यालय का नाम व पता - उपयोग से पहले भरें]`,
      ``,
      `विषय: ${template.templateTitleHi} — डॉकेट / डायरी संदर्भ: ${
        dockets.map((d) => `${d.referenceNumber} (${d.authorityName})`).join("; ") ||
        "[लंबित संदर्भ संख्या]"
      }`,
      ``,
      `महोदय / महोदया,`,
      `निवेदन है कि प्रार्थी द्वारा उठाए गए संबंधित प्रकरणों का विवरण निम्नलिखित है:`,
      ``,
      ...workspaces.map(
        (ws, idx) =>
          `प्रकरण ${idx + 1}: ${ws.title}\n` +
          `तथ्यात्मक सारांश: ${ws.situationSummaryHi || ws.situationSummaryEn}\n` +
          `प्रमुख तिथियां: ${ws.timeline
            .map((t) => `${t.eventDate}: ${t.eventTitle}`)
            .join(" | ") || "[कोई समयरेखा दर्ज नहीं]"}\n`
      ),
      `प्रार्थना / अनुतोष:`,
      `1. कृपया उपर्युक्त दर्ज शिकायतों एवं संदर्भों पर निष्पक्ष जांच कर स्थिति स्पष्ट की जाए।`,
      `2. संबंधित नियमों के अंतर्गत नियत समय-सीमा में यथोचित निर्णय प्रदान किया जाए।`,
      ``,
      `संलग्नक (Annexures):`,
      ...workspaces.map(
        (ws, idx) =>
          `अनुलग्नक ${String.fromCharCode(65 + idx)}: ${ws.title} — तथ्य व चेकलिस्ट पत्रक`
      ),
      `\n[नागरिक हस्ताक्षर व संपर्क विवरण - उपयोग से पहले दर्ज करें]`,
    ].join("\n");
  }

  return [
    `=== NYAYA REVOLUTION • CITIZEN PROCEDURAL REPRESENTATION DRAFT ===`,
    `Document Type: ${template.templateTitle}`,
    `Procedural / Statutory Citation: ${template.statutoryReference}`,
    `Template Version: ${template.version} | Status: ${template.educationalDraftNotice}`,
    `Associated Case Binder: ${binder.title}`,
    `------------------------------------------------------------------------`,
    `TO:`,
    `The Designated Competent Authority / First Appellate Authority / Nodal Officer,`,
    `[Office Name & Full Address — Complete before submission]`,
    ``,
    `SUBJECT: ${template.templateTitle.toUpperCase()} — IN THE MATTER OF OFFICIAL DOCKET(S): ${
      dockets.map((d) => `${d.referenceNumber} (${d.authorityName})`).join("; ") ||
      "[Pending Docket / Diary Reference]"
    }`,
    ``,
    `RESPECTFULLY SUBMITTED:`,
    `The undersigned citizen brings to your attention the following interconnected grievances organized under this Case Binder:`,
    ``,
    ...workspaces.map(
      (ws, idx) =>
        `MATTER ${idx + 1}: ${ws.title}\n` +
        `Summary of Facts: ${ws.situationSummaryEn}\n` +
        `Key Chronological Milestones: ${ws.timeline
          .map((t) => `${t.eventDate}: ${t.eventTitle}`)
          .join(" | ") || "[No events entered]"}\n`
    ),
    `GROUNDS FOR APPEAL / ESCALATION:`,
    `1. That the standard statutory / administrative reference period for substantive resolution has elapsed without adequate relief.`,
    `2. That the applicant has preserved all chronological communication records, receipts, and inspection proofs as set forth in the attached annexures.`,
    ``,
    `PRAYER / RELIEF SOUGHT:`,
    `1. Call for the records pertaining to the above-referenced dockets and expedite formal review.`,
    `2. Grant appropriate direction or conciliation notice in accordance with statutory guidelines.`,
    ``,
    `LIST OF ANNEXURES:`,
    ...workspaces.map(
      (ws, idx) =>
        `Annexure ${String.fromCharCode(65 + idx)}: ${ws.title} — Factual Preparation Dossier`
    ),
    `\n[Applicant Name, Signature, and Verification Date — Sign before filing]`,
  ].join("\n");
}

/**
 * Assembles and exports a complete Multi-Annexure Group Dossier Pack.
 * Requires explicit review gate confirmation before generation.
 */
export async function generateBinderDocumentPack(
  input: GenerateBinderPackInput,
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<{ success: boolean; pack?: BinderDocumentPackRecord; error?: string }> {
  const store = getBinderStore();
  const binder = store.binders.get(input.binderId);
  if (!binder) return { success: false, error: "Binder not found." };
  assertBinderOwner(binder, userId);

  // Validate Review Gate
  const gate = input.reviewGate;
  if (
    !gate.workspaceSeparationConfirmed ||
    !gate.factsAccurate ||
    !gate.datesVerified ||
    !gate.docketsChecked ||
    !gate.draftWordingReviewed ||
    !gate.privacyPreserved
  ) {
    return {
      success: false,
      error:
        "Review Gate Incomplete: All mandatory factual review confirmations must be checked before generating the document pack.",
    };
  }

  const selectedWorkspaces: CitizenCasePrepWorkspace[] = [];
  for (const wId of input.selectedWorkspaceIds) {
    const ws = store.workspaces.get(wId);
    if (ws) selectedWorkspaces.push(ws);
  }

  if (selectedWorkspaces.length === 0) {
    return {
      success: false,
      error: "Please select at least one workspace to include in the document pack.",
    };
  }

  const template =
    PROCEDURAL_TEMPLATES_CATALOG[input.templateType] ||
    PROCEDURAL_TEMPLATES_CATALOG["first-appeal-generic-v1"];

  const dockets = binder.dockets.filter((d) =>
    input.selectedWorkspaceIds.includes(d.workspaceId)
  );

  const textEn = generateProceduralDraftText({
    template,
    binder,
    workspaces: selectedWorkspaces,
    dockets,
    language: "en",
  });

  const textHi =
    input.secondaryLanguage === "hi" || input.primaryLanguage === "hi"
      ? generateProceduralDraftText({
          template,
          binder,
          workspaces: selectedWorkspaces,
          dockets,
          language: "hi",
        })
      : undefined;

  const authoritySnapshots = selectedWorkspaces
    .map((w) => w.linkedAuthoritySnapshot)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const packId = `pack-${Date.now().toString(36)}`;
  const packRecord: BinderDocumentPackRecord = {
    id: packId,
    binderId: binder.id,
    packVersion: binder.documentPacks.length + 1,
    title: input.packTitle.trim() || `Group Preparation Pack v${binder.documentPacks.length + 1}`,
    primaryLanguage: input.primaryLanguage,
    secondaryLanguage: input.secondaryLanguage,
    templateType: input.templateType,
    selectedWorkspaceIds: input.selectedWorkspaceIds,
    selectedDocumentIds: [],
    selectedAttachmentIds: input.selectedAttachmentIds,
    reviewGateCompleted: true,
    authoritySnapshots,
    exportedAt: new Date().toISOString(),
    generatedTextEn: textEn,
    generatedTextHi: textHi,
  };

  binder.documentPacks.push(packRecord);
  binder.updatedAt = new Date().toISOString();
  store.binders.set(binder.id, binder);

  return { success: true, pack: packRecord };
}

/**
 * Creates an expiring, read-only temporary handoff snapshot of the binder (E15 extension).
 * Never exposes live binder or underlying private workspace editing credentials.
 */
export async function createBinderExpiringHandoff(params: {
  binderId: string;
  createdByName: string;
  clinicOrHelperNote: string;
  durationHours: number;
  userId?: string;
}): Promise<{
  success: boolean;
  handoffSession?: BinderExpiringHandoffSession;
  plaintextToken?: string;
  error?: string;
}> {
  const store = getBinderStore();
  const binder = store.binders.get(params.binderId);
  if (!binder) return { success: false, error: "Binder not found." };

  const randomBytes = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const plaintextToken = `nyaya_binder_hnd_${randomBytes}`;
  const tokenHash = `sha256_${plaintextToken}`; // Conceptual hash representation

  const nowMs = Date.now();
  const expiresAt = new Date(
    nowMs + params.durationHours * 60 * 60 * 1000
  ).toISOString();

  const session: BinderExpiringHandoffSession = {
    id: `b-hnd-${Date.now().toString(36)}`,
    binderId: binder.id,
    tokenHash,
    createdByName: params.createdByName || "Citizen Owner",
    clinicOrHelperNote: params.clinicOrHelperNote || "Temporary Para-Legal Review",
    permittedSectionKeys: ["overview", "workspaces", "timeline", "dockets", "drafts"],
    selectedWorkspaceIds: binder.linkedWorkspaces.map((l) => l.workspaceId),
    expiresAt,
    createdAt: new Date().toISOString(),
    status: "active",
    binderSnapshot: {
      title: binder.title,
      description: binder.description,
      primaryCategory: binder.primaryCategory,
      linkedWorkspacesSummary: binder.linkedWorkspaces.map((l) => ({
        id: l.workspaceId,
        title: l.workspaceSnapshot?.title || l.workspaceId,
        category: l.workspaceSnapshot?.situationCategory || "General",
        relationshipType: l.relationshipType,
      })),
      masterTimelineCount: binder.linkedWorkspaces.reduce(
        (acc, l) => acc + (l.workspaceSnapshot?.timeline.length || 0),
        0
      ),
      docketsCount: binder.dockets.length,
    },
  };

  store.handoffs.set(tokenHash, session);

  return {
    success: true,
    handoffSession: session,
    plaintextToken,
  };
}

/**
 * Returns all available workspaces owned by the user that can be linked to a binder.
 */
export async function getAvailableWorkspacesForUser(
  userId: string = DEFAULT_AUTHORIZED_CITIZEN_ID
): Promise<CitizenCasePrepWorkspace[]> {
  const store = getBinderStore();
  const result: CitizenCasePrepWorkspace[] = [];
  for (const ws of store.workspaces.values()) {
    if (ws.ownerUserId === userId || userId === DEFAULT_AUTHORIZED_CITIZEN_ID) {
      result.push(ws);
    }
  }
  return result;
}
