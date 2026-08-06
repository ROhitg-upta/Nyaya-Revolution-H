interface StepHeaderProps {
  title: string;
  description?: string;
}

/** Consistent heading for each onboarding step. */
export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-sm sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
