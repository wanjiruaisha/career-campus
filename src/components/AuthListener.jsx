import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { observeAuthState } from "@/services/authService";

import {
  clearUser,
  setLoading,
  setUser,
} from "@/store/authSlice";

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Wait for Firebase to confirm whether a user is signed in
    dispatch(setLoading(true));

    const unsubscribe = observeAuthState((user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
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