import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

import db from "./firebase";
import './App.css';
import './Event.css';
import { getSettlement} from "./calculation/getSettlement";

function EventSummary({ id }) { 
  

  const [totals, setTotals] = useState({});
  const [settlements, setSettlements] = useState([]);
  
   useEffect(() => {
          console.log("id:", id); // ← ここで確認
      console.log("settlements:", settlements);

    async function fetchData() {


      const { totals, settlements } = await getSettlement(id);
      setTotals(totals);
      setSettlements(settlements);
    }
    fetchData();
  }, [id]);

  return (    
    <div className="Event-summary-box">

      <div className="Event-seisan">
        <h2 className="Event-summary-h2">精算</h2>
        <h3 className="Event-summary-h3">おすすめの計算方法</h3>

      <div style={{ flex: 1 }}>
        {settlements.length === 0 ? (
          <p>清算はありません</p>
        ) : (
          <div>
            {settlements.map((s, idx) => (
              <div key={idx}
              className="Summary-seisan-card"
              >
                <p className="Summary-member">
                {s.fromName} → ￥{s.amount} → {s.toName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>


      </div>
      <div className="Event-kasikari">
        <h2 className="Event-summary-h2-1">貸し借り</h2>

      {/* 右：貸し借り */}
      <div style={{ flex: 1 }}>
        <div>
          {Object.entries(totals).map(([id, { name, total }]) => (
            <div key={id} className="Summary-kasikari-card">
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
                {total >= 0 ? `+${total}￥` : `${total}￥`}
              </span>
            </div>
          ))}
        </div>
      </div>


      </div>
    </div>
  );
}

export default EventSummary;