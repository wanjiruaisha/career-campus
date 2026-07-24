import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteArticle,
  getArticles,
} from "@/services/articleService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManageArticles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);

        const articleData = await getArticles();

        setArticles(articleData);
      } catch (error) {
        console.error("Failed to fetch articles:", error);

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

  async function handleDelete(articleId, articleTitle) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${articleTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(articleId);

      await deleteArticle(articleId);

      setArticles((currentArticles) =>
        currentArticles.filter(
          (article) => article.id !== articleId
        )
      );

      toast.success("Article deleted successfully.");
    } catch (error) {
      console.error("Failed to delete article:", error);

      toast.error(
        error?.message ||
          "Failed to delete the article. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(createdAt) {
    if (!createdAt) {
      return "No date";
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
      return "No date";
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">
              Manage Articles
            </CardTitle>

            <CardDescription className="mt-2">
              View, edit, and delete your Career Compass articles.
            </CardDescription>
          </div>

          <Button
            type="button"
            onClick={() =>
              navigate("/admin/articles/new")
            }
          >
            <Plus className="mr-2 h-4 w-4" />

            Add New Article
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />

                <span>Loading articles...</span>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed px-4 text-center">
              <FileText className="mb-4 h-10 w-10 text-muted-foreground" />

              <h2 className="text-lg font-semibold">
                No articles yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Your published and draft articles will appear here.
              </p>

              <Button
                type="button"
                className="mt-5"
                onClick={() =>
                  navigate("/admin/articles/new")
                }
              >
                <Plus className="mr-2 h-4 w-4" />

                Create Your First Article
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-200 text-left">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold">
                      Thumbnail
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Title
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Created
                    </th>

                    <th className="px-4 py-3 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        {article.thumbnail ? (
                          <img
                            src={article.thumbnail}
                            alt={`${article.title} thumbnail`}
                            className="h-14 w-20 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-20 items-center justify-center rounded-md border bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </td>

                      <td className="max-w-72 px-4 py-3">
                        <p className="line-clamp-2 font-medium">
                          {article.title}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {article.category}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            article.status === "Published"
                              ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                              : "inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                          }
                        >
                          {article.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(article.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/articles/edit/${article.id}`
                              )
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />

                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={
                              deletingId === article.id
                            }
                            onClick={() =>
                              handleDelete(
                                article.id,
                                article.title
                              )
                            }
                          >
                            {deletingId === article.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}

                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}