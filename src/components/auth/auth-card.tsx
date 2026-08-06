"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { type LucideIcon, Scale } from "@/lib/icons";

interface AuthCardProps {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Rendered under the card body (e.g. "Don't have an account?"). */
  footer?: ReactNode;
}

/**
 * Glass container shared by every auth screen: brand emblem, heading block,
 * body, and an optional footer. Animates in for a premium first impression.
 */
export function AuthCard({
  icon: Icon = Scale,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong w-full max-w-md rounded-3xl p-8 sm:p-10"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-12 items-center justify-center rounded-2xl">
          <Icon className="size-6" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8">{children}</div>

      {footer ? (
        <div className="text-muted-foreground mt-6 text-center text-sm">
          {footer}
        </div>
      ) : null}
    </motion.div>
  );
}
