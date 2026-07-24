import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getArticleById } from "@/services/articleService";

function ArticleDetails() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setNotFound(false);

        const articleData = await getArticleById(id);

        if (!articleData) {
          setNotFound(true);
          return;
        }

        setArticle(articleData);
      } catch (error) {
        console.error("Failed to load article:", error);

        setNotFound(true);

        toast.error(
          error?.message ||
            "Failed to load the article. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  const readingTime = useMemo(() => {
    if (!article?.content) {
      return 1;
    }

    const wordCount = article.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return Math.max(1, Math.ceil(wordCount / 200));
  }, [article]);

  function formatDate(createdAt) {
    if (!createdAt) {
      return "";
    }

    try {
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);

      return date.toLocaleDateString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  function renderArticleContent(content) {
    if (!content) {
      return null;
    }

    const lines = content.split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        return <div key={index} className="h-4" />;
      }

      if (trimmedLine.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mb-3 mt-8 text-xl font-bold tracking-tight text-foreground"
          >
            {trimmedLine.replace("### ", "")}
          </h3>
        );
      }

      if (trimmedLine.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mb-4 mt-12 border-l-4 border-primary pl-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {trimmedLine.replace("## ", "")}
          </h2>
        );
      }

      if (trimmedLine.startsWith("# ")) {
        return (
          <h2
            key={index}
            className="mb-4 mt-12 border-l-4 border-primary pl-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {trimmedLine.replace("# ", "")}
          </h2>
        );
      }

      if (trimmedLine.startsWith("- ")) {
        return (
          <div
            key={index}
            className="mb-3 flex items-start gap-3 text-[1.03rem] leading-8 text-foreground/90"
          >
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-primary" />

            <span>{trimmedLine.replace("- ", "")}</span>
          </div>
        );
      }

      const numberedItem = trimmedLine.match(/^\d+\.\s+(.*)/);

      if (numberedItem) {
        const number = trimmedLine.split(".")[0];

        return (
          <div
            key={index}
            className="mb-4 flex items-start gap-4 text-[1.03rem] leading-8 text-foreground/90"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {number}
            </span>

            <span>{numberedItem[1]}</span>
          </div>
        );
      }

      return (
        <p
          key={index}
          className="mb-5 text-[1.03rem] leading-8 text-foreground/85 sm:text-[1.08rem]"
        >
          {trimmedLine}
        </p>
      );
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>

          <div>
            <p className="font-semibold">Loading article</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Preparing your career guide...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Article not found
          </h1>

          <p className="mt-3 leading-7 text-muted-foreground">
            This article may have been removed, changed to a
            draft, or is no longer available.
          </p>

          <Link
            to="/articles"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  const publishedDate = formatDate(article.createdAt);

  return (
    <main className="min-h-screen bg-background">
      {/* Soft page introduction background */}
      <section className="border-b bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-lg px-1 py-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <header className="mx-auto mt-8 max-w-4xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {article.category && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  {article.category}
                </span>
              )}

              {publishedDate && (
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {publishedDate}
                </span>
              )}

              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {article.summary && (
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-xl">
                {article.summary}
              </p>
            )}
          </header>
        </div>
      </section>

      <article className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {/* Main thumbnail */}
        {article.thumbnail && (
          <div className="-mt-1 overflow-hidden rounded-2xl border bg-muted shadow-xl shadow-blue-950/10 sm:rounded-3xl dark:shadow-none">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="max-h-[580px] w-full object-cover"
            />
          </div>
        )}

        {/* Reading area */}
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Career Guide
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div>{renderArticleContent(article.content)}</div>

          {/* End of article */}
          <div className="mt-14 rounded-2xl border bg-primary/5 p-6 text-center sm:p-8">
            <h2 className="text-xl font-bold">
              Keep exploring your possibilities
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
              Discover more Career Compass guides to learn about
              different careers, skills, and education pathways.
            </p>

            <Link
              to="/articles"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore More Articles
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export default ArticleDetails;