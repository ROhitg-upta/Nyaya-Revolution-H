import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/common";
import { ArticleDetail } from "@/components/laws";
import { getLawArticle, lawArticles } from "@/constants";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return lawArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getLawArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} — Understand the Law`,
    description: article.simpleExplanation,
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getLawArticle(slug);
  if (!article) notFound();

  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <ArticleDetail article={article} />
      </main>
    </>
  );
}
