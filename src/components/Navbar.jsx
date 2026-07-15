import { Link, NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link
          to="/"
          className="text-xl font-bold"
        >
          Career Compass
        </Link>

        <nav className="flex items-center gap-6">

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/articles">
            Articles
          </NavLink>

          <NavLink to="/coaches">
            Coaches
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>

        </nav>

        <div className="flex items-center gap-3">

          <ThemeToggle />

          <Button
            asChild
            variant="outline"
          >
            <Link to="/signin">
              Sign In
            </Link>
          </Button>

          <Button asChild>
            <Link to="/signup">
              Sign Up
            </Link>
          </Button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;