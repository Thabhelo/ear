import { FirebaseError } from "firebase/app";

/** Maps Firebase auth errors to copy people can act on. */
export function friendlyAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "That email doesn't look right. Check it and try again.";
      case "auth/user-disabled":
        return "This account is paused. Contact us if you think that's a mistake.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Email or password didn't match. Try again or reset your password.";
      case "auth/email-already-in-use":
        return "That email already has an account. Sign in instead.";
      case "auth/weak-password":
        return "Choose a password with at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many tries. Wait a minute and try again.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled.";
      case "auth/popup-blocked":
        return "Your browser blocked the sign-in window. Allow pop-ups and try again.";
      case "auth/account-exists-with-different-credential":
        return "That email is already linked to a different sign-in method. Try the other option.";
      case "auth/credential-already-in-use":
        return "That sign-in method is already linked to another account.";
      case "auth/requires-recent-login":
        return "For security, sign out and sign in again, then retry.";
      case "auth/operation-not-allowed":
        return "That sign-in option isn't turned on yet. Try Google, or check back soon.";
      case "auth/network-request-failed":
        return "We couldn't reach Ear. Check your connection and try again.";
      default:
        break;
    }
  }

  if (error instanceof Error && error.message && !error.message.startsWith("Firebase:")) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
