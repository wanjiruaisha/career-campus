import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  HeartPulse,
  Laptop,
  Loader2,
  Palette,
  Scale,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { getPublishedArticles } from "@/services/articleService";

const categories = [
  {
    title: "Technology",
    description:
      "Explore software, data, cybersecurity, and digital careers.",
    icon: Laptop,
    iconStyle:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    title: "Medicine",
    description:
      "Discover careers focused on healthcare and patient wellbeing.",
    icon: HeartPulse,
    iconStyle:
      "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  {
    title: "Engineering",
    description:
      "Learn about careers that design, build, and improve systems.",
    icon: Wrench,
    iconStyle:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    title: "Business",
    description:
      "Explore entrepreneurship, management, finance, and marketing.",
    icon: BriefcaseBusiness,
    iconStyle:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    title: "Law",
    description:
      "Understand legal careers, qualifications, and areas of practice.",
    icon: Scale,
    iconStyle:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    title: "Creative Arts",
    description:
      "Discover careers in design, media, writing, and visual arts.",
    icon: Palette,
    iconStyle:
      "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
];

const benefits = [
  {
    title: "Discover your options",
    description:
      "Explore careers across different industries and learn what each path involves.",
    icon: Search,
  },
  {
    title: "Understand the journey",
    description:
      "Learn about required skills, education pathways, challenges, and opportunities.",
    icon: BookOpen,
  },
  {
    title: "Save useful guidance",
    description:
      "Bookmark career articles and return to them whenever you need direction.",
    icon: Bookmark,
  },
];

function Home() {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestArticles() {
      try {
        setLoading(true);

        const publishedArticles =
          await getPublishedArticles();

        setArticles(publishedArticles);
      } catch (error) {
        console.error(
          "Failed to load homepage articles:",
          error
        );

        toast.error(
          "Some homepage articles could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLatestArticles();
  }, []);

  const latestArticles = useMemo(
    () => articles.slice(0, 3),
    [articles]
  );

  const featuredArticle = latestArticles[0];

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
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <main className="overflow-hidden bg-background">
      {/* Hero */}
      <section className="relative isolate border-b">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-100/90 via-background to-indigo-100/70 dark:from-blue-950/40 dark:via-background dark:to-indigo-950/30" />

        <div className="absolute -left-28 top-10 -z-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-24">
          {/* Hero content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />

              Career guidance built for your future
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Find a career path that feels{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                right for you.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Explore career options, understand the
              skills and education they require, and
              make more confident decisions about your
              future.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/articles"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore Career Guides

                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={
                  isAuthenticated
                    ? "/bookmarks"
                    : "/signup"
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-background/70 px-6 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-accent"
              >
                {isAuthenticated
                  ? "View Bookmarks"
                  : "Create Free Account"}
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Clear career pathways
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Practical guidance
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Easy to explore
              </span>
            </div>
          </div>

          {/* Glassmorphism feature panel */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/65 p-3 shadow-2xl shadow-blue-950/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/65">
              {featuredArticle?.thumbnail ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <img
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                      Latest Career Guide
                    </span>

                    <h2 className="mt-3 text-2xl font-bold leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <Link
                      to={`/articles/${featuredArticle.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:gap-3 hover:text-white"
                    >
                      Read the guide

                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <Compass className="h-10 w-10" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    Discover where your interests can
                    take you
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                    Career Compass gives you practical
                    information to make your next step
                    clearer.
                  </p>
                </div>
              )}
            </div>

            {/* Floating glass cards */}
            <div className="absolute -left-5 top-10 hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-xl sm:block dark:border-white/10 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Career guides
                  </p>

                  <p className="font-bold">
                    {articles.length || "Growing"}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 right-5 hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-xl sm:block dark:border-white/10 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <Compass className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Your journey
                  </p>

                  <p className="font-bold">
                    Starts here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Explore possibilities
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Discover careers by category
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Start with an area that interests you,
              then explore the careers and pathways
              available within it.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  to="/articles"
                  className="group rounded-2xl border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-blue-950/5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconStyle}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold">
                      {category.title}
                    </h3>

                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="relative border-y bg-muted/45 py-20 sm:py-24">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Latest insights
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                New career guides
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                Read the latest guides and learn what
                different career paths really involve.
              </p>
            </div>

            <Link
              to="/articles"
              className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary transition hover:gap-3 sm:self-auto"
            >
              View all articles

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading latest articles...
              </div>
            </div>
          ) : latestArticles.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed bg-background/70 p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 text-xl font-bold">
                New guides are coming soon
              </h3>

              <p className="mt-2 text-muted-foreground">
                Published career articles will appear
                here automatically.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10"
                >
                  <div className="flex w-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
                          <Compass className="h-12 w-12 text-primary" />
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-950/75 dark:text-blue-300">
                        {article.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {formatDate(article.createdAt) && (
                        <p className="text-xs font-medium text-muted-foreground">
                          {formatDate(article.createdAt)}
                        </p>
                      )}

                      <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-7">
                        {article.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {article.summary}
                      </p>

                      <Link
                        to={`/articles/${article.id}`}
                        className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary transition group-hover:gap-3"
                      >
                        Read career guide

                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Career Compass */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-2xl shadow-blue-950/20 sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  Why Career Compass?
                </span>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Career decisions feel easier when
                  you have clear information.
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-blue-100">
                  Career Compass turns complicated
                  career information into practical
                  guides that are easier to understand
                  and use.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-4 font-bold">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-blue-100">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-14 text-center shadow-xl shadow-blue-950/5 sm:px-12">
            <div className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Compass className="h-7 w-7" />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Start exploring your future today
              </h2>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
                Discover careers, compare different
                paths, and save the guidance that helps
                you move forward.
              </p>

              <Link
                to="/articles"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Browse Career Guides

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;