import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Bookmark,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Loader2,
  Route,
} from "lucide-react";

import { signUpSchema } from "@/validation/authSchema";
import {
  signInWithGoogle,
  signUp,
} from "@/services/authService";
import { setUser } from "@/store/authSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
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
  );
}

function getAuthenticationErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/weak-password":
      return "Choose a stronger password with at least 6 characters.";

    case "auth/network-request-failed":
      return "Check your internet connection and try again.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window.";

    case "auth/cancelled-popup-request":
      return "The Google sign-in request was cancelled.";

    case "permission-denied":
      return "Your account was created, but the profile could not be saved. Check your Firestore rules.";

    default:
      return (
        error?.message ||
        "We could not create your account. Please try again."
      );
  }
}

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeAction, setActiveAction] =
    useState(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = activeAction !== null;

  function saveUserToRedux(user) {
    dispatch(
      setUser({
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      })
    );
  }

  async function onSubmit(values) {
    try {
      setActiveAction("email");

      const user = await signUp(
        values.fullName,
        values.email,
        values.password
      );

      saveUserToRedux(user);

      toast.success(
        `Welcome to Career Compass${
          user.displayName
            ? `, ${user.displayName.split(" ")[0]}`
            : ""
        }!`
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Email signup failed:",
        error?.code,
        error?.message
      );

      toast.error(
        getAuthenticationErrorMessage(error)
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function handleGoogleSignUp() {
    try {
      setActiveAction("google");

      const user = await signInWithGoogle();

      saveUserToRedux(user);

      toast.success(
        "Welcome to Career Compass!"
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Google signup failed:",
        error?.code,
        error?.message
      );

      toast.error(
        getAuthenticationErrorMessage(error)
      );
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <main className="grid min-h-dvh bg-slate-50 lg:grid-cols-[1.05fr_0.95fr] dark:bg-background">
      {/* Desktop brand panel */}
      <section className="relative hidden overflow-hidden bg-[#2563EB] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-900/30 blur-3xl" />

        <Link
          to="/"
          className="relative z-10 flex w-fit items-center gap-3"
        >
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
            <Compass className="h-7 w-7" />
          </div>

          <div>
            <p className="text-2xl font-bold">
              Career Compass
            </p>

            <p className="text-sm text-blue-100">
              Find direction. Build your future.
            </p>
          </div>
        </Link>

        <div className="relative z-10 max-w-xl">
          <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            Your career journey starts here
          </p>

          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Make confident choices about your future.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
            Explore career paths, understand the
            skills they require, and save useful
            guidance as you plan your next move.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-2.5">
                <Route className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Explore clear career paths
                </p>

                <p className="text-sm text-blue-100">
                  Learn about roles, education routes,
                  and required skills.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-2.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Make informed decisions
                </p>

                <p className="text-sm text-blue-100">
                  Understand what different careers
                  actually involve.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-2.5">
                <Bookmark className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Save useful guidance
                </p>

                <p className="text-sm text-blue-100">
                  Bookmark articles and return to them
                  whenever you need.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-blue-100">
          © {new Date().getFullYear()} Career Compass
        </p>
      </section>

      {/* Signup section */}
      <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-16">
        <div className="w-full max-w-xl">
          {/* Mobile branding */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="rounded-xl bg-blue-600 p-2.5 text-white">
              <Compass className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xl font-bold">
                Career Compass
              </p>

              <p className="text-xs text-muted-foreground">
                Find direction. Build your future.
              </p>
            </div>
          </Link>

          <Card className="overflow-hidden border-border/70 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <CardHeader className="space-y-2 px-6 pb-4 pt-7 text-center sm:px-8 sm:pt-8">
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </CardTitle>

              <CardDescription className="text-sm sm:text-base">
                Join Career Compass and start exploring
                your future.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="h-12 w-full gap-3"
              >
                {activeAction === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}

                {activeAction === "google"
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </Button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Or use your email
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Full name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full name
                  </Label>

                  <Input
                    id="fullName"
                    type="text"
                    placeholder="e.g. Aisha Wanjiku"
                    autoComplete="name"
                    disabled={isLoading}
                    aria-invalid={Boolean(
                      errors.fullName
                    )}
                    {...register("fullName")}
                    className="h-12"
                  />

                  {errors.fullName && (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                    className="h-12"
                  />

                  {errors.email && (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      aria-invalid={Boolean(
                        errors.password
                      )}
                      {...register("password")}
                      className="h-12 pr-12"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={isLoading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {errors.password ? (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.password.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Use at least 6 characters.
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm password
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password again"
                      autoComplete="new-password"
                      disabled={isLoading}
                      aria-invalid={Boolean(
                        errors.confirmPassword
                      )}
                      {...register("confirmPassword")}
                      className="h-12 pr-12"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      disabled={isLoading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmed password"
                          : "Show confirmed password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {
                        errors.confirmPassword
                          .message
                      }
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full bg-[#2563EB] text-base font-semibold hover:bg-blue-700"
                >
                  {activeAction === "email" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default SignUp;