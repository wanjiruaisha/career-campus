import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

import { signInSchema } from "@/validation/authSchema";
import {
  signIn,
  signInWithGoogle,
} from "@/services/authService";
import { setUser } from "@/store/authSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setLoading(true);

      const user = await signIn(
        values.email,
        values.password
      );

      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      );

      toast.success("Welcome back!");

      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No account exists with this email.");
          break;

        case "auth/wrong-password":
          toast.error("Incorrect password.");
          break;

        case "auth/invalid-credential":
          toast.error("Invalid email or password.");
          break;

        case "auth/too-many-requests":
          toast.error(
            "Too many attempts. Please try again later."
          );
          break;

        default:
          toast.error("Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true);

      const user = await signInWithGoogle();

      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      );

      toast.success("Welcome back!");

      navigate("/");
    } catch (error) {
      toast.error("Google sign in failed.");
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
                Navigate Your Future
              </p>

            </div>

          </div>

          <div className="mt-24 space-y-8">

            <h2 className="text-5xl font-bold leading-tight">
              Welcome
              <br />
              Back.
            </h2>

            <p className="max-w-md text-lg leading-8 text-blue-100">

              Continue discovering careers,
              learning from professionals,
              and building the future you've
              always dreamed about.

            </p>

            <div className="space-y-5 mt-10">

              <div className="flex items-center gap-3">

                <ArrowRight className="h-5 w-5" />

                <span>
                  Save your favourite articles
                </span>

              </div>

              <div className="flex items-center gap-3">

                <ArrowRight className="h-5 w-5" />

                <span>
                  Explore curated career paths
                </span>

              </div>

              <div className="flex items-center gap-3">

                <ArrowRight className="h-5 w-5" />

                <span>
                  Learn directly from experts
                </span>

              </div>

            </div>

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

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h2>

              <p className="mt-2 text-muted-foreground">
                Sign in to continue your career journey.
              </p>

            </div>

            {/* GOOGLE BUTTON */}

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mb-6 h-11 w-full"
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.2 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.3 5.5-6.2 7l6.3 5.2C39.1 37 44 31.2 44 24c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>

              Continue with Google
            </Button>

            {/* DIVIDER */}

            <div className="relative mb-6">

              <div className="absolute inset-0 flex items-center">

                <span className="w-full border-t" />

              </div>

              <div className="relative flex justify-center text-xs uppercase">

                <span className="bg-background px-3 text-muted-foreground">

                  Or continue with email

                </span>

              </div>

            </div>

            {/* FORM */}

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
                  {...register("email")}
                  className="mt-2 h-11"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <div>

                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative mt-2">

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-11 pr-11"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              </div>

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-muted-foreground">

                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />

                  Remember me

                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </Button>

            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">

              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:underline"
              >
                Create one
              </Link>

            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}

export default SignIn;