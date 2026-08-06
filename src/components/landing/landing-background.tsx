/**
 * Fixed, full-viewport layered backdrop for the landing page: the deep-navy
 * base (from `--background`), soft radial blue glows, and a faint grid that
 * fades out. Purely decorative and non-interactive.
 */
export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Radial blue glows */}
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-1),transparent_62%)] blur-2xl" />
      <div className="absolute top-1/3 -left-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,var(--glow-2),transparent_65%)] blur-2xl" />
      <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--glow-1),transparent_65%)] opacity-70 blur-2xl" />
      {/* Faint grid, fading toward the bottom */}
      <div className="bg-grid mask-fade-b absolute inset-0 opacity-70" />
    </div>
  );
}
