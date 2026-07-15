import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Newspaper,
  PlusSquare,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

import { logout } from "@/services/authService";

function Sidebar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();

      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  }

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Articles",
      path: "/admin/articles",
      icon: Newspaper,
    },
    {
      name: "Add Article",
      path: "/admin/articles/new",
      icon: PlusSquare,
    },
  ];

  return (
    <>
      {/* Mobile Button */}

      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border bg-white p-2 shadow-md md:hidden dark:bg-slate-900"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          flex h-screen w-72 flex-col
          border-r bg-white shadow-xl
          transition-transform duration-300
          dark:border-slate-800 dark:bg-slate-950

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Logo */}

        <div className="flex items-center justify-between border-b p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2">

              <GraduationCap className="text-white" />

            </div>

            <div>

              <h2 className="text-lg font-bold">
                Career Compass
              </h2>

              <p className="text-xs text-muted-foreground">
                Admin Panel
              </p>

            </div>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-5">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition

                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />

                {link.name}

              </NavLink>
            );
          })}

        </nav>

        {/* Logout */}

        <div className="border-t p-5">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut size={20} />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;