
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  FileClock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getArticles } from "@/services/articleService";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);

        const articleData = await getArticles();

        setArticles(articleData);
      } catch (error) {
        console.error(
          "Failed to load dashboard statistics:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const draftArticles = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  const stats = [
    {
      title: "Total Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Published",
      value: publishedArticles,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Drafts",
      value: draftArticles,
      icon: FileClock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your
          Career Compass content.
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />

            <span>Loading dashboard...</span>
          </div>
        </div>
      ) : (
        /* Article statistics */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.title}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      {stat.value}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                    <Icon
                      className={stat.color}
                      size={30}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

