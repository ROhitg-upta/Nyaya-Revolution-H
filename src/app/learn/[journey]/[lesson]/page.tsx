import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonReader } from "@/components/learning";
import { getJourney, getLesson, journeys } from "@/constants";

type Params = { params: Promise<{ journey: string; lesson: string }> };

export function generateStaticParams() {
  return journeys.flatMap((j) =>
    j.modules.flatMap((m) =>
      m.lessons.map((l) => ({ journey: j.slug, lesson: l.slug })),
    ),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey, lesson } = await params;
  const result = getLesson(journey, lesson);
  if (!result) return { title: "Lesson not found" };
  return { title: result.lesson.title };
}

export default async function LessonPage({ params }: Params) {
  const { journey, lesson } = await params;
  const j = getJourney(journey);
  const result = getLesson(journey, lesson);
  if (!j || !result) notFound();

  return <LessonReader journeySlug={journey} lessonSlug={lesson} />;
}
