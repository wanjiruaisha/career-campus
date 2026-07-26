import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import {
  Bookmark,
  BookOpen,
  Compass,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Sun,
  UserPlus,
  X,
} from "lucide-react";

import { logout } from "@/services/authService";
import { clearUser } from "@/store/authSlice";
import { Button } from "@/components/ui/button";

const publicLinks = [
  {
    label: "Articles",
    path: "/articles",
    icon: BookOpen,
  },
  {
    label: "Career Quiz",
    path: "/career-quiz",
    icon: Compass,
  },
  {
    label: "Contact",
    path: "/contact",
    icon: Mail,
  },
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { resolvedTheme, setTheme } = useTheme();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const displayName = user?.displayName?.trim() || "Career Explorer";

  const firstName = displayName.split(" ")[0] || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  function getNavLinkClasses({ isActive }) {
    return [
      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    ].join(" ");
  }

  function getMobileLinkClasses({ isActive }) {
    return [
      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isActive
        ? "bg-primary text-primary-foreground shadow-md shadow-blue-600/20"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    ].join(" ");
  }

  async function handleLogout() {
    try {
      setLogoutLoading(true);

      await logout();

      dispatch(clearUser());

      toast.success("You have been signed out.");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("We could not sign you out. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          aria-label="Career Compass homepage"
          className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
            <Compass className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight sm:text-xl">
              Career Compass
            </p>

            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Find direction. Build your future.
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          <NavLink to="/" end className={getNavLinkClasses}>
            Home
          </NavLink>

          {publicLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={getNavLinkClasses}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <NavLink to="/bookmarks" className={getNavLinkClasses}>
              Bookmarks
            </NavLink>
          )}

          {isAuthenticated && isAdmin && (
            <NavLink to="/admin" className={getNavLinkClasses}>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="rounded-xl"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {authLoading ? (
            <div className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking account...
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="ml-1 flex items-center gap-3 rounded-xl border bg-card px-3 py-2 shadow-sm">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${displayName} profile`}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {initials || "CC"}
                  </div>
                )}

                <div className="max-w-32">
                  <p className="truncate text-sm font-semibold">{firstName}</p>

                  <p className="truncate text-xs capitalize text-muted-foreground">
                    {isAdmin ? "Administrator" : "Member"}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="rounded-xl"
              >
                {logoutLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="rounded-xl"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((currentValue) => !currentValue)}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="rounded-xl"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t bg-background/95 px-4 py-4 shadow-xl backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl">
            {isAuthenticated && !authLoading && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border bg-gradient-to-br from-primary/10 to-indigo-500/5 p-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${displayName} profile`}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {initials || "CC"}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold">{displayName}</p>

                  <p className="truncate text-sm capitalize text-muted-foreground">
                    {isAdmin ? "Career Compass administrator" : user?.email}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <NavLink to="/" end className={getMobileLinkClasses}>
                <Compass className="h-5 w-5" />
                Home
              </NavLink>

              {publicLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={getMobileLinkClasses}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </NavLink>
                );
              })}

              {isAuthenticated && (
                <NavLink to="/bookmarks" className={getMobileLinkClasses}>
                  <Bookmark className="h-5 w-5" />
                  Bookmarks
                </NavLink>
              )}

              {isAuthenticated && isAdmin && (
                <NavLink to="/admin" className={getMobileLinkClasses}>
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Dashboard
                </NavLink>
              )}
            </div>

            <div className="my-4 border-t" />

            {authLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking your account...
              </div>
            ) : isAuthenticated ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="h-11 w-full rounded-xl"
              >
                {logoutLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sign Out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/signin"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-semibold transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
