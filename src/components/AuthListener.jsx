import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { observeAuthState } from "@/services/authService";
import { clearUser, setUser } from "@/store/authSlice";

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return null;
}

export default AuthListener;