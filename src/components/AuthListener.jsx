import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  getUserProfile,
  observeAuthState,
} from "@/services/authService";

import {
  clearUser,
  setLoading,
  setUser,
} from "@/store/authSlice";

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = observeAuthState(
      async (firebaseUser) => {
        if (!firebaseUser) {
          dispatch(clearUser());
          return;
        }

        try {
          dispatch(setLoading(true));

          const profile = await getUserProfile(
            firebaseUser.uid
          );

          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName:
                profile?.fullName ||
                firebaseUser.displayName ||
                "",
              photoURL:
                profile?.photoURL ||
                firebaseUser.photoURL ||
                "",
              role: profile?.role || "user",
            })
          );
        } catch (error) {
          console.error(
            "Failed to restore user:",
            error
          );

          dispatch(clearUser());
        }
      }
    );

    return unsubscribe;
  }, [dispatch]);

  return null;
}

export default AuthListener;