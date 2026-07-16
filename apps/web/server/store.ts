import { randomUUID } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { adminFirestore } from "./firebase";

export type Doc = Record<string, unknown> & { id: string };

export function utcNow(): Date {
  return new Date();
}

/**
 * Converts Firestore Timestamp values to Date so JSON responses serialize
 * them as ISO strings (matching the former FastAPI behavior).
 */
function normalize(data: Record<string, unknown>): Doc {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = value instanceof Timestamp ? value.toDate() : value;
  }
  return result as Doc;
}

/**
 * Thin Firestore data layer, ported from the FastAPI `FirestoreStore`.
 * Documents carry their own `id`, `created_at`, and `updated_at` fields.
 */
export const store = {
  async create(collection: string, payload: Record<string, unknown>): Promise<Doc> {
    const documentId = randomUUID();
    const now = utcNow();
    const document: Doc = {
      id: documentId,
      ...payload,
      created_at: now,
      updated_at: now
    };
    await adminFirestore().collection(collection).doc(documentId).set(document);
    return document;
  },

  async set(collection: string, documentId: string, payload: Record<string, unknown>): Promise<Doc> {
    const now = utcNow();
    const document: Doc = {
      id: documentId,
      ...payload,
      created_at: (payload.created_at as Date | undefined) ?? now,
      updated_at: now
    };
    await adminFirestore().collection(collection).doc(documentId).set(document, { merge: true });
    return document;
  },

  /** Returns the document, or null when it does not exist. */
  async get(collection: string, documentId: string): Promise<Doc | null> {
    const snapshot = await adminFirestore().collection(collection).doc(documentId).get();
    if (!snapshot.exists) return null;
    return normalize(snapshot.data() ?? {});
  },

  /** Updates an existing document; returns null when it does not exist. */
  async update(
    collection: string,
    documentId: string,
    payload: Record<string, unknown>
  ): Promise<Doc | null> {
    const documentRef = adminFirestore().collection(collection).doc(documentId);
    const snapshot = await documentRef.get();
    if (!snapshot.exists) return null;

    await documentRef.update({ ...payload, updated_at: utcNow() });
    const updatedSnapshot = await documentRef.get();
    return normalize(updatedSnapshot.data() ?? {});
  },

  async findByField(
    collection: string,
    field: string,
    value: unknown,
    limit = 25
  ): Promise<Doc[]> {
    const snapshots = await adminFirestore()
      .collection(collection)
      .where(field, "==", value)
      .limit(limit)
      .get();
    return snapshots.docs.map((snapshot) => normalize(snapshot.data() ?? {}));
  },

  async listQueue(limit = 25): Promise<Doc[]> {
    const snapshots = await adminFirestore()
      .collection("queue_entries")
      .where("status", "==", "queued")
      .orderBy("priority_score", "desc")
      .limit(limit)
      .get();
    return snapshots.docs.map((snapshot) => normalize(snapshot.data() ?? {}));
  }
};
