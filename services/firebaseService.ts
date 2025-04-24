import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QuerySnapshot,
  DocumentReference,
  WhereFilterOp,
  CollectionReference,
} from "firebase/firestore";

import type { Result, SortedResult } from "@/types/ranking";

import { useFirestore } from "@/composables/useFirestore";

/**
 * Firestoreにアクセスし、resultをpostします。
 * @param name
 * @param result
 * @param subResult
 * @returns id postしたresultのid
 */
export const addResult = async (
  name: string,
  result: number,
  subResult: number
): Promise<string> => {
  const db = useFirestore();
  const docRef: DocumentReference = await addDoc(
    collection(db, "event_results"),
    {
      name,
      result,
      sub_result: subResult,
      created_at: serverTimestamp(),
    }
  );
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
};

/**
 * Firestoreにアクセスし、result一覧を取得します。
 * ※ result降順とsubResult昇順でソートします。
 * @returns sortedResults: {id: string;}[] result一覧
 */
export const getResults = async (): Promise<SortedResult[]> => {
  const db = useFirestore();
  const querySnapshot: QuerySnapshot = await getDocs(
    collection(db, "event_results")
  );
  const results: SortedResult[] = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as SortedResult
  );

  // 取得した成績一覧情報を順位でソートする
  const sortedResults = results.sort((a, b) => {
    if (a.result === b.result) {
      return a.sub_result - b.sub_result; // resultが同じ場合はsub_resultで昇順ソート
    }
    return b.result - a.result; // resultで降順ソート
  });
  return sortedResults;
};

/**
 * Firestoreにアクセスし、cards一覧を取得します。
 */
export const getCards = async (): Promise<DocumentData[]> => {
  const db = useFirestore();
  const querySnapshot: QuerySnapshot = await getDocs(collection(db, "cards"));
  return querySnapshot.docs.map((doc) => doc.data());
};

/**
 * ターゲットとなるresultのdocument_Idを受け取り、順位を返します。
 * ※ 内部でgetResults()を使用しています。
 * @param targetId ターゲットとなるresultのdocument_Id
 * @returns [rank, totalCount] ランクと総数
 */
export const getRank = async (targetId: string): Promise<[number, number]> => {
  const sortedResults = await getResults();
  // 特定のIDの順位を取得する
  const targetResult = sortedResults.find((score) => score.id === targetId);
  if (!targetResult) {
    throw new Error(`Result with ID ${targetId} not found`);
  }
  const rank = sortedResults.indexOf(targetResult) + 1;
  return [rank, sortedResults.length];
};

/**
 * ターゲットとなるresultのfeeling(感想)をアップデートします。
 * @param targetId ターゲットとなるresultのdocument_Id
 * @param feeling 感想
 */
export const setFeeling = async (
  targetId: string,
  feeling: string
): Promise<void> => {
  const db = useFirestore();
  const userRef = doc(collection(db, "event_results"), targetId);
  await updateDoc(userRef, { feeling });
};

/**
 * 条件に当てはまるdocumentを全て削除する(イベント直前に不要なresultを削除するためのメソッド)
 * 実装例) let isSuccess = await deleteDocuments("event_results", "result", "==", 0);
 * @param collectionName ターゲットとなるcollection(テーブル)名
 * @param fieldName 条件1: field(カラム)名
 * @param operator 条件2: 比較演算子
 * @param value 条件3: 値
 * @returns 実行結果
 */
export const deleteDocuments = async (
  collectionName: string,
  fieldName: string,
  operator: WhereFilterOp, // ここをstringからWhereFilterOpに変更
  value: number
): Promise<boolean> => {
  try {
    const db = useFirestore();
    const collectionRef: CollectionReference = collection(db, collectionName);
    const q = query(collectionRef, where(fieldName, operator, value));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    await runTransaction(db, async (transaction) => {
      querySnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
