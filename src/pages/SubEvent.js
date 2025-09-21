// src/pages/Event.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddSubEventForm from "../components/AddSubEventForm";
import Modal from "../components/Modal";


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
import { SubEventDb } from "../firebase";

export default function SubEvent() {
  const { eventId } = useParams(); // ルーティングのURLからeventIdを取得
  const [SubEvents, setSubEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Firestoreからリアルタイム購読
  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(SubEventDb, "events", eventId, "SubEvents"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubEvents(arr);
    });

    return () => unsubscribe();
  }, [eventId]);

  // 新規追加
  const handleAdd = async (formData) => {
    try {
      await addDoc(collection(SubEventDb, "events", eventId, "SubEvents"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("保存失敗:", err);
      alert("保存に失敗しました");
    }
  };

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
    <div style={{ padding: "20px" }}>
      <h1>イベントページ（{eventId}）</h1>

      {/* 追加ボタン */}
      <button onClick={() => { setEditing(null); setIsModalOpen(true); }}>
        小イベントを追加
      </button>

      {/* 一覧表示 */}
      <ul style={{ marginTop: "20px" }}>
        {SubEvents.map((ev) => (
          <li key={ev.id} style={{ marginBottom: "8px" }}>
            <strong>{ev.emoji} {ev.title}</strong> ({ev.type}) - {ev.amount}{ev.unit}
            <button style={{ marginLeft: "8px" }} onClick={() => { setEditing(ev); setIsModalOpen(true); }}>
              編集
            </button>
          </li>
        ))}
      </ul>

      {/* モーダル内フォーム */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* <h2>{editing ? "イベントを編集" : "イベントを追加"}</h2> */}
        <AddSubEventForm
          members={[
            { id: "userA", name: "アキ" },
            { id: "userB", name: "ユミ" },
            { id: "userC", name: "ケン" },
          ]}
          
          onAdd={(data) => {
            if (editing && editing.id) {
              return handleUpdate(editing.id, data);
            } else {
              return handleAdd(data);
            }
          }}
          initialData={editing}
        />
      </Modal>
    </div>
  );
}
