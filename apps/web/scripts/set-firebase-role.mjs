import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [identifier, role] = process.argv.slice(2);
const allowedRoles = new Set(["user", "host", "admin"]);

if (!identifier || !allowedRoles.has(role)) {
  console.error("Usage: npm run auth:set-role -- <firebase-uid-or-email> <user|host|admin>");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const credential =
  clientEmail && privateKey && projectId
    ? cert({ projectId, clientEmail, privateKey })
    : applicationDefault();

const app =
  getApps()[0] ??
  initializeApp({
    credential,
    ...(projectId ? { projectId } : {})
  });

const auth = getAuth(app);
const user = identifier.includes("@")
  ? await auth.getUserByEmail(identifier)
  : await auth.getUser(identifier);
const uid = user.uid;
const claims = { ...(user.customClaims ?? {}) };
delete claims.host;
delete claims.admin;
delete claims.roles;

if (role === "user") {
  delete claims.role;
} else {
  claims.role = role;
}

await auth.setCustomUserClaims(uid, claims);
console.log(`Set Firebase role=${role} for uid=${uid}. The user must refresh their ID token.`);
