import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { Sparkles } from "lucide-react";

import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,

  head: () => ({
    meta: [{ title: "Register — TaskFlow" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(60),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(255),

  password: z
    .string()
    .min(6, "Min 6 characters")
    .max(128),

  role: z.enum(["admin", "member"]),
});

function RegisterPage() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("member");

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse({
      name,
      email,
      password,
      role,
    });

    if (!parsed.success)
      return toast.error(parsed.error.issues[0].message);

    setLoading(true);

    try {
      await register(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password,
        parsed.data.role
      );

      toast.success("Account created!");

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8">
        <Link
          to="/"
          className="flex items-center gap-2 mb-6"
        >
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>

          <span className="text-xl font-semibold">
            TaskFlow
          </span>
        </Link>

        <h1 className="text-2xl font-semibold">
          Create your account
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Start organizing your tasks in style.
        </p>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label>User Role</Label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 bg-background"
            >
              <option value="member">
                Member
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground shadow-glow rounded-xl py-3"
          >
            {loading ? (
              <Spinner className="text-primary-foreground" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}