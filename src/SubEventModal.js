import React from "react";
import "./Event.css";
import expense from "./SubEventModal/expense";
import Income from "./SubEventModal/Income";
import payment from "./SubEventModal/payment";

function SubEventModal({ subevent, onClose, onPrev, onNext }) {
  if (!subevent) return null;

  let ContentComponent;
  if (subevent.type === "payment") {
    ContentComponent = payment;
  } else if (subevent.type === "expense") {
    ContentComponent = expense;
  } else if (subevent.type === "income") {
    ContentComponent = Income;
  } else {
    ContentComponent = () => <div>不明なタイプ</div>;
  }

  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="modal-pagechange">

            <button className="modal-btn" onClick={onPrev}>〈</button>

            <div className=".madal-titlecomponent">
                <h2 className="modal-title">{subevent.title || "(タイトルなし)"}</h2>
                {subevent.datetime && (
                <p className="madal-date">
                    {subevent.datetime.toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    })}
                </p>
                )}
            </div>
          
            <button className="modal-btn"  onClick={onNext}>〉</button>

        </div>


        {/* ここで type に応じてコンポーネントをレンダリング */}
        <ContentComponent subevent={subevent} />
        
        <div className="Modal-btn-position">
          <button className="Modal-btn2">消去</button>
          <button className="Modal-btn2">編集</button>
        </div>
    </div>
  </div>
  );
}

export default SubEventModal;
