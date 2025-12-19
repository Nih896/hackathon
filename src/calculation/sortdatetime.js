import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * SubEvents を取得して日付ごとに並べ替え
 * - "YYYY-MM-DD" の日付文字列だけ処理
 * - 同じ日付なら Firestore 取得順（作成順）のまま
 */
export async function sortdatetime(eventId) {
  if (!eventId) throw new Error("eventId is required");

  const snapshot = await getDocs(
    collection(db, "events", eventId, "SubEvents")
  );

  // 取得して { id, ...data, datetime } に変換
  const subevents = snapshot.docs.map((doc) => {
    const data = doc.data();
    const dt = data.date; // "YYYY-MM-DD" 前提
    let datetime = null;
    let displayDate = null;

    if (typeof dt === "string") {
      // "YYYY-MM-DD" → Date（ローカル0時）
      const [y, m, d] = dt.split("-").map(Number);
      datetime = new Date(y, m - 1, d);
    }

    return { id: doc.id, ...data, datetime, displayDate };
  });

  // 日付順にソート（同じ日付は順番維持）
  subevents.sort((a, b) => {
    if (!a.datetime && !b.datetime) return 0;
    if (!a.datetime) return 1; // 日付なしは後ろへ
    if (!b.datetime) return -1;
    return a.datetime - b.datetime;
  });

  // --- 日付ごとにグループ化 ---
  const withDate = subevents.filter((s) => s.datetime);
  const withoutDate = subevents.filter((s) => !s.datetime);

  const grouped = withDate.reduce((acc, se) => {
    const dateKey = se.datetime.toLocaleDateString("ja-JP"); // "2025/10/03"
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(se);
    return acc;
}, {});

  // 日付なしの SubEvent も特別なキーでまとめて追加
  if (withoutDate.length > 0) {
    grouped["日付なし"] = withoutDate;
  }

  return grouped;
}


