import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonReader } from "@/components/learning";
import { getLesson, journeys, journeyLessons } from "@/constants";

type Params = { params: Promise<{ journey: string; lesson: string }> };

export function generateStaticParams() {
  return journeys.flatMap((j) =>
    journeyLessons(j).map((l) => ({ journey: j.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { journey, lesson } = await params;
  const found = getLesson(journey, lesson);
  if (!found) return { title: "Lesson not found" };
  return { title: found.lesson.title };
}

export default async function LessonPage({ params }: Params) {
  const { journey, lesson } = await params;
  if (!getLesson(journey, lesson)) notFound();
  return <LessonReader journeySlug={journey} lessonSlug={lesson} />;
}
