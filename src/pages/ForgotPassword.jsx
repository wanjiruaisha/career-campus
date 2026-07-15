import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ArrowLeft, GraduationCap } from "lucide-react";

import { resetPassword } from "@/services/authService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    try {
      setLoading(true);

      await resetPassword(values.email);

      toast.success(
        "Password reset email sent! Check your inbox."
      );
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No account found with that email.");
          break;

        case "auth/invalid-email":
          toast.error("Please enter a valid email.");
          break;

        default:
          toast.error("Unable to send reset email.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-background">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-16">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">

              <GraduationCap className="h-8 w-8" />

            </div>

            <div>

              <h1 className="text-3xl font-bold">
                Career Compass
              </h1>

              <p className="text-blue-100">
                Recover Your Account
              </p>

            </div>

          </div>

          <div className="mt-24">

            <h2 className="text-5xl font-bold leading-tight">
              Reset
              <br />
              Your Password
            </h2>

            <p className="mt-8 max-w-md text-lg leading-8 text-blue-100">
              Enter your email address and we'll send you a password reset link so you can get back to exploring your future.
            </p>

          </div>

        </div>

        <p className="text-sm text-blue-100">
          © 2026 Career Compass
        </p>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center p-6 md:p-10">

        <Card className="w-full max-w-lg border-0 shadow-2xl">

          <CardContent className="p-8">

            <div className="mb-8 text-center">

              <h2 className="text-3xl font-bold">
                Forgot Password?
              </h2>

              <p className="mt-2 text-muted-foreground">
                Enter your email and we'll send a reset link.
              </p>

            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              <div>

                <Label htmlFor="email">
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="mt-2 h-11"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </Button>

            </form>

            <div className="mt-8 text-center">

              <Link
                to="/signin"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                <ArrowLeft size={16} />

                Back to Sign In

              </Link>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}

export default ForgotPassword;