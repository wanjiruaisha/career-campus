
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowUp,
  Bookmark,
  Compass,
  LayoutDashboard,
  Mail,
} from "lucide-react";

const exploreLinks = [
  {
    label: "Career Guides",
    path: "/articles",
  },
  {
    label: "Contact Us",
    path: "/contact",
  },
];

function Footer() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const isAdmin = user?.role === "admin";

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="relative overflow-hidden border-t bg-slate-950 text-slate-300">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-16">
        {/* Main footer content */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr]">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              to="/"
              aria-label="Career Compass homepage"
              className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/30">
                <Compass className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  Career Compass
                </p>

                <p className="text-xs text-slate-400">
                  Find direction. Build your future.
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Career Compass helps students and career
              explorers understand different
              professions, required skills, education
              pathways, and future opportunities.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Explore
            </h2>

            <nav
              aria-label="Footer explore links"
              className="mt-5 space-y-3"
            >
              <Link
                to="/"
                className="block w-fit text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              {exploreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block w-fit text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Account
            </h2>

            <nav
              aria-label="Footer account links"
              className="mt-5 space-y-3"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookmarks"
                    className="flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
                  >
                    <Bookmark className="h-4 w-4" />
                    My Bookmarks
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block w-fit text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="block w-fit text-sm text-slate-400 transition hover:translate-x-1 hover:text-white"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Support
            </h2>

            <div className="mt-5">
              <Link
                to="/contact"
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-400/30 hover:bg-white/10"
              >
                <div className="mt-0.5 rounded-xl bg-blue-500/15 p-2 text-blue-300">
                  <Mail className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Contact us
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Ask a question or suggest a career
                    guide.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Career
            Compass. Built to make career discovery
            clearer.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to the top"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-300 transition hover:border-blue-400/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

