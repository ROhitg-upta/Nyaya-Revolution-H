"use client";

import { TextField } from "@/components/auth/form-fields";
import { OptionCard } from "@/components/onboarding/option-card";
import { StepHeader } from "@/components/onboarding/step-header";
import {
  ageGroups,
  interests as interestOptions,
  languages,
  learningGoals,
  occupations,
} from "@/constants/onboarding";
import { User } from "@/lib/icons";
import type { InterestId, OnboardingData } from "@/types";

export interface StepProps {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

export function StepProfile({ data, update }: StepProps) {
  return (
    <div className="flex flex-col gap-7">
      <StepHeader
        title="Let's start with you"
        description="A few basics so we can tailor everything that follows."
      />
      <TextField
        label="What should we call you?"
        icon={User}
        placeholder="Your name"
        value={data.name}
        onChange={(e) => update({ name: e.target.value })}
      />
      <fieldset className="flex flex-col gap-3">
        <legend className="text-foreground mb-1 text-sm font-medium">
          Your age group
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {ageGroups.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              compact
              selected={data.ageGroup === option.value}
              onSelect={() => update({ ageGroup: option.value })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-foreground mb-1 text-sm font-medium">
          Preferred language
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {languages.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              compact
              selected={data.language === option.value}
              onSelect={() => update({ language: option.value })}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function StepOccupation({ data, update }: StepProps) {
  return (
    <div className="flex flex-col gap-7">
      <StepHeader
        title="What best describes you?"
        description="We'll surface the situations most relevant to your life."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {occupations.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={data.occupation === option.value}
            onSelect={() => update({ occupation: option.value })}
          />
        ))}
      </div>
    </div>
  );
}

export function StepInterests({ data, update }: StepProps) {
  function toggle(id: InterestId) {
    const next = data.interests.includes(id)
      ? data.interests.filter((i) => i !== id)
      : [...data.interests, id];
    update({ interests: next });
  }

  return (
    <div className="flex flex-col gap-7">
      <StepHeader
        title="What do you want to learn about?"
        description="Pick as many as you like — you can change these anytime."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {interestOptions.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={data.interests.includes(option.value)}
            onSelect={() => toggle(option.value)}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        {data.interests.length} selected · choose at least one to continue.
      </p>
    </div>
  );
}

export function StepGoal({ data, update }: StepProps) {
  return (
    <div className="flex flex-col gap-7">
      <StepHeader
        title="What's your main goal?"
        description="This shapes the learning path we recommend first."
      />
      <div className="flex flex-col gap-3">
        {learningGoals.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={data.goal === option.value}
            onSelect={() => update({ goal: option.value })}
          />
        ))}
      </div>
    </div>
  );
}
