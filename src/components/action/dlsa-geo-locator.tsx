"use client";

import * as React from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Compass,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { findLocalDlsaAuthoritiesAction } from "@/actions/citizen-action.actions";
import { TTSListenPlayer } from "@/components/voice/tts-listen-player";
import {
  findRankedDlsaAuthorities,
  getVerifiedDirectoryStatesAndDistricts,
} from "@/services/dlsa/dlsa-locator.service";
import type {
  PincodeJurisdictionResult,
  RankedDlsaAuthority,
  SupportedCitizenLanguage,
} from "@/types/action-engine";

interface DLSAGeoLocatorProps {
  initialState?: string;
  initialIssueCategory?: string;
  language?: SupportedCitizenLanguage;
  onPrepareBriefForAuthority?: (authority: RankedDlsaAuthority) => void;
}

const { states: VERIFIED_STATES, districtsByState: DISTRICTS_BY_STATE } =
  getVerifiedDirectoryStatesAndDistricts();

export function DLSAGeoLocator({
  initialState = "All India",
  initialIssueCategory = "All",
  language = "en",
  onPrepareBriefForAuthority,
}: DLSAGeoLocatorProps) {
  const [selectedState, setSelectedState] =
    React.useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");
  const [pincodeInput, setPincodeInput] = React.useState<string>("");
  const issueCategory = initialIssueCategory;

  const [isSearching, setIsSearching] = React.useState(false);
  const [geoStatus, setGeoStatus] = React.useState<
    "idle" | "requesting" | "resolved" | "denied" | "unsupported"
  >("idle");
  const [privacyNote, setPrivacyNote] = React.useState<string | null>(null);

  const initialLookup = React.useMemo(
    () =>
      findRankedDlsaAuthorities({
        state: initialState,
        issueCategory: initialIssueCategory,
        language,
      }),
    [initialState, initialIssueCategory, language]
  );

  const [authorities, setAuthorities] = React.useState<RankedDlsaAuthority[]>(
    initialLookup.authorities
  );
  const [pincodeResolution, setPincodeResolution] =
    React.useState<PincodeJurisdictionResult | null>(null);
  const [derivedJurisdiction, setDerivedJurisdiction] = React.useState<{
    state: string;
    district: string | null;
  } | null>(null);

  const availableDistricts = React.useMemo(() => {
    if (selectedState === "All India") return [];
    return DISTRICTS_BY_STATE[selectedState] ?? [];
  }, [selectedState]);

  const executeLookup = async (overrideParams?: {
    state?: string;
    district?: string;
    pincode?: string;
    ephemeralCoordinates?: { latitude: number; longitude: number } | null;
  }) => {
    setIsSearching(true);
    try {
      const targetState = overrideParams?.state ?? selectedState;
      const targetDistrict =
        overrideParams?.district !== undefined
          ? overrideParams.district
          : selectedDistrict;
      const targetPin =
        overrideParams?.pincode !== undefined
          ? overrideParams.pincode
          : pincodeInput;

      const res = await findLocalDlsaAuthoritiesAction({
        state: targetState,
        district: targetDistrict || null,
        pincode: targetPin || undefined,
        issueCategory,
        language,
        ephemeralCoordinates: overrideParams?.ephemeralCoordinates ?? null,
      });

      if (res.ok) {
        setAuthorities(res.authorities);
        setPincodeResolution(res.pincodeResolution);
        if (res.derivedJurisdiction) {
          setDerivedJurisdiction({
            state: res.derivedJurisdiction.state,
            district: res.derivedJurisdiction.district,
          });
          if (res.derivedJurisdiction.privacyNote) {
            setPrivacyNote(res.derivedJurisdiction.privacyNote);
          }
        } else {
          setDerivedJurisdiction(null);
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseBrowserLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }

    setGeoStatus("requesting");
    setPrivacyNote(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Coordinates are passed ephemerally to derive district/state and immediately discarded
        const { latitude, longitude } = position.coords;
        setGeoStatus("resolved");
        await executeLookup({
          ephemeralCoordinates: { latitude, longitude },
        });
      },
      () => {
        setGeoStatus("denied");
        setPrivacyNote(
          "Location permission was not granted. You can freely select your State, District, or enter a 6-digit PIN code below—location permission is never required."
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  };

  const handleQuickPinTry = async (samplePin: string) => {
    setPincodeInput(samplePin);
    await executeLookup({ pincode: samplePin });
  };

  return (
    <div className="space-y-6">
      {/* Locator Control Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <MapPin className="size-3.5" />
              Verified DLSA / SLSA Geo-Locator • Source-Driven Directory
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
              Find Verified Legal Aid Near You
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
              Locate your District Legal Services Authority (DLSA), State Legal Services Authority (SLSA), or Permanent Lok Adalat using your State, District, 6-digit PIN code, or optional browser location.
            </p>
          </div>

          {/* Option D: Explicit User-Triggered Browser Location */}
          <div className="flex flex-col items-start sm:items-end">
            <button
              type="button"
              onClick={handleUseBrowserLocation}
              disabled={geoStatus === "requesting"}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {geoStatus === "requesting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Matching nearest District...
                </>
              ) : (
                <>
                  <Compass className="size-4" />
                  Use My Location (Optional)
                </>
              )}
            </button>
            <span className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              Privacy guarantee: Raw GPS coordinates are never stored.
            </span>
          </div>
        </div>

        {/* Inputs Grid: Option A (State), Option B (District), Option C (PIN Code) */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="dlsa-state-select"
              className="block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              1. State / UT
            </label>
            <select
              id="dlsa-state-select"
              value={selectedState}
              onChange={(e) => {
                const nextState = e.target.value;
                setSelectedState(nextState);
                setSelectedDistrict("");
                executeLookup({ state: nextState, district: "" });
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="All India">All India (NALSA + All States)</option>
              {VERIFIED_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dlsa-district-select"
              className="block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              2. Judicial District
            </label>
            <select
              id="dlsa-district-select"
              value={selectedDistrict}
              disabled={availableDistricts.length === 0}
              onChange={(e) => {
                const nextDist = e.target.value;
                setSelectedDistrict(nextDist);
                executeLookup({ district: nextDist });
              }}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">
                {selectedState === "All India"
                  ? "Select a State first"
                  : `All Districts in ${selectedState}`}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dlsa-pincode-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              3. Or Enter 6-Digit PIN Code
            </label>
            <input
              id="dlsa-pincode-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincodeInput}
              onChange={(e) =>
                setPincodeInput(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="e.g. 201002 or 110001"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => executeLookup()}
              disabled={isSearching}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
            >
              {isSearching ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Scale className="size-4" />
                  Find Verified Help
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick PIN & District Test Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
          <span className="font-semibold text-slate-500">
            Instant Verified PIN Examples:
          </span>
          {[
            { label: "201002 (Ghaziabad, UP)", pin: "201002" },
            { label: "110001 (New Delhi / Ambiguous PIN)", pin: "110001" },
            { label: "400051 (Mumbai Suburban)", pin: "400051" },
            { label: "560027 (Bengaluru)", pin: "560027" },
            { label: "302005 (Jaipur / Conflict Flagged)", pin: "302005" },
          ].map((sample) => (
            <button
              key={sample.pin}
              type="button"
              onClick={() => handleQuickPinTry(sample.pin)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 transition hover:border-amber-400 hover:bg-amber-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Derived Jurisdiction & Ambiguous PIN Feedback Banner (Phase 16 & 17) */}
        {(derivedJurisdiction || pincodeResolution || privacyNote) && (
          <div className="mt-4 space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 dark:bg-emerald-950/20">
            {derivedJurisdiction && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Your likely jurisdiction:{" "}
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {derivedJurisdiction.district
                        ? `${derivedJurisdiction.district}, ${derivedJurisdiction.state}`
                        : derivedJurisdiction.state}
                    </span>
                  </span>
                </div>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Derived only from your selection/PIN
                </span>
              </div>
            )}

            {pincodeResolution && !pincodeResolution.validFormat && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="size-4 shrink-0" />
                {pincodeResolution.explanationNote}
              </p>
            )}

            {pincodeResolution && pincodeResolution.isAmbiguous && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                  Boundary PIN Notice ({pincodeResolution.pincode}): Multiple Judicial Districts Possible
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  {pincodeResolution.explanationNote} Select your exact judicial district below:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pincodeResolution.candidateDistricts.map((cand) => (
                    <button
                      key={cand}
                      type="button"
                      onClick={() => {
                        if (pincodeResolution.resolvedState) {
                          setSelectedState(pincodeResolution.resolvedState);
                        }
                        setSelectedDistrict(cand);
                        executeLookup({
                          state: pincodeResolution.resolvedState ?? selectedState,
                          district: cand,
                          pincode: "",
                        });
                      }}
                      className="rounded-lg border border-amber-600/40 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100 dark:bg-slate-900 dark:text-amber-200"
                    >
                      Use {cand} DLSA
                    </button>
                  ))}
                </div>
              </div>
            )}

            {privacyNote && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {privacyNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Results Grid (Phase 18: Verified Result Cards) */}
      <div className="grid gap-4 md:grid-cols-2">
        {authorities.map((auth) => {
          const readbackScript = `${auth.officeName}. Jurisdiction: ${auth.jurisdiction}. Services offered include ${auth.services.join(", ")}. ${
            auth.contact.helpline
              ? `Toll free helpline: ${auth.contact.helpline}.`
              : ""
          } ${
            auth.address
              ? `Address: ${auth.address}.`
              : "Address details not listed in the verified source."
          }`;

          return (
            <article
              key={auth.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                {/* Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-0.5 text-[11px] font-extrabold text-white dark:bg-amber-500 dark:text-slate-950">
                      {auth.authorityType}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {auth.district
                        ? `${auth.district}, ${auth.state}`
                        : auth.state}
                    </span>
                  </div>

                  {/* Verification & Freshness Badge */}
                  {auth.conflictMetadata?.conflictStatus === "conflicted" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="size-3" />
                      Source Conflict Flagged • Review Due
                    </span>
                  ) : auth.isStale ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      Review Due (Checked {auth.lastVerifiedAt})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <BadgeCheck className="size-3.5" />
                      Verified • {auth.lastVerifiedAt}
                    </span>
                  )}
                </div>

                {/* Office Name & Jurisdiction */}
                <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                  {auth.officeName}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Jurisdiction:</span>{" "}
                  {auth.jurisdiction}
                </p>

                {/* Why Matched */}
                {auth.matchReasons.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {auth.matchReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      >
                        • {reason}
                      </span>
                    ))}
                  </div>
                )}

                {/* Services */}
                <div className="mt-3">
                  <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Services & Pathways
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {auth.services.map((srv) => (
                      <span
                        key={srv}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Block — Principle 3: Never invent missing phone or address */}
                <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50">
                  <div className="font-bold text-slate-800 dark:text-slate-100">
                    Official Contact & Address
                  </div>

                  <div className="mt-1.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-semibold">Direct Phone: </span>
                      {auth.contact.phone ? (
                        <a
                          href={`tel:${auth.contact.phone}`}
                          className="font-bold text-slate-900 underline dark:text-white"
                        >
                          {auth.contact.phone}
                        </a>
                      ) : (
                        <span className="italic text-slate-500">
                          Contact details not available in the verified source (Use Toll-Free Helpline {auth.contact.helpline ?? "15100"})
                        </span>
                      )}
                    </div>

                    {auth.contact.helpline && (
                      <div>
                        <span className="font-semibold">
                          Statutory Legal Aid Helpline:{" "}
                        </span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          {auth.contact.helpline}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="font-semibold">Email: </span>
                      {auth.contact.email ? (
                        <span>{auth.contact.email}</span>
                      ) : (
                        <span className="italic text-slate-500">
                          Contact details not available in the verified source.
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="font-semibold">Office Address: </span>
                      {auth.address ? (
                        <span>{auth.address}</span>
                      ) : (
                        <span className="italic text-slate-500">
                          Address not available in the verified source.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conflict Transparency Notice (Phase 12) */}
                  {auth.conflictMetadata?.conflictStatus === "conflicted" && (
                    <div className="mt-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[11px] text-amber-900 dark:text-amber-200">
                      <div className="font-bold">
                        Moderator Re-Verification Notice:
                      </div>
                      <p className="mt-0.5">{auth.conflictMetadata.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions: TTS Readback + Open Official Source + Prepare Brief */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <TTSListenPlayer
                  text={readbackScript}
                  language={language}
                  label="Listen"
                  compact
                />

                <div className="flex flex-wrap items-center gap-2">
                  {onPrepareBriefForAuthority && (
                    <button
                      type="button"
                      onClick={() => onPrepareBriefForAuthority(auth)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    >
                      <FileText className="size-3.5 text-amber-600" />
                      Prepare Legal Aid Brief
                    </button>
                  )}

                  <a
                    href={auth.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    <span>Open Official Source</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
