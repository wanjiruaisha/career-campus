import {
  FileText,
  CheckCircle2,
  FileClock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Dashboard() {
  const stats = [
    {
      title: "Total Articles",
      value: 0,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Published",
      value: 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Drafts",
      value: 0,
      icon: FileClock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's an overview of your
          Career Compass content.
        </p>
      </div>

      {/* Statistics */}

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

      {/* Recent Articles */}

      <Card>
        <CardHeader>
          <CardTitle>
            Recent Articles
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
            <p className="text-muted-foreground">
              No articles yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;