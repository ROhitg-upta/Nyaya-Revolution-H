import { Badge } from "@/components/ui/badge";
import { difficultyMeta } from "@/constants";
import type { Difficulty } from "@/types";

/** Small labelled badge for a journey's difficulty level. */
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const meta = difficultyMeta[difficulty];
  return (
    <Badge variant="secondary" className="gap-1">
      <meta.icon className="size-3" />
      {meta.label}
    </Badge>
  );
}
