/**
 * Learning Curriculum Database Service.
 *
 * Provides access to learning journeys, modules, structured multi-block lessons,
 * and associated quiz questions.
 */

import { journeys } from "@/constants/learning";
import type { Journey, Lesson } from "@/types";

export class LearningService {
  /** Retrieves all learning journeys */
  async getJourneys(): Promise<Journey[]> {
    return journeys;
  }

  /** Retrieves a journey by its slug */
  async getJourneyBySlug(slug: string): Promise<Journey | null> {
    const all = await this.getJourneys();
    return all.find((j) => j.slug === slug) ?? null;
  }

  /** Retrieves a lesson within a journey */
  async getLesson(
    journeySlug: string,
    lessonSlug: string,
  ): Promise<Lesson | null> {
    const journey = await this.getJourneyBySlug(journeySlug);
    if (!journey) return null;

    for (const mod of journey.modules) {
      const found = mod.lessons.find((l) => l.slug === lessonSlug);
      if (found) return found;
    }

    return null;
  }
}

export const learningService = new LearningService();
