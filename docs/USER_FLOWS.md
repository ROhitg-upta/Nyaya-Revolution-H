

## Sprint E12 Journey: Speak -> Understand -> Locate DLSA -> Simulate Lok Adalat -> Prepare A4 Brief
1. Citizen speaks or types in Hindi, Hinglish, regional language, or English.
2. Listens to educational explanation via [? Listen] (TTSListenPlayer).
3. Locates local DLSA/SLSA via State, District, 6-digit PIN, or optional location.
4. Explores Lok Adalat educational simulator & generates Printable A4 Case Preparation Brief (lok-adalat-prep-brief-v1).

## Sprint E15 — Assisted Para-Legal Clinic Handoff & Offline Reconnection Flow
1. Citizen selects exact sections (attachments excluded by default) and confirms 'You are about to share' preview.
2. System freezes snapshot and displays one-time /handoff/nyh_... link + QR code.
3. Helper views read-only snapshot (/handoff/[token], orce-dynamic, 
oindex); citizen can revoke access immediately.
4. Offline edits persist to IndexedDB (NyayaCasePrepOfflineDB) and reconcile via Keep Local vs Keep Server when reconnecting.
