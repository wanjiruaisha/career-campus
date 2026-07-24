import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Checking your account...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;