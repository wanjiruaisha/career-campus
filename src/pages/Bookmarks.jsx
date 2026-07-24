import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowRight,
  Bookmark,
  BookmarkX,
  Compass,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import {
  getUserProfile,
  removeBookmark,
} from "@/services/authService";

import { getPublishedArticles } from "@/services/articleService";

import { Button } from "@/components/ui/button";

function Bookmarks() {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removingId, setRemovingId] =
    useState(null);

  useEffect(() => {
    async function loadBookmarks() {
      if (!user?.uid) {
        return;
      }

      try {
        setLoading(true);

        const [profile, publishedArticles] =
          await Promise.all([
            getUserProfile(user.uid),
            getPublishedArticles(),
          ]);

        const savedIds =
          profile?.bookmarks || [];

        const bookmarkedArticles =
          publishedArticles.filter((article) =>
            savedIds.includes(article.id)
          );

        setArticles(bookmarkedArticles);
      } catch (error) {
        console.error(
          "Failed to load bookmarks:",
          error
        );

        toast.error(
          "Failed to load your bookmarks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookmarks();
  }, [user?.uid]);

  async function handleRemove(articleId) {
    try {
      setRemovingId(articleId);

      await removeBookmark(
        user.uid,
        articleId
      );

      setArticles((currentArticles) =>
        currentArticles.filter(
          (article) =>
            article.id !== articleId
        )
      );

      toast.success(
        "Article removed from bookmarks."
      );
    } catch (error) {
      console.error(
        "Failed to remove bookmark:",
        error
      );

      toast.error(
        "Could not remove the bookmark."
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-blue-100/80 via-background to-indigo-100/60 py-16 dark:from-blue-950/30 dark:to-indigo-950/20">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-primary shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <Bookmark className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Your Bookmarks
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
            Keep your favourite career guides in one
            place and return to them whenever you need
            direction.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading your bookmarks...
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border bg-card p-8 text-center shadow-xl shadow-blue-950/5 sm:p-12">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookmarkX className="h-8 w-8" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No saved articles yet
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                When you find a useful career guide,
                click “Save Article” and it will appear
                here.
              </p>

              <Link
                to="/articles"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20"
              >
                Explore Career Guides

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                  Saved for later
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  {articles.length} saved{" "}
                  {articles.length === 1
                    ? "article"
                    : "articles"}
                </h2>
              </div>

              <Link
                to="/articles"
                className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex"
              >
                Find more articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {article.thumbnail ? (
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
                        <Compass className="h-12 w-12 text-primary" />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:bg-slate-950/75 dark:text-blue-300">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-2 text-xl font-bold leading-7">
                      {article.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {article.summary}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <Link
                        to={`/articles/${article.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        Read article

                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={
                          removingId === article.id
                        }
                        onClick={() =>
                          handleRemove(article.id)
                        }
                        aria-label={`Remove ${article.title} from bookmarks`}
                        className="text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        {removingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BookmarkX className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Bookmarks;