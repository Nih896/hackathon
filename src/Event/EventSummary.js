import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";

import "./EventSummary.css";
import { addgetSettlement} from "../calculation/addgetSettlement";
import { CURRENCIES } from"../EventCreatePage/Country"

function EventSummary({ id, events }) {  

  const [settlements, setSettlements] = useState({}); //まとめの計算を保持

  useEffect(() => {
    if (!id) return; // idが無ければ何もしない

    // サブコレクションへの参照を作成
    const subColRef = collection(db, "events", id, "SubEvents");

    const unsubscribe = onSnapshot(subColRef, async () => {
      // SubEvents が変化するたびに getSettlement を呼んで再計算
      const currencyTotals = await addgetSettlement(id, events);
      setSettlements(currencyTotals);
    });

    return () => unsubscribe();
  }, [id]);

  //大イベントのシンボルをとってくる
  const symbol = events.currency ? CURRENCIES[events.currency]?.symbol : "0";

  return (    
    <div className="Summary-flex">

      <div className="Summary-box">
        <h2 className="Summary-h2-seisan">精算</h2>
        <h3 className="Summary-h3">おすすめの計算方法</h3>

        {Object.keys(settlements).length === 0 ? (
          <p className="Summary-nonedata">清算はありません</p>
        ) : (
          Object.entries(settlements).map(([currency, data]) => (
            <div key={currency}>
              <h3 className="Summary-currency">{currency}</h3>
                {data.settlements.map((s, idx) => (
                  <div key={idx} className="Summary-card" >
                    <p className="Summary-member">
                      {s.fromName} → {CURRENCIES[currency].symbol}{s.amount} → {s.toName}
                    </p>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>

      <div className="Summary-box">
        <h2 className="Summary-h2-kasikari">貸し借り</h2>
        {/* 右：貸し借り */}

        {Object.keys(settlements).length === 0 ? (
          events?.members?.map((m) => (
            <li key={m.id} className="Summary-members">
              <span>{m.name}</span>
              <span className="Summary-simbol">0{symbol}</span>
            </li>
          ))
        ) : (
          Object.entries(settlements).map(([currency, data], index, array) => (
            <div key={currency}>
              <h3 className="Summary-currency">{currency}</h3>
              
              {Object.entries(data.totals).map(([id, { name, total }]) => (
                <div key={id} className="Summary-members">
                  <span>{name}</span>
                  <span
                    className={
                      total > 0
                        ? "amount positive"
                        : total < 0
                        ? "amount negative"
                        : "amount zero"
                    }
                  >
                    {total >= 0 ? `+${total}${CURRENCIES[currency].symbol}` : `${total}${CURRENCIES[currency].symbol}`}
                  </span>
                </div>
              ))}
                {index < array.length - 1 && <hr className="Summary-boder" />}
            </div>            
          ))
        )}
      </div>
    </div>
  );
}

export default EventSummary;