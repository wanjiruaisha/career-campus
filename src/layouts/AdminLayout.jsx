import { Outlet } from "react-router-dom";

import Sidebar from "@/components/admin/Sidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <main
        className="
          min-h-screen
          p-6
          md:ml-72
          lg:p-8
        "
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;