import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getSettlement(eventId) {
  if (!eventId) {
    throw new Error("eventId is required");
  }

  const snapshot = await getDocs(
    collection(db, "events", eventId, "SubEvents")
  );
snapshot.forEach(doc => console.log(doc.id, doc.data()));

  const totals = {};

  snapshot.forEach((doc) => {
    const sub = doc.data();
    const members = sub.members;
    const type = sub.type;
    const amount = sub.amount;

    if (!members || !type || amount === null) return;

    // 支出
    if (type === "expense") {
      const payerId = sub.payerId;
      for (const key in members) {
        const { id, name, shareAmount } = members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (id === payerId) {
          totals[id].total += amount - shareAmount;
        } else {
          totals[id].total -= shareAmount;
        }
      }

    // 収入
    } else if (type === "income") {
      const receiverId = sub.receiverId;
      for (const key in members) {
        const { id, name, shareAmount } = members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (id === receiverId) {
          totals[id].total -= amount + shareAmount;
        } else {
          totals[id].total += shareAmount;
        }
      }

    // 支払い
    } else if (type === "payment") {
      const payerId = sub.payerId;
      const receiverId = sub.receiverId;
      for (const key in members) {
        const { id, name, shareAmount } = members[key];
        if (!totals[id]) totals[id] = { name, total: 0 };

        if (id === payerId) {
          totals[id].total -= shareAmount;
        } else if (id === receiverId) {
          totals[id].total += shareAmount;
        }
      }
    }
  });

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

  return { totals, settlements };
}
