import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  Laptop,
  Loader2,
  Palette,
  RefreshCcw,
  Scale,
  Sparkles,
  Sprout,
  TriangleAlert,
  Wrench,
} from "lucide-react";

const categoryIcons = {
  Technology: Laptop,
  Medicine: HeartPulse,
  Law: Scale,
  Business: BriefcaseBusiness,
  Engineering: Wrench,
  "Creative Arts": Palette,
  Education: GraduationCap,
  Finance: Landmark,
  Agriculture: Sprout,
};

const categoryStyles = {
  Technology:
    "from-blue-600 to-cyan-500 shadow-blue-600/20",
  Medicine:
    "from-rose-600 to-pink-500 shadow-rose-600/20",
  Law:
    "from-violet-600 to-purple-500 shadow-violet-600/20",
  Business:
    "from-emerald-600 to-teal-500 shadow-emerald-600/20",
  Engineering:
    "from-amber-600 to-orange-500 shadow-amber-600/20",
  "Creative Arts":
    "from-pink-600 to-fuchsia-500 shadow-pink-600/20",
  Education:
    "from-indigo-600 to-blue-500 shadow-indigo-600/20",
  Finance:
    "from-slate-700 to-blue-700 shadow-slate-700/20",
  Agriculture:
    "from-green-600 to-lime-500 shadow-green-600/20",
};

