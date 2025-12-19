import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import db from "../firebase";
import CURRENCIES from "../EventCreatePage/Country";
import "./EventDetail.css";
import SubEventModal from "./SubEventModal";

import { getExpenseSummary } from "../function/addfunction";
import { sortdatetime } from "../calculation/sortdatetime";

function EventDetail({ id, events }) {
  const [subevents, setSubevents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [datetime, setDatetime] = useState(null); //日付保存
  const [currentIndex, setCurrentIndex] = useState(0); //日付の中のインデックス保存

  // 集計用のstate
  const [memberExpenses, setMemberExpenses] = useState({}); //総額

  useEffect(() => {
    if (!id) return; // idが無ければ何もしない

    // サブコレクションへの参照を作成
    const subColRef = collection(db, "events", id, "SubEvents");
  
    const unsubscribe = onSnapshot(subColRef, async ( snap ) => {

      if (snap.empty) {
        setMemberExpenses({});
        setSubevents([]);
        return;
      }
      // SubEvents が変化するたびに getExpenseSummary を呼んで再計算
      const currencyData = await getExpenseSummary(id);
      setMemberExpenses(currencyData);

      // 日付順にサブイベントを並べて更新
      const grouped = await sortdatetime(id);
      setSubevents(grouped);
    });
  
    return () => unsubscribe();
  }, [id]);

  //サブイベントのメッセージ
  function renderSubEvent(se) {
    const receiver = se.members.find(m => m.id === se.receiverId);
    switch (se?.type) {
      case "expense":
        return <span className="Detail-message">{se.payerName}が支払い</span>;
      case "income":
        return <span className="Detail-message">{receiver ? receiver.name : "不明"}が受け取り</span>;
      case "payment":
        return <span className="Detail-message">{se.payerName}が{receiver ? receiver.name : "不明"}に支払い</span>;
      default:
        return <span className="Detail-message">その他：{se.title}</span>;
    }
  }

  //大イベントのシンボルをとってくる
  const symbol = events.currency ? CURRENCIES[events.currency]?.symbol : "0";

  //モーダルを開く
  const handleOpenModal = (date, index) => {
    setDatetime(date)
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleMove = (direction) => {
    const dateKeys = Object.keys(subevents).sort( //日付キーを取り出して日付順にソートする
      (a, b) => new Date(a) - new Date(b)
    );
    const currentDateIndex = dateKeys.indexOf(datetime);
    const currentList = subevents[datetime] || [];

    // 次 or 前に移動
    let newDate = datetime;
    let newIndex = currentIndex + (direction === "next" ? 1 : -1);

    if (newIndex < 0) {
      // 前方向で日をまたぐ
      const prevDateIndex =
        currentDateIndex > 0 ? currentDateIndex - 1 : dateKeys.length - 1;
      newDate = dateKeys[prevDateIndex];
      newIndex = subevents[newDate].length - 1;
    } else if (newIndex >= currentList.length) {
      // 次方向で日をまたぐ
      const nextDateIndex =
        currentDateIndex < dateKeys.length - 1 ? currentDateIndex + 1 : 0;
      newDate = dateKeys[nextDateIndex];
      newIndex = 0;
  }

  setDatetime(newDate);
  setCurrentIndex(newIndex);
};

// 呼び出し用
const handlePrev = () => handleMove("prev");
const handleNext = () => handleMove("next");

  return (
    <div>
      <div className="Detail-box">
        <h2 className="Detail-h2">総支出</h2>   

        {Object.keys(memberExpenses).length === 0 ? (          
          <div>
            <div className="Detail-totalcostbox">
              <span className="Detail-totalname">総額</span>
              <span className="Detail-totalcost">0{symbol}</span>
            </div>

            {/* メンバーリスト全体を囲むdivを追加 */}
            {events?.members?.map((m) => (              
              <li key={m.id} className="Detail-members">
                <span>{m.name}</span>
                <span>0{symbol}</span>
              </li>              
            ))}
          </div>

        ) : (
          Object.entries(memberExpenses).map(([currency, data], index, array) => (
            <div key={currency}>
              <h3 className="Detail-currency">{currency}</h3>
              <div className="Detail-totalcostbox">
                <span className="Detail-totalname">総額</span>
                <span className="Detail-totalcost">{data.totalExpense}{CURRENCIES[currency].symbol}</span>
              </div>

              {/* メンバーリスト全体を囲むdivを追加 */}
              {Object.entries(data.memberExpenses).map(([id, m]) => (
                <div key={id} className="Detail-members">
                  <span>{m.name}</span>
                  <span>{m.amount}{CURRENCIES[currency].symbol}</span>
                </div>
              ))}
              {index < array.length - 1 && <hr className="Summary-boder" />}
            </div>
          ))
        )}        
      </div>

      <hr className="Detail-boder"/>

      {/* 日付グループ表示 */}
      {Object.entries(subevents).map(([date, list]) => (
        <div key={date}>
          <div className="Detail-suneventdate">
            {date.replace(/\//g, ".")}
          </div>
          {list.map((se, index) => (
            <div 
              key={se.id}
              className="Detail-subeventcard"
              onClick={() => handleOpenModal(date, index)}
            >
              <div className="Detail-subheading">
                <div className="Detail-subemoji">
                  {se.emoji}
                </div>
                <div className="Detail-subtitles">
                  {se.title}
                  <div>{renderSubEvent(se)}</div>
                </div>
              </div>
              <div className="Detail-subamount">
                {se.amount}
                {CURRENCIES[se.currency]?.symbol}
              </div>
            </div>
          ))}
        </div>
      ))}

      {isModalOpen && subevents[datetime] && (
        <SubEventModal
          subevent={subevents[datetime][currentIndex]}
          eventId={id}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

export default EventDetail;