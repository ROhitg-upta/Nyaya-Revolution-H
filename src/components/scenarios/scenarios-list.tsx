"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Brain,
  Clock,
} from "@/lib/icons";
import { scenarioSimulations } from "@/constants";

export function ScenariosList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Scenarios" },
    { id: "housing", label: "Housing & Tenancy" },
    { id: "citizen", label: "Police & Civil Rights" },
    { id: "cyber", label: "Cyber & Financial Fraud" },
  ];

  const filtered = scenarioSimulations.filter(
    (s) => selectedCategory === "all" || s.category === selectedCategory,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass text-brand mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold"
        >
          <Brain className="size-3.5" />
          Interactive Legal Simulations
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Practice Before Reality Happens.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg"
        >
          Navigate realistic legal disputes, evaluate tactical choices, understand statutory risk levels, and build confidence before facing real authorities.
        </motion.p>
      </div>

      {/* Category Pills */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-gradient-brand text-primary-foreground shadow-sm"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scenario Cards Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((scen, idx) => (
          <motion.div
            key={scen.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Link
              href={`/learn/scenarios/${scen.slug}`}
              className="glass hover:border-brand/50 group flex h-full flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="bg-brand/10 text-brand rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                    {scen.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-3" />
                    {scen.estimatedMinutes} min
                  </span>
                </div>

                <h3 className="text-foreground group-hover:text-brand text-lg font-bold transition-colors">
                  {scen.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  {scen.context}
                </p>
              </div>

              <div className="border-border/40 mt-6 flex items-center justify-between border-t pt-4 text-xs">
                <span className="text-muted-foreground capitalize font-medium">
                  {scen.difficulty}
                </span>
                <span className="text-brand font-semibold group-hover:underline">
                  Start Simulation &rarr;
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
