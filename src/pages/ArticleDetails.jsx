import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useSelector } from "react-redux";

import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Clock3,
  FileText,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import { getArticleById } from "@/services/articleService";

import {
  addBookmark,
  getUserProfile,
  removeBookmark,
} from "@/services/authService";

import { Button } from "@/components/ui/button";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  const [bookmarkLoading, setBookmarkLoading] =
    useState(false);

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
        console.error(
          "Failed to load article:",
          error
        );

        setNotFound(true);

        toast.error(
          "Failed to load the article."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  useEffect(() => {
    async function checkBookmark() {
      if (!user?.uid || !article?.id) {
        setIsBookmarked(false);
        return;
      }

      try {
        const profile = await getUserProfile(
          user.uid
        );

        const savedArticles =
          profile?.bookmarks || [];

        setIsBookmarked(
          savedArticles.includes(article.id)
        );
      } catch (error) {
        console.error(
          "Failed to check bookmark:",
          error
        );
      }
    }

    checkBookmark();
  }, [user?.uid, article?.id]);

  const readingTime = useMemo(() => {
    if (!article?.content) {
      return 1;
    }

    const words = article.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return Math.max(
      1,
      Math.ceil(words / 200)
    );
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

  async function handleBookmark() {
    if (!isAuthenticated || !user?.uid) {
      toast.info(
        "Sign in to save this article."
      );

      navigate("/signin");
      return;
    }

    try {
      setBookmarkLoading(true);

      if (isBookmarked) {
        await removeBookmark(
          user.uid,
          article.id
        );

        setIsBookmarked(false);

        toast.success(
          "Article removed from bookmarks."
        );
      } else {
        await addBookmark(
          user.uid,
          article.id
        );

        setIsBookmarked(true);

        toast.success(
          "Article saved to bookmarks."
        );
      }
    } catch (error) {
      console.error(
        "Failed to update bookmark:",
        error
      );

      toast.error(
        "Could not update your bookmarks."
      );
    } finally {
      setBookmarkLoading(false);
    }
  }

  function renderArticleContent(content) {
    if (!content) {
      return null;
    }

    return content.split("\n").map(
      (line, index) => {
        const text = line.trim();

        if (!text) {
          return (
            <div
              key={index}
              className="h-4"
            />
          );
        }

        if (text.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="mb-3 mt-8 text-xl font-bold"
            >
              {text.replace("### ", "")}
            </h3>
          );
        }

        if (
          text.startsWith("## ") ||
          text.startsWith("# ")
        ) {
          return (
            <h2
              key={index}
              className="mb-4 mt-12 border-l-4 border-primary pl-4 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {text.replace(/^#{1,2}\s/, "")}
            </h2>
          );
        }

        if (text.startsWith("- ")) {
          return (
            <div
              key={index}
              className="mb-3 flex items-start gap-3 text-[1.03rem] leading-8 text-foreground/90"
            >
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-primary" />

              <span>
                {text.replace("- ", "")}
              </span>
            </div>
          );
        }

        const numberedItem = text.match(
          /^(\d+)\.\s+(.*)/
        );

        if (numberedItem) {
          return (
            <div
              key={index}
              className="mb-4 flex items-start gap-4 text-[1.03rem] leading-8 text-foreground/90"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {numberedItem[1]}
              </span>

              <span>{numberedItem[2]}</span>
            </div>
          );
        }

        return (
          <p
            key={index}
            className="mb-5 text-[1.03rem] leading-8 text-foreground/85 sm:text-[1.08rem]"
          >
            {text}
          </p>
        );
      }
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>

          <p className="text-muted-foreground">
            Loading career guide...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Article not found
          </h1>

          <p className="mt-3 text-muted-foreground">
            This article may have been removed or
            changed to a draft.
          </p>

          <Link
            to="/articles"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  const publishedDate = formatDate(
    article.createdAt
  );

  return (
    <main className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
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

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {article.summary && (
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-xl">
                {article.summary}
              </p>
            )}

            <Button
              type="button"
              variant={
                isBookmarked
                  ? "default"
                  : "outline"
              }
              disabled={bookmarkLoading}
              onClick={handleBookmark}
              className="mt-7 h-11 rounded-xl px-5"
            >
              {bookmarkLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isBookmarked ? (
                <BookmarkCheck className="mr-2 h-4 w-4" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}

              {isBookmarked
                ? "Saved to Bookmarks"
                : "Save Article"}
            </Button>
          </header>
        </div>
      </section>

      <article className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {article.thumbnail && (
          <div className="overflow-hidden rounded-3xl border bg-muted shadow-xl shadow-blue-950/10 dark:shadow-none">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="max-h-[580px] w-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Career Guide
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {renderArticleContent(article.content)}

          <div className="mt-14 rounded-3xl border bg-gradient-to-br from-primary/10 to-indigo-500/5 p-7 text-center sm:p-9">
            <h2 className="text-2xl font-bold">
              Keep exploring your possibilities
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
              Discover more guides about careers,
              education pathways, and useful skills.
            </p>

            <Link
              to="/articles"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
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