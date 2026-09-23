"use client";

import {
  AlertTriangle,
  Brain,
  Briefcase,
  Building2,
  CarFront,
  Landmark,
  ShieldAlert,
  ShoppingBag,
  TrendingUp,
} from "@/lib/icons";
import type { IndianLegalDomainVelocity } from "@/types";

interface DomainVelocityMatrixProps {
  domains: IndianLegalDomainVelocity[];
}

export function DomainVelocityMatrix({ domains }: DomainVelocityMatrixProps) {
  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case "Landmark":
        return Landmark;
      case "ShieldAlert":
        return ShieldAlert;
      case "Brain":
        return Brain;
      case "ShoppingBag":
        return ShoppingBag;
      case "Building2":
        return Building2;
      case "Briefcase":
        return Briefcase;
      case "CarFront":
        return CarFront;
      default:
        return Landmark;
    }
  };

  const getTrendBadge = (trend: IndianLegalDomainVelocity["trend"], score: number) => {
    if (trend === "hotspot") {
      return (
        <span className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
          <AlertTriangle className="size-3" />
          High Priority Hotspot
        </span>
      );
    }
    return (
      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
        <TrendingUp className="size-3" />
        +{score}% Velocity
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-brand text-xs font-bold uppercase tracking-wider">
          Statutory Domain Velocity Matrix
        </span>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          Learning Velocity Across Indian Legal Domains
        </h2>
        <p className="text-muted-foreground text-sm">
          Real-time measurement of citizen engagement, scenario completion velocity, and comprehension hotspots across key branches of Indian law.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((dom) => {
          const Icon = getDomainIcon(dom.iconName);

          return (
            <div
              key={dom.id}
              className="glass hover:border-brand/40 group flex flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col gap-3.5">
                {/* Domain Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="bg-brand/12 text-brand group-hover:bg-brand group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-2xl transition-colors">
                    <Icon className="size-5.5" />
                  </div>
                  {getTrendBadge(dom.trend, dom.velocityScore)}
                </div>

                <div>
                  <h3 className="text-foreground group-hover:text-brand text-lg font-bold transition-colors">
                    {dom.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs sm:text-sm leading-relaxed">
                    {dom.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 border-y border-border/40 py-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">Active Learners</span>
                    <div className="text-foreground font-bold">{dom.activeLearners.toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">Scenarios Solved</span>
                    <div className="text-foreground font-bold">{dom.completedScenarios.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                {/* Pass Rate Progress */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Citizen Pass Rate</span>
                    <span className="text-foreground font-bold">{dom.passRate}%</span>
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        dom.passRate >= 85
                          ? "bg-emerald-500"
                          : dom.passRate >= 75
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                      style={{ width: `${dom.passRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hotspot Topic Callout */}
              <div className="border-border/50 bg-muted/20 text-muted-foreground mt-4 rounded-xl border p-3 text-xs leading-relaxed">
                <span className="text-foreground font-semibold">Hotspot Concept: </span>
                <span>{dom.hotspotConcept}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
