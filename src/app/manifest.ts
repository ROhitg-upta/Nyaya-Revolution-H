import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nyaya Revolution — Citizen Case Prep & Legal Awareness",
    short_name: "Nyaya Prep",
    description:
      "Situation-first legal awareness, verified DLSA legal aid directory, offline-resilient Citizen Case Preparation Workspace, and bilingual preparation dossiers.",
    start_url: "/action-center/case-prep",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
    ],
  };
}
