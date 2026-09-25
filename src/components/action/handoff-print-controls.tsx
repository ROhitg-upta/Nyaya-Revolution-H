"use client";

import * as React from "react";
import { Printer } from "lucide-react";

export function HandoffPrintControls() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-emerald-400 print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print Read-Only Dossier (A4)
    </button>
  );
}
