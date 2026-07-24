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
 * Creates a Firestore user document when one does not exist.
 */
async function createUserDocument(user, fullName = "") {
  if (!user?.uid) {
    throw new Error(
      "Cannot create user document because the user ID is missing."
    );
  }

  const userReference = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userReference);

  if (userSnapshot.exists()) {
    return {
      id: userSnapshot.id,
      ...userSnapshot.data(),
    };
  }

  const userData = {
    uid: user.uid,
    fullName:
      fullName.trim() ||
      user.displayName ||
      "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    role: "user",
    bookmarks: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userReference, userData);

  return userData;
}

/**
 * Creates an account using email and password.
 */
export async function signUp(
  fullName,
  email,
  password
) {
  const cleanedName = fullName.trim();
  const cleanedEmail = email.trim().toLowerCase();

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanedEmail,
      password
    );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: cleanedName,
  });

  await createUserDocument(user, cleanedName);

  return user;
}

/**
 * Signs in using email and password.
 */
export async function signIn(email, password) {
  const cleanedEmail = email.trim().toLowerCase();

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      cleanedEmail,
      password
    );

  const user = userCredential.user;

  // Creates the Firestore document if this user exists
  // in Authentication but their document is missing.
  await createUserDocument(user);

  return user;
}

/**
 * Signs in using Google.
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
 * Signs out the current user.
 */
export function logout() {
  return signOut(auth);
}

/**
 * Sends a password-reset email.
 */
export function resetPassword(email) {
  const cleanedEmail = email.trim().toLowerCase();

  return sendPasswordResetEmail(
    auth,
    cleanedEmail
  );
}

/**
 * Watches Firebase authentication state.
 */
export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}