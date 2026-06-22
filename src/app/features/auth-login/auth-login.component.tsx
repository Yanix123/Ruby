"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "@/pkg/auth/auth-client";
import { TextField } from "@/shared/ui/text-field";

type Values = { email: string; password: string };

export function AuthLogin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>();

  const onSubmit = handleSubmit(async (v) => {
    try {
      const { error } = await signIn.email({
        email: v.email,
        password: v.password,
      });
      if (error) {
        setError("root", { message: error.message ?? "Login failed" });
        return;
      }
      router.push("/movies");
      router.refresh(); // reflect the new session in Server Components
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
            message: "Invalid email",
          },
        })}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Min 8 characters" },
        })}
      />

      {errors.root && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </form>
  );
}
