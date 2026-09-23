import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function PageHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  actions,
  align = "center",
  className,
}: PageHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4",
        isCenter ? "mx-auto max-w-3xl text-center items-center" : "max-w-4xl text-left items-start",
        className,
      )}
    >
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass text-brand inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
        >
          {EyebrowIcon ? <EyebrowIcon className="size-3.5" /> : null}
          <span>{eyebrow}</span>
        </motion.div>
      ) : null}

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="type-h1 text-foreground"
      >
        {title}
      </motion.h1>

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="type-body-lg text-muted-foreground"
        >
          {description}
        </motion.p>
      ) : null}

      {actions ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={cn(
            "mt-2 flex flex-wrap gap-3",
            isCenter ? "justify-center" : "justify-start",
          )}
        >
          {actions}
        </motion.div>
      ) : null}
    </div>
  );
}
