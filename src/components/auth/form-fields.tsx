"use client";

import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LucideIcon, Eye, EyeOff } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BaseFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-destructive text-xs">
      {error}
    </p>
  );
}

/** Labelled text input with an optional leading icon and inline error. */
export function TextField({
  label,
  error,
  icon: Icon,
  className,
  id,
  ...props
}: BaseFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        {Icon ? (
          <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        ) : null}
        <Input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-11 rounded-xl", Icon && "pl-9", className)}
          {...props}
        />
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({
  label,
  error,
  icon: Icon,
  className,
  id,
  ...props
}: BaseFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        {Icon ? (
          <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        ) : null}
        <Input
          id={fieldId}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn("h-11 rounded-xl pr-10", Icon && "pl-9", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  );
}
