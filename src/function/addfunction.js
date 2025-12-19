import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


/**
 * 通貨ごとに支出を集計する
 * {
 *   "JPY": {
 *     totalExpense: number,
 *     memberExpenses: { userId: { name, amount } }
 *   },
 *   ...
 * }
 */

export async function getExpenseSummary(eventId) {
  if (!eventId) throw new Error("eventId is required");

  // イベント本体を取得して members を取る
  const eventSnap = await getDoc(doc(db, "events", eventId));
  if (!eventSnap.exists()) throw new Error("Event not found");

  const eventData = eventSnap.data();
  const members = eventData.members || []; // [{ id, name }, ...] を想定

  // ② サブイベントを全部取得
  const snapshot = await getDocs(
    collection(db, "events", eventId, "SubEvents")
  );

  // 通貨ごとにまとめるための入れ物
  const currencyData = {};

  // ④ サブイベントを走査
  snapshot.forEach((docSnap) => {
    const sub = docSnap.data();

    if (sub.type === "expense") {
      const { payerId, amount, currency } = sub;
      if (!payerId || !amount) return;

      const cur = currency || "未指定"; // 通貨未指定のものも区別

      // 通貨ごとの初期化
      if (!currencyData[cur]) {
        currencyData[cur] = {
          totalExpense: 0,
          memberExpenses: {}
        };

         // メンバーごとの初期化
      members.forEach((m) => {
        currencyData[cur].memberExpenses[m.id] = { name: m.name, amount: 0 };
      });
    }

    currencyData[cur].totalExpense += amount;

      if (!currencyData[cur].memberExpenses[payerId]) {
        currencyData[cur].memberExpenses[payerId] = { name: "不明", amount: 0 };
      }
      currencyData[cur].memberExpenses[payerId].amount += amount;
    }
  });

  return currencyData;
}