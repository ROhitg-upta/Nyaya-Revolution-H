"use client";

import { motion } from "motion/react";
import { Bot, ArrowRight } from "@/lib/icons";
import {
  welcomeMessage,
  suggestedQuestions,
  quickTopics,
} from "@/constants/ai";
import { siteConfig } from "@/constants";

interface ChatWelcomeProps {
  onSelectQuestion: (question: string) => void;
}

export function ChatWelcome({ onSelectQuestion }: ChatWelcomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      {/* Logo + greeting */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <div className="bg-gradient-brand glow-brand flex size-16 items-center justify-center rounded-2xl shadow-lg">
          <Bot className="text-primary-foreground size-8" />
        </div>
        <h1 className="text-foreground mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          {welcomeMessage.greeting}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
          {welcomeMessage.subtitle}
        </p>
      </motion.div>

      {/* Quick topics */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {quickTopics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.label}
              onClick={() => onSelectQuestion(topic.label)}
              className="glass border-border/40 hover:border-brand/30 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm"
            >
              <Icon className="text-brand size-3.5" />
              <span className="text-foreground">{topic.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Suggested questions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="mt-8 w-full max-w-2xl"
      >
        <p className="text-muted-foreground mb-3 text-center text-xs font-medium tracking-wider uppercase">
          Popular questions
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {suggestedQuestions.map((sq, i) => {
            const Icon = sq.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 + i * 0.04 }}
                onClick={() => onSelectQuestion(sq.question)}
                className="glass border-border/40 group hover:border-brand/30 flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all hover:shadow-sm"
              >
                <div className="bg-brand/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-brand size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground line-clamp-2 text-sm leading-snug">
                    {sq.question}
                  </p>
                  <p className="text-muted-foreground mt-1 text-[11px]">
                    {sq.category}
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground/50 mt-8 max-w-md text-center text-[11px]"
      >
        {welcomeMessage.disclaimer}
      </motion.p>
    </div>
  );
}
