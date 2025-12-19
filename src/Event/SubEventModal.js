import { useState} from "react";
import {
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import "./SubEventDateModal.css"
import expense from "./SubEventModal/expense";
import Income from "./SubEventModal/Income";
import payment from "./SubEventModal/payment";

import AddSubEventForm from "../components/AddSubEventForm";
import Modal from "../components/Modal";
import SubmitModal from "./SubEventModal/SubmitModal";
import db from "../firebase";

function SubEventModal({ subevent, eventId, onClose, onPrev, onNext }) {

  const [editing, setEditing] = useState(null);//サブイベントの情報

  const [submitModal, setSubmitModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); //編集モーダル
  
  if (!subevent){    
    return null;
  } 

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

  // 編集更新
  const handleUpdate = async (SubEventId, formData) => {
    try {
      const docRef = doc(db, "events", eventId, "SubEvents", SubEventId);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setEditing(null);
      setIsModalOpen(false);
    } catch (err) {
      console.log("eventId:", eventId, "SubEventId:", SubEventId);
      console.error("更新失敗:", err);
      alert("更新に失敗しました");
    }
  };

  return (
    <div className="Datemodal-overlay">
      <div className="Datemodal-content">
        <button className="Datemodal-close" onClick={onClose}>×</button>

        <div className="Datemodal-pagechange">
          <button className="Datemodal-nextbtn" onClick={onPrev}>〈</button>
          <div>
            <div className="Datemodal-emoji">
              {subevent.emoji}
            </div>
            <h2 className="Datemodal-title">{subevent.title || "(タイトルなし)"}</h2>
            <p className="Datemodal-date">
              {subevent.date.replace(/-/g, ".")}
            </p>
          </div>
          <button className="Datemodal-nextbtn" onClick={onNext}>〉</button>
        </div>

        {/* ここで type に応じてコンポーネントをレンダリング */}
        <ContentComponent subevent={subevent} />
        
        <div className="Datemodal-btn">
          <button 
            className="Datemodal-removebtn"
            onClick={() => { setSubmitModal(true) }}
          >
            消去
          </button>
          <SubmitModal
            isOpen={submitModal}
            onClose={() => setSubmitModal(false)}
            subevent = {subevent}
            eventId={eventId}
          />

          {/* 一覧表示 */}
          <button className="Datemodal-editbtn" 
            onClick={() => { setEditing(subevent); setIsModalOpen(true); }}
          >
            編集
          </button>

          {/* モーダル内フォーム */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {/* <h2>{editing ? "イベントを編集" : "イベントを追加"}</h2> */}
            <AddSubEventForm
              members={subevent.members || []}  // ← Firestoreから取ってきたmembersをそのまま渡す
              onAdd={(data) => {
                if (editing ) {
                  return handleUpdate(editing.id, data);
                }
              }}
              initialData={editing}
            />
          </Modal>

        </div>
      </div>
    </div>
  );
}

export default SubEventModal;