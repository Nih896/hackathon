import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getExpenseSummary(eventId) {
  if (!eventId) throw new Error("eventId is required");

  const snapshot = await getDocs(
    collection(db, "events", eventId, "SubEvents")
  );

  let totalExpense = 0;
  const memberExpenses = {}; // { userId: { name, amount } }

  snapshot.forEach((doc) => {
    const sub = doc.data();

    if (sub.type === "expense") {
      const { payerId, amount, payerName } = sub;
      if (!payerId || !amount) return;

      // 総支出を加算
      totalExpense += amount;

      // 支払った人ごとに加算
      if (!memberExpenses[payerId]) {
        memberExpenses[payerId] = { name: payerName || payerId, amount: 0 };
      }
      memberExpenses[payerId].amount += amount;
    }
  });

  return { totalExpense, memberExpenses };
}
