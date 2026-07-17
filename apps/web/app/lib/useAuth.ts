"use client";

import { useEffect, useState } from "react";
import {
  getUserProviders,
  getUserRole,
  onFirebaseUserChanged,
  signInWithEmail as firebaseSignInWithEmail,
  signInWithGoogle,
  signOutCurrentUser,
  signUpWithEmail as firebaseSignUpWithEmail,
  userHasPassword,
  userUsesGoogle,
  type ClientRole
} from "./firebase";

export type AuthState = {
  /** null while the first auth check is still running */
  signedIn: boolean | null;
  /** null while custom claims are loading */
  role: ClientRole | null;
  label: string;
  email: string;
  photoUrl: string;
  providers: string[];
  hasPassword: boolean;
  usesGoogle: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<ClientRole | null>(null);
  const [label, setLabel] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [providers, setProviders] = useState<string[]>([]);
  const [hasPassword, setHasPassword] = useState(false);
  const [usesGoogle, setUsesGoogle] = useState(false);

  useEffect(() => {
    return onFirebaseUserChanged((user) => {
      setSignedIn(Boolean(user));
      setRole(user ? null : "user");
      setLabel(user?.displayName || user?.email || "");
      setEmail(user?.email || "");
      setPhotoUrl(user?.photoURL || "");
      const nextProviders = getUserProviders(user);
      setProviders(nextProviders);
      setHasPassword(userHasPassword(user));
      setUsesGoogle(userUsesGoogle(user));
      if (user) {
        void getUserRole(user)
          .then(setRole)
          .catch(() => setRole("user"));
      }
    });
  }, []);

  async function signInGoogle(): Promise<boolean> {
    const user = await signInWithGoogle();
    return Boolean(user);
  }

  async function signInEmail(emailValue: string, password: string): Promise<boolean> {
    await firebaseSignInWithEmail(emailValue, password);
    return true;
  }

  async function signUpEmail(
    emailValue: string,
    password: string,
    displayName?: string
  ): Promise<boolean> {
    await firebaseSignUpWithEmail(emailValue, password, displayName);
    return true;
  }

  return {
    signedIn,
    role,
    label,
    email,
    photoUrl,
    providers,
    hasPassword,
    usesGoogle,
    signInWithGoogle: signInGoogle,
    signInWithEmail: signInEmail,
    signUpWithEmail: signUpEmail,
    signOut: signOutCurrentUser
  };
}
