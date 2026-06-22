"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signUp } from "@/pkg/auth/auth-client";
import { TextField } from "@/shared/ui/text-field";

type Values = { name: string; email: string; password: string };

export function AuthRegister() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>();

  const onSubmit = handleSubmit(async (v) => {
    try {
      const { error } = await signUp.email({
        name: v.name,
        email: v.email,
        password: v.password,
      });
      if (error) {
        setError("root", { message: error.message ?? "Registration failed" });
        return;
      }
      router.push("/movies");
      router.refresh();
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>

      <TextField
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />

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
        autoComplete="new-password"
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
        {isSubmitting ? "Creating…" : "Create account"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
