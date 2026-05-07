import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, BarChart3, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "TaskFlow — Organize work, beautifully" },
      { name: "description", content: "TaskFlow is a modern task manager with dashboard analytics, JWT auth and a gorgeous glass UI." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">TaskFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
          <Button asChild className="gradient-primary text-primary-foreground shadow-glow">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-16 pb-24">
        <section className="text-center max-w-3xl mx-auto">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Beautiful, fast, and free
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight">
            Organize work, <span className="text-gradient">beautifully</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            TaskFlow turns chaos into clarity with a modern dashboard, smart filters, and a glass UI you'll love.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" asChild className="gradient-primary text-primary-foreground shadow-glow">
              <Link to="/register">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">I have an account</Link>
            </Button>
          </div>
        </section>

        <section className="mt-24 grid md:grid-cols-3 gap-6">
          {[
            { icon: CheckCircle2, title: "Effortless tasks", desc: "Create, edit, prioritize and complete tasks in seconds." },
            { icon: BarChart3, title: "Dashboard insights", desc: "Visualize your week with beautiful charts powered by Recharts." },
            { icon: ShieldCheck, title: "Secure by default", desc: "JWT-based auth with bcrypt-hashed passwords." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
