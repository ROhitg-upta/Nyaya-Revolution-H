"use client";

import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  Compass,
  FileText,
  Filter,
  MessagesSquare,
  Search,
  ShieldCheck,
  UserCheck,
} from "@/lib/icons";
import { Container } from "@/components/layout";
import { ModerationItemCard } from "./moderation-item-card";
import { VerificationReviewModal } from "./verification-review-modal";
import type {
  ModerationEntityType,
  ModerationQueueItem,
  ModerationStats,
  ModerationStatus,
} from "@/types";

interface ModerationDashboardProps {
  initialItems: ModerationQueueItem[];
  initialStats: ModerationStats;
}

export function ModerationDashboard({
  initialItems,
  initialStats,
}: ModerationDashboardProps) {
  const [items, setItems] = useState<ModerationQueueItem[]>(initialItems);
  const [stats, setStats] = useState<ModerationStats>(initialStats);
  const [selectedType, setSelectedType] = useState<"all" | ModerationEntityType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ModerationQueueItem | null>(null);
  const [activeRole, setActiveRole] = useState<string>("advocate");

  const filterTabs = [
    { id: "all" as const, label: "All Items", icon: Filter },
    { id: "situation" as const, label: "Citizen Situations", icon: Compass },
    { id: "quiz" as const, label: "AI Draft Quizzes", icon: Brain },
    { id: "story" as const, label: "Citizen Stories", icon: MessagesSquare },
    { id: "report" as const, label: "Citation Reports", icon: FileText },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedType !== "all" && item.entityType !== selectedType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleItemUpdated = (entityId: string, newStatus: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === entityId ? { ...i, status: newStatus as ModerationStatus } : i
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingReview: Math.max(0, prev.pendingReview - 1),
      verifiedToday:
        newStatus === "verified" || newStatus === "published"
          ? prev.verifiedToday + 1
          : prev.verifiedToday,
    }));
  };

  return (
    <Container size="default" gutter="page" className="flex flex-col gap-8">
      {/* Header & Role Switcher */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl shadow-sm">
              <ShieldCheck className="size-4.5" />
            </span>
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              Legal Content Governance
            </span>
          </div>
          <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight sm:text-4xl">
            Moderator Verification Queue
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Review citizen encounters, audit AI draft quizzes against statutory sources, and verify legal accuracy.
          </p>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="glass border-brand/30 flex items-center gap-2 rounded-2xl p-2 text-xs">
          <UserCheck className="text-brand size-4 ml-1" />
          <span className="text-muted-foreground font-medium hidden sm:inline">Active Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer"
          >
            <option value="advocate" className="bg-card text-foreground">
              Advocate (High Court / Supreme Court)
            </option>
            <option value="legal_educator" className="bg-card text-foreground">
              Legal Educator (Law Professor)
            </option>
            <option value="admin" className="bg-card text-foreground">
              Platform Governance Admin
            </option>
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass flex flex-col gap-1 rounded-2xl p-5">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Pending Verification
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl font-bold">{stats.pendingReview}</span>
            <span className="text-amber-500 text-xs font-medium">Needs Attention</span>
          </div>
        </div>

        <div className="glass flex flex-col gap-1 rounded-2xl p-5">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Verified Today
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl font-bold">{stats.verifiedToday}</span>
            <span className="text-emerald-500 text-xs font-medium">Published Live</span>
          </div>
        </div>

        <div className="glass flex flex-col gap-1 rounded-2xl p-5">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Citation Flags
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl font-bold">{stats.flaggedCount}</span>
            <span className="text-blue-500 text-xs font-medium">Reported by Peers</span>
          </div>
        </div>

        <div className="glass flex flex-col gap-1 rounded-2xl p-5">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Avg Turnaround Speed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-3xl font-bold">{stats.avgReviewMinutes}m</span>
            <span className="text-muted-foreground text-xs font-medium">Per Legal Item</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-brand text-primary-foreground shadow-sm"
                    : "glass text-muted-foreground hover:text-foreground hover:border-brand/40"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <input
            type="text"
            placeholder="Search pending queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground w-full rounded-full border px-3 py-1.5 pl-9 text-xs focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      {/* Queue Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredItems.map((item) => (
            <ModerationItemCard
              key={item.id}
              item={item}
              onSelect={(selected) => setSelectedItem(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center gap-3 rounded-3xl p-12 text-center">
          <span className="bg-emerald-500/15 text-emerald-500 flex size-12 items-center justify-center rounded-2xl">
            <CheckCircle2 className="size-6" />
          </span>
          <h3 className="text-foreground text-lg font-bold">Verification Queue Clear!</h3>
          <p className="text-muted-foreground max-w-sm text-xs sm:text-sm">
            All submitted citizen situations, draft AI quizzes, and citation reports have been reviewed.
          </p>
        </div>
      )}

      {/* Verification Review Modal */}
      <VerificationReviewModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdated={handleItemUpdated}
      />
    </Container>
  );
}
