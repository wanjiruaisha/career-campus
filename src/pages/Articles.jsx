import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  FileText,
  Loader2,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import { getPublishedArticles } from "@/services/articleService";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);

        const articleData =
          await getPublishedArticles();

        setArticles(articleData);
      } catch (error) {
        console.error(
          "Failed to load published articles:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to load articles. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const categories = useMemo(() => {
    const availableCategories = articles
      .map((article) => article.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(availableCategories),
    ].sort((firstCategory, secondCategory) => {
      if (firstCategory === "All") {
        return -1;
      }

      if (secondCategory === "All") {
        return 1;
      }

      return firstCategory.localeCompare(
        secondCategory
      );
    });
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const cleanedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category === selectedCategory;

      const searchableContent = [
        article.title,
        article.summary,
        article.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        cleanedSearchTerm === "" ||
        searchableContent.includes(
          cleanedSearchTerm
        );

      return matchesCategory && matchesSearch;
    });
  }, [
    articles,
    searchTerm,
    selectedCategory,
  ]);

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

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page heading */}
      <section className="border-b bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <BookOpen className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Explore Career Articles
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover career paths, required skills,
            education routes, and practical guidance
            to help you make confident decisions about
            your future.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Search and category filter */}
        <Card className="mb-10 border-border/70">
          <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_240px] md:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search careers or topics..."
                aria-label="Search articles"
                className="h-12 pl-11"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
              aria-label="Filter articles by category"
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category === "All"
                    ? "All Categories"
                    : category}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />

              <span>Loading career articles...</span>
            </div>
          </div>
        )}

        {/* No published articles */}
        {!loading && articles.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />

            <h2 className="mt-5 text-xl font-semibold">
              No articles available yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Published Career Compass articles will
              appear here.
            </p>
          </div>
        )}

        {/* No matching search results */}
        {!loading &&
          articles.length > 0 &&
          filteredArticles.length === 0 && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
              <Search className="h-11 w-11 text-muted-foreground" />

              <h2 className="mt-5 text-xl font-semibold">
                No matching articles
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try another search term or choose a
                different category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* Article results */}
        {!loading &&
          filteredArticles.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Career Guides
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {filteredArticles.length}{" "}
                    {filteredArticles.length === 1
                      ? "article"
                      : "articles"}{" "}
                    found
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <article key={article.id}>
                    <Card className="group flex h-full flex-col overflow-hidden border-border/70 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {article.thumbnail ? (
                          <img
                            src={article.thumbnail}
                            alt={`${article.title} thumbnail`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                          </div>
                        )}

                        {article.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur dark:text-blue-400">
                            {article.category}
                          </span>
                        )}
                      </div>

                      <CardContent className="flex flex-1 flex-col p-5">
                        {formatDate(
                          article.createdAt
                        ) && (
                          <p className="mb-2 text-xs text-muted-foreground">
                            {formatDate(
                              article.createdAt
                            )}
                          </p>
                        )}

                        <h3 className="line-clamp-2 text-xl font-bold leading-7">
                          {article.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {article.summary}
                        </p>

                        <Link
                          to={`/articles/${article.id}`}
                          className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-600 transition hover:gap-3 hover:text-blue-700 dark:text-blue-400"
                        >
                          Read article

                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </div>
            </>
          )}
      </section>
    </main>
  );
}

export default Articles;