import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { FullSpinner } from "@/components/Spinner";
import { CheckCircle2, Clock, ListChecks, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — TaskFlow" }] }),
});

function DashboardPage() {
  const { tasks, loading } = useTasks();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const high = tasks.filter((t) => t.priority === "high").length;
    return { total: tasks.length, completed, pending, high };
  }, [tasks]);

  const priorityData = useMemo(() => ([
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length, color: "oklch(0.7 0.15 200)" },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length, color: "oklch(0.78 0.16 75)" },
    { name: "High", value: tasks.filter((t) => t.priority === "high").length, color: "oklch(0.6 0.23 25)" },
  ]), [tasks]);

  const weekData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return { label: days[d.getDay()], date: d, created: 0, completed: 0 };
    });
    tasks.forEach((t) => {
      const c = new Date(t.createdAt);
      const u = new Date(t.updatedAt);
      buckets.forEach((b, i) => {
        const next = new Date(b.date); next.setDate(b.date.getDate() + 1);
        if (c >= b.date && c < next) buckets[i].created++;
        if (t.status === "completed" && u >= b.date && u < next) buckets[i].completed++;
      });
    });
    return buckets.map(({ label, created, completed }) => ({ label, created, completed }));
  }, [tasks]);

  const recent = useMemo(
    () => [...tasks].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5),
    [tasks],
  );

  if (loading) return <FullSpinner />;

  const cards = [
    { label: "Total tasks", value: stats.total, icon: ListChecks, color: "text-primary" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-[oklch(0.65_0.17_155)]" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-[oklch(0.78_0.16_75)]" },
    { label: "High priority", value: stats.high, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">A quick look at how things are going.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-3xl font-bold">{c.value}</p>
              </div>
              <c.icon className={`h-6 w-6 ${c.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Activity (last 7 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.7 0.02 270 / 0.3)" />
                <XAxis dataKey="label" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)", border: "1px solid var(--border)",
                    borderRadius: "12px", color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="created" fill="oklch(0.65 0.2 285)" radius={[8, 8, 0, 0]} name="Created" />
                <Bar dataKey="completed" fill="oklch(0.65 0.17 155)" radius={[8, 8, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-4">By priority</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={4}>
                  {priorityData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)", border: "1px solid var(--border)",
                    borderRadius: "12px", color: "var(--foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet — create one to get started.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t._id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.updatedAt).toLocaleString()} · {t.priority} priority
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  t.status === "completed"
                    ? "bg-[oklch(0.65_0.17_155_/_0.15)] text-[oklch(0.5_0.17_155)]"
                    : "bg-accent text-accent-foreground"
                }`}>
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
