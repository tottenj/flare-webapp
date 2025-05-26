import {
  doc,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  DocumentData,
  DocumentSnapshot,
  setDoc,
  WithFieldValue,
  WhereFilterOp,
  collection,
  QueryConstraint,
  where,
  query,
  getDocs,
  OrderByDirection,
  orderBy,
  limit,
} from 'firebase/firestore';

export async function getDocument<AppModelType, DbModelType extends DocumentData>(
  firestore: Firestore,
  path: string,
  converter: FirestoreDataConverter<AppModelType, DbModelType>
): Promise<DocumentSnapshot<AppModelType, DbModelType>> {
  const ref = doc(firestore, path).withConverter(converter);
  const snapshot = await getDoc(ref);
  return snapshot;
}

export async function addDocument<AppModelType, DbModelType extends DocumentData = DocumentData>(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<AppModelType>,
  converter: FirestoreDataConverter<AppModelType, DbModelType>,
  options?: { merge?: boolean }
): Promise<void>;

export async function addDocument(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<DocumentData>,
  options?: { merge?: boolean }
): Promise<void>;

export async function addDocument<AppModelType, DbModelType extends DocumentData = DocumentData>(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<any>,
  converterOrOptions?: FirestoreDataConverter<AppModelType, DbModelType> | { merge?: boolean },
  maybeOptions?: { merge?: boolean }
): Promise<void> {
  let ref;
  let options: { merge?: boolean } | undefined;

  if (typeof converterOrOptions === 'object' && 'toFirestore' in converterOrOptions) {
    ref = doc(firestore, path).withConverter(converterOrOptions);
    options = maybeOptions;
  } else {
    ref = doc(firestore, path);
    options = converterOrOptions as { merge?: boolean };
  }

  if (options) {
    await setDoc(ref, data, options); // ✅ pass when defined
  } else {
    await setDoc(ref, data); // ✅ omit the 3rd arg when undefined
  }
}

export type WhereClause = [field: string, op: WhereFilterOp, value: any];
export interface QueryOptions {
  orderByField?: string;
  orderDirection?: OrderByDirection;
  limit?: number;
}

export async function getCollectionByFields<AppModelType, DbModelType extends DocumentData>(
  firestore: Firestore,
  collectionPath: string,
  whereClauses: WhereClause[],
  converter: FirestoreDataConverter<AppModelType, DbModelType>,
  options?: QueryOptions
): Promise<AppModelType[]> {
  const ref = collection(firestore, collectionPath).withConverter(converter);

  const constraints: QueryConstraint[] = whereClauses.map(([field, op, value]) =>
    where(field, op, value)
  );

  if (options?.orderByField) {
    constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
  }

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}
