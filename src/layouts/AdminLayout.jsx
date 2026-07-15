import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">
          Career Compass Admin
        </h1>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}