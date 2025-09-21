import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

import db from "./firebase";
import './App.css';
import './Event.css';
import SubEventModal from "./SubEventModal"; // ← モーダルコンポーネントをインポート

function EventDetail({ id }) {
  const [subevents, setSubevents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSubevents = async () => {
      try {
        const snap = await getDocs(collection(db, "events", id, "SubEvents"));
        const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log("raw SubEvents:", raw); // ← ここをまず確認！

        // datetime を安全に Date に正規化（なければ null）
        const normalized = raw.map(item => {
          const dt = item.updatedAt;
          let datetime = null;

          if (dt) {
            if (typeof dt.toDate === "function") {
              // Firestore Timestamp
              datetime = dt.toDate();
            } else if (dt instanceof Date) {
              // 既に Date
              datetime = dt;
            } else if (typeof dt === "string") {
              // 文字列 (ISO 等)
              const parsed = new Date(dt);
              datetime = isNaN(parsed.getTime()) ? null : parsed;
            } else if (typeof dt === "number") {
              // ミリ秒やUNIXタイムスタンプ(ミリ秒)の場合
              const parsed = new Date(dt);
              datetime = isNaN(parsed.getTime()) ? null : parsed;
            } else {
              datetime = null;
            }
          }

          // rawType はデバッグ用（consoleで型を確認したいときに便利）
          let rawType = typeof dt;
          if (dt === undefined) rawType = "undefined";
          else if (dt === null) rawType = "null";
          else if (typeof dt === "object" && typeof dt.toDate === "function") rawType = "Timestamp";

          return { ...item, datetime, rawDatetime: dt, rawType };
        });

        // datetime があるものを先に日時でソート、無いものは最後に回す
        normalized.sort((a, b) => {
          const at = a.datetime ? a.datetime.getTime() : Infinity;
          const bt = b.datetime ? b.datetime.getTime() : Infinity;
          return at - bt;
        });

        setSubevents(normalized);
      } catch (err) {
        console.error("fetchSubevents error:", err);
      }
    };

    if (id) fetchSubevents();
  }, [id]);

  // 日付ごとにグループ化（datetime があるものだけ）
  const withDate = subevents.filter(s => s.datetime);
  const withoutDate = subevents.filter(s => !s.datetime);

  const grouped = withDate.reduce((acc, se) => {
    const dateKey = se.datetime.toLocaleDateString("ja-JP");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(se);
    return acc;
  }, {});

  const handleOpenModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : subevents.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < subevents.length - 1 ? prev + 1 : 0));
  };
  

  return (
    
    <div>
      <div className="box">
        <h2 className="Event-h2">総支出</h2>
        <div className="Detail-cost">
          <p>総額</p>
          <p className="Detail-cost-color">1000</p>
        </div>
        
      </div>


      <hr />

      {/* 日付グループ表示 */}
      {Object.entries(grouped).map(([date, events]) => (
        <div key={date}>
          <h3 className="date-heading">{date}</h3>
          {events.map((se, idx) => (
            <div key={se.id} 
            className="event-card"
            onClick={() => handleOpenModal(idx)}
            style={{ cursor: "pointer" }}
            >
              <div className="event-title">{se.title || "(タイトルなし)"}</div>
              {/*<div className="event-meta">
                時間: {se.datetime.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                <span style={{ margin: "0 8px" }}>｜</span>
                金額合計: {(se.transactions?.reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0)} 円
              </div>*/}
            </div>
          ))}

          {isModalOpen && (
        <SubEventModal
          subevent={subevents[currentIndex]}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

        </div>
      ))}

      {/* 日時がないものは別セクションで表示 */}
      {withoutDate.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h3 className="date-heading">日時未設定</h3>
          {withoutDate.map((se, idx) => (
            <div key={se.id}
             className="event-card"
              onClick={() => handleOpenModal(idx)}
              style={{ cursor: "pointer" }}
            >
              <div className="event-title">{se.title || "(タイトルなし)"}</div>
              {/*<div className="event-meta">
                日時が設定されていません
                <span style={{ margin: "0 8px" }}>｜</span>
                金額合計: {(se.transactions?.reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0)} 円
              </div>*/}
            </div>
          ))}

          {isModalOpen && (
        <SubEventModal
          subevent={subevents[currentIndex]}
          eventId={id}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
          
        />
      )}

        </div>
      )}
    </div>
  );
}

export default EventDetail;