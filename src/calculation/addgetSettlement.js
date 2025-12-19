import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/*
{
  "JPY": {
    totals: { ... },
    settlements: [
      { fromName: "A", toName: "B", amount: 1000 },
      { fromName: "C", toName: "A", amount: 500 }
    ]
  },
*/

export async function addgetSettlement(eventId, events) {
  if (!eventId) {
    throw new Error("eventId is required");
  }

  const snapshot = await getDocs(
    collection(db, "events", eventId, "SubEvents")
  );

  // 通貨ごとの totals を保持するオブジェクト
  const currencyTotals = {};

  snapshot.forEach((doc) => {
    const sub = doc.data();
    const members = sub.members;
    const type = sub.type;
    const amount = sub.amount;
    const currency = sub.currency || "UNKNOWN";

    if (!members || !type || amount === null) return;

    // currencyTotals[currency] を初期化
    if (!currencyTotals[currency]) {
      currencyTotals[currency] = { totals: {}, settlements: [] };
    }

    const totals = currencyTotals[currency].totals;

    // 支出
    if (type === "expense") {
      const payerId = String(sub.payerId);
      for (const key in members) {
        const { id, name, shareAmount } = members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (String(id) === payerId) {
          totals[id].total += amount - shareAmount;
        } else {
          totals[id].total -= shareAmount;
        }
      }

    // 収入
    } else if (type === "income") {
      const receiverId = String(sub.receiverId);
      for (const key in members) {
        const { id, name, shareAmount } = members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (String(id) === receiverId) {
          totals[id].total -= (amount - shareAmount);
        } else {
          totals[id].total += shareAmount;
        }
      }

    // 支払い
    } else if (type === "payment") {
      const payerId = String(sub.payerId);
      const receiverId = String(sub.receiverId);
      for (const key in events?.members) {
        const { id, name} = events?.members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (String(id) === payerId) {
          totals[id].total += amount;
        } else if (String(id) === receiverId) {
          totals[id].total -= amount;
        }
      }
    }
  });

  // 各通貨ごとに settlements を作成
  for (const currency in currencyTotals) {
    const totals = currencyTotals[currency].totals;
  // creditors / debtors
  const creditors = [];
  const debtors = [];

  for (const userId in totals) {
    const { name, total } = totals[userId];
    if (total > 0) creditors.push({ user: userId, name, amount: total });
    else if (total < 0) debtors.push({ user: userId, name, amount: -total });
  }

  // settlements
  const settlements = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i];
    const d = debtors[j];
    const pay = Math.min(c.amount, d.amount);

    settlements.push({
      fromId: d.user,
      fromName: d.name,
      toId: c.user,
      toName: c.name,
      amount: pay,
    });

    c.amount -= pay;
    d.amount -= pay;

    if (c.amount === 0) i++;
    if (d.amount === 0) j++;
  }

  currencyTotals[currency].settlements = settlements;
  }

  return currencyTotals;
}