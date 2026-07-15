import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Creates a Firestore document if one doesn't already exist.
 */
async function createUserDocument(user) {
  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  }

  const userData = {
    uid: user.uid,
    fullName: user.displayName || "",
    email: user.email,
    photoURL: user.photoURL || "",
    role: "user",
    bookmarks: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, userData);

  return userData;
}

/**
 * Email & Password Sign Up
 */
export async function signUp(fullName, email, password) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: fullName,
  });

  await createUserDocument({
    ...user,
    displayName: fullName,
  });

  return user;
}

/**
 * Email & Password Sign In
 */
export async function signIn(email, password) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

/**
 * Google Sign In
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(
    auth,
    googleProvider
  );

  const user = result.user;

  await createUserDocument(user);

  return user;
}

/**
 * Logout
 */
export function logout() {
  return signOut(auth);
}

/**
 * Forgot Password
 */
export function resetPassword(email) {
  return sendPasswordResetEmail(
    auth,
    email
  );
}

/**
 * Authentication Listener
 */
export function observeAuthState(callback) {
  return onAuthStateChanged(
    auth,
    callback
  );
}