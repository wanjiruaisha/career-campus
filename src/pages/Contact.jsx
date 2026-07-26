import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Compass,
  Copy,
  HelpCircle,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONTACT_EMAIL = "wanjiruaisha30@gmail.com";

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "Your name is too long."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  subject: z
    .string()
    .trim()
    .min(3, "Enter a subject.")
    .max(120, "The subject is too long."),

  message: z
    .string()
    .trim()
    .min(10, "Your message should have at least 10 characters.")
    .max(1500, "Your message should not exceed 1,500 characters."),
});

const supportOptions = [
  {
    title: "Career guidance",
    description:
      "Ask questions about career paths, skills, qualifications, or education routes.",
    icon: Compass,
    iconStyle:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    title: "Website support",
    description:
      "Report an issue with articles, bookmarks, your account, or another feature.",
    icon: HelpCircle,
    iconStyle:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    title: "Suggestions",
    description:
      "Recommend a career guide, improvement, or useful topic for Career Compass.",
    icon: MessageCircle,
    iconStyle:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
];

function Contact() {
  const [sending, setSending] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),

    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

const message =
  useWatch({
    control,
    name: "message",
    defaultValue: "",
  }) || "";
  async function onSubmit(values) {
    try {
      setSending(true);

      const emailSubject = encodeURIComponent(
        `[Career Compass] ${values.subject}`
      );

      const emailBody = encodeURIComponent(
        `Hello Career Compass,

My name is ${values.fullName}.

${values.message}

Reply email: ${values.email}`
      );

      const mailtoLink =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${emailSubject}` +
        `&body=${emailBody}`;

      window.location.href = mailtoLink;

      toast.success("Your email app is opening.");

      reset();
    } catch (error) {
      console.error("Failed to prepare message:", error);

      toast.error(
        "We could not prepare your message. Please try again."
      );
    } finally {
      window.setTimeout(() => {
        setSending(false);
      }, 700);
    }
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);

      setEmailCopied(true);

      toast.success("Email address copied.");

      window.setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy email:", error);

      toast.error("Could not copy the email address.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-100/90 via-background to-indigo-100/70 dark:from-blue-950/40 dark:via-background dark:to-indigo-950/30" />

        <div className="absolute -left-28 top-0 -z-10 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -right-28 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-xl dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />

            We would love to hear from you
          </div>

          <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-primary shadow-xl shadow-blue-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65">
            <Mail className="h-8 w-8" />
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Have a question about your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              career journey?
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Send us your question, feedback, or career-guide
            suggestion. Career Compass is here to make your next
            step feel clearer.
          </p>
        </div>
      </section>

      {/* Support categories */}
      <section className="border-b bg-muted/35 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {supportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <article
                  key={option.title}
                  className="rounded-2xl border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-blue-950/5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${option.iconStyle}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    {option.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute left-0 top-20 -z-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          {/* Contact information */}
          <aside className="space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Get in touch
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Let’s talk about what you need.
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                Include as much detail as possible so your question
                is easier to understand and respond to.
              </p>
            </div>

            {/* Glass email card */}
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl shadow-blue-950/15 dark:border-white/10">
              <div className="rounded-[1.35rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Mail className="h-6 w-6" />
                </div>

                <p className="mt-5 text-sm font-medium text-blue-100">
                  Email Career Compass
                </p>

                <p className="mt-1 break-all text-lg font-bold">
                  {CONTACT_EMAIL}
                </p>

                <Button
                  type="button"
                  onClick={handleCopyEmail}
                  className="mt-5 bg-white text-blue-700 hover:bg-blue-50"
                >
                  {emailCopied ? (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}

                  {emailCopied ? "Copied" : "Copy email"}
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold">
                    Response expectations
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Messages are reviewed as soon as possible.
                    Detailed questions may require more time to
                    respond to properly.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-primary/5 p-6">
              <h3 className="font-bold">
                Before sending your message
              </h3>

              <div className="mt-4 space-y-3">
                {[
                  "Use a clear and specific subject.",
                  "Explain the situation or question fully.",
                  "Avoid including passwords or private account details.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-2xl" />

            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-slate-900/65">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  Send a message
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  How can we help?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Complete the form and your device’s email
                  application will prepare the message for you.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full name
                    </Label>

                    <Input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Solana Johnson"
                      autoComplete="name"
                      disabled={sending}
                      aria-invalid={Boolean(errors.fullName)}
                      className="h-12 bg-background/80"
                      {...register("fullName")}
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
                      disabled={sending}
                      aria-invalid={Boolean(errors.email)}
                      className="h-12 bg-background/80"
                      {...register("email")}
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
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject
                  </Label>

                  <Input
                    id="subject"
                    type="text"
                    placeholder="What would you like help with?"
                    disabled={sending}
                    aria-invalid={Boolean(errors.subject)}
                    className="h-12 bg-background/80"
                    {...register("subject")}
                  />

                  {errors.subject && (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="message">
                      Message
                    </Label>

                    <span className="text-xs text-muted-foreground">
                      {message.length}/1500
                    </span>
                  </div>

                  <textarea
                    id="message"
                    rows={7}
                    maxLength={1500}
                    placeholder="Tell us about your question, suggestion, or issue..."
                    disabled={sending}
                    aria-invalid={Boolean(errors.message)}
                    className="min-h-[180px] w-full resize-y rounded-xl border border-input bg-background/80 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("message")}
                  />

                  {errors.message && (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Preparing message...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Do not include passwords, payment information, or
                  other sensitive personal details.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-muted/35 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="rounded-[2rem] border bg-card px-6 py-12 shadow-xl shadow-blue-950/5 sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Looking for career information?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
              Explore Career Compass guides before sending your
              question. The answer may already be waiting for you.
            </p>

            <Link
              to="/articles"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore Career Guides

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;