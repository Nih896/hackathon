import React from "react";
import { useState, useEffect } from "react";
import "./Event.css";
import expense from "./SubEventModal/expense";
import Income from "./SubEventModal/Income";
import payment from "./SubEventModal/payment";
import AddSubEventForm from "./components/AddSubEventForm";
import Modal from "./components/Modal";
import { SubEventDb } from "./firebase";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

function SubEventModal({ subevent, eventId, onClose, onPrev, onNext }) {

  const [editing, setEditing] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  

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
    // 編集更新
  const handleUpdate = async (SubEventId, formData) => {
    try {
      const docRef = doc(SubEventDb, "events", eventId, "SubEvents", SubEventId);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setEditing(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("更新失敗:", err);
      alert("更新に失敗しました");
    }
  };


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
          {/* 一覧表示 */}
          <button style={{ marginLeft: "8px" }} onClick={() => { setEditing(eventId); setIsModalOpen(true); }}>
            編集
          </button>
          {/* モーダル内フォーム */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* <h2>{editing ? "イベントを編集" : "イベントを追加"}</h2> */}
        <AddSubEventForm
          members={subevent.members || []}  // ← Firestoreから取ってきたmembersをそのまま渡す
          onAdd={(data) => {
            if (editing && editing.id) {
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