function CareerQuiz() {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuiz() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `${import.meta.env.BASE_URL}data/careerQuiz.json`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Quiz request failed with status ${response.status}.`
          );
        }

        const data = await response.json();

        const hasQuestions =
          Array.isArray(data?.questions) &&
          data.questions.length > 0;

        const hasResults =
          data?.results &&
          typeof data.results === "object";

        if (!hasQuestions || !hasResults) {
          throw new Error(
            "The quiz data is missing questions or results."
          );
        }

        setQuizData(data);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load career quiz:",
          error
        );

        setLoadError(
          "The career quiz could not be loaded. Check that public/data/careerQuiz.json exists and contains valid JSON."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

  const currentQuestion =
    quizData?.questions?.[currentQuestionIndex];

  const selectedOptionId = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";

  const progress = quizData
    ? Math.round(
        ((currentQuestionIndex + 1) /
          quizData.questions.length) *
          100
      )
    : 0;

  const rankedResults = useMemo(() => {
    if (!quizData) {
      return [];
    }

    const categories = Object.keys(
      quizData.results
    );

    const totalScores = Object.fromEntries(
      categories.map((category) => [
        category,
        0,
      ])
    );

    const maximumScores = Object.fromEntries(
      categories.map((category) => [
        category,
        0,
      ])
    );

    quizData.questions.forEach((question) => {
      categories.forEach((category) => {
        const maximumForQuestion = Math.max(
          0,
          ...question.options.map(
            (option) =>
              Number(
                option.scores?.[category] || 0
              )
          )
        );

        maximumScores[category] +=
          maximumForQuestion;
      });

      const answerId = answers[question.id];

      const selectedOption =
        question.options.find(
          (option) => option.id === answerId
        );

      if (!selectedOption) {
        return;
      }

      Object.entries(
        selectedOption.scores || {}
      ).forEach(([category, points]) => {
        if (
          Object.hasOwn(totalScores, category)
        ) {
          totalScores[category] += Number(
            points || 0
          );
        }
      });
    });

    return categories
      .map((category) => ({
        category,
        score: totalScores[category],
        percentage:
          maximumScores[category] > 0
            ? Math.round(
                (totalScores[category] /
                  maximumScores[category]) *
                  100
              )
            : 0,
        ...quizData.results[category],
      }))
      .sort((firstResult, secondResult) => {
        if (
          secondResult.percentage !==
          firstResult.percentage
        ) {
          return (
            secondResult.percentage -
            firstResult.percentage
          );
        }

        return (
          secondResult.score -
          firstResult.score
        );
      });
  }, [answers, quizData]);

  function handleStart() {
    setStarted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSelectOption(optionId) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }));
  }

  function handleNext() {
    if (!selectedOptionId) {
      toast.info(
        "Choose an answer before continuing."
      );

      return;
    }

    const isLastQuestion =
      currentQuestionIndex ===
      quizData.questions.length - 1;

    if (isLastQuestion) {
      setCompleted(true);
    } else {
      setCurrentQuestionIndex(
        (currentIndex) =>
          currentIndex + 1
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleBack() {
    if (currentQuestionIndex === 0) {
      return;
    }

    setCurrentQuestionIndex(
      (currentIndex) => currentIndex - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleRestart() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCompleted(false);
    setStarted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleRetryLoading() {
    setReloadKey(
      (currentValue) => currentValue + 1
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>

          <p className="mt-5 font-semibold">
            Loading career quiz...
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Preparing your questions.
          </p>
        </div>
      </main>
    );
  }

  if (loadError || !quizData) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl border bg-card p-8 text-center shadow-xl shadow-blue-950/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            Quiz unavailable
          </h1>

          <p className="mt-3 leading-7 text-muted-foreground">
            {loadError}
          </p>

          <button
            type="button"
            onClick={handleRetryLoading}
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen overflow-hidden">
        <section className="relative isolate overflow-hidden border-b">
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-100/90 via-background to-indigo-100/70 dark:from-blue-950/40 dark:via-background dark:to-indigo-950/30" />

          <div className="absolute -left-28 top-0 -z-10 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="absolute -right-28 bottom-0 -z-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-xl dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                Discover what suits you
              </div>

              <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Find career areas that match your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  interests and strengths.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                {quizData.description}
              </p>

              <button
                type="button"
                onClick={handleStart}
                className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Career Quiz
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-5 text-sm text-muted-foreground">
                {quizData.questions.length} questions ·
                No account required
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/60 bg-white/65 p-7 shadow-2xl shadow-blue-950/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/65 sm:p-9">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                  <Compass className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  What the quiz explores
                </h2>

                <div className="mt-6 space-y-4">
                  {[
                    "Activities you naturally enjoy",
                    "Subjects and problems that interest you",
                    "The working environments you prefer",
                    "The kind of impact you want to make",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border bg-background/70 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                      <span className="text-sm font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs leading-6 text-muted-foreground">
                  {quizData.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (completed) {
    const topResult = rankedResults[0];
    const secondResult = rankedResults[1];
    const TopIcon =
      categoryIcons[topResult.category] ||
      Compass;

    return (
      <main className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-100/70 via-background to-indigo-100/60 py-14 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/20 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border bg-card shadow-2xl shadow-blue-950/10">
            <div
              className={`bg-gradient-to-br ${
                categoryStyles[
                  topResult.category
                ] ||
                "from-blue-600 to-indigo-600"
              } px-6 py-12 text-center text-white sm:px-10`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl">
                <TopIcon className="h-8 w-8" />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-white/75">
                Your strongest match
              </p>

              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                {topResult.category}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                {topResult.description}
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                <section>
                  <h2 className="text-2xl font-bold">
                    Careers you could explore
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {topResult.careers.map(
                      (career) => (
                        <div
                          key={career}
                          className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4"
                        >
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />

                          <span className="font-semibold">
                            {career}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={`/articles?category=${encodeURIComponent(
                        topResult.category
                      )}`}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                      Explore {topResult.category} Guides
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-background px-6 text-sm font-semibold transition hover:bg-accent"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Retake Quiz
                    </button>
                  </div>
                </section>

                <aside className="rounded-2xl border bg-muted/35 p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                    Your match overview
                  </p>

                  <div className="mt-6 space-y-5">
                    {rankedResults
                      .slice(0, 3)
                      .map((result, index) => {
                        const ResultIcon =
                          categoryIcons[
                            result.category
                          ] || Compass;

                        return (
                          <div
                            key={result.category}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <ResultIcon className="h-4 w-4" />
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    {result.category}
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    {index === 0
                                      ? "Strongest match"
                                      : index === 1
                                        ? "Second match"
                                        : "Another possibility"}
                                  </p>
                                </div>
                              </div>

                              <span className="text-sm font-bold text-primary">
                                {result.percentage}%
                              </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${result.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {secondResult && (
                    <div className="mt-7 rounded-xl border bg-background p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Also consider
                      </p>

                      <p className="mt-2 font-bold">
                        {secondResult.category}
                      </p>

                      <Link
                        to={`/articles?category=${encodeURIComponent(
                          secondResult.category
                        )}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        View related guides
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </aside>
              </div>

              <p className="mt-10 border-t pt-6 text-center text-xs leading-6 text-muted-foreground">
                {quizData.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-100/70 via-background to-indigo-100/60 py-12 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/20 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-7">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-primary">
              Question {currentQuestionIndex + 1} of{" "}
              {quizData.questions.length}
            </span>

            <span className="text-muted-foreground">
              {progress}% complete
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Quiz progress"
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-primary/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <section className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-2xl" />

          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="h-6 w-6" />
            </div>

            <h1 className="mt-6 text-2xl font-bold leading-tight sm:text-3xl">
              {currentQuestion.question}
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Choose the answer that feels most natural
              to you.
            </p>

            <div className="mt-8 grid gap-4">
              {currentQuestion.options.map(
                (option, index) => {
                  const isSelected =
                    selectedOptionId === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        handleSelectOption(
                          option.id
                        )
                      }
                      className={
                        isSelected
                          ? "flex items-start gap-4 rounded-2xl border-2 border-primary bg-primary/10 p-5 text-left shadow-md transition"
                          : "flex items-start gap-4 rounded-2xl border bg-background/75 p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/5 hover:shadow-md"
                      }
                    >
                      <span
                        className={
                          isSelected
                            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
                            : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold text-muted-foreground"
                        }
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="flex-1 pt-1 text-sm font-semibold leading-6 sm:text-base">
                        {option.text}
                      </span>

                      {isSelected && (
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={
                  currentQuestionIndex === 0
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedOptionId}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentQuestionIndex ===
                quizData.questions.length - 1
                  ? "View My Result"
                  : "Continue"}

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CareerQuiz;