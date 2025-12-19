import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './FirstPage.css';

function FirstPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // 保存された履歴（文字列）を配列に戻して取得
    const savedHistory = JSON.parse(localStorage.getItem("eventHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  return (
    <div className="FirstPage-main">
      <h1 className="FirstPage-h1">最近のイベント</h1>
      <h1 className="FirstPage-h2">直近で見たイベントを最大5件まで保存しています!</h1>

      {history.length > 0 ? (
        <ul className="FirstPage-ul">
          {history.map((event) => (
            <li key={event.id}>
              <Link 
                to={`/event/${event.id}`}
                className="FirstPage-evntcard"
              >
                <span className="FirstPage-emoji">
                  {event.emoji}
                </span>
                <span>
                  {event.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="FirstPage-errorr">閲覧履歴はありません。</p>
      )}
      <div className="FirstPage-btn-right">
        <Link to={`/EventCreatePage`} >
          <button className="FirstPage-btn">新しいイベントを作成</button>
        </Link>
      </div>
    </div>
  );
}

export default FirstPage;