
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import './Event.css';
import EventSummary from "./EventSummary";
import EventDetail from "./EventDetail";
import Token from './Token';

import Modal from "../components/Modal";
import AddSubEventForm from '../components/AddSubEventForm';

function Event() {

  const { id } = useParams(); // ← URLから :id を取得

  const [events, setEvents] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false); //サブイベント追加モーダル

  const [tokenVisible, setTokenVisible] = useState(false); //トークン

  const [activeTab, setActiveTab] = useState("summary"); // "summary" or "detail"



  const navigate = useNavigate(); //大イベントの編集モードに入る

  useEffect(() => {
    //データベースからデータ取得する.
    const docRef = doc(db, "events", id);
    //初回データ取得
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvents(docSnap.data());

        // --- 履歴保存処理 ---
        // 今の履歴を取得（なければ空配列）
        const oldHistory = JSON.parse(localStorage.getItem("eventHistory") || "[]");
        const currentEvent = {
          id: id,
          title: docSnap.data().title || "無題のイベント",
          emoji: docSnap.data().emoji || "😊"
        };

        // 同じIDの古い履歴を消して、最新を先頭に追加
        const filteredHistory = oldHistory.filter(item => item.id !== id);
        const newHistory = [currentEvent, ...filteredHistory].slice(0, 5);

        localStorage.setItem("eventHistory", JSON.stringify(newHistory));
      }
    };
    fetchData();
    //リアルタイムで取得
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvents(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [id]);

  if (!events) return <p>読み込み中...</p>;

  // 新規追加
  const handleAdd = async (formData) => {
    try {
      await addDoc(collection(db, "events", id, "SubEvents"), {
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

  //トークン
  const handleShareClick = async () => {
    try {
      // 現在のページのURLを取得
      const url = window.location.href;
      // クリップボードにURLを書き込む
      await navigator.clipboard.writeText(url);
      setTokenVisible(true);
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました", err);
    }
  };

  return(
    <div className="Event-main">

      <div className="Event-heading">

        <div className="Event-title">
          <div className="Event-emoji">
            {events.emoji}
          </div>
          <h1 className="Event-h1">
            {events.title}
          </h1>
        </div>

        <div className="Event-btns">
          
          <button 
            className="Event-Iconbtn"  
            onClick={() => 
              navigate(`/event/${id}/edit`, { 
                state: { 
                  events: events,
                  id: id,
                },
              })
            }
          >
            <div className="Event-logo-Edit" />
          </button>
          
          <button className="Event-Iconbtn" onClick={handleShareClick}>
            <div className="Event-logo-Share" />
          </button>
          {tokenVisible && (
            <Token 
              text="リンクをコピーしました！" 
              subtext="精算内容を共有しましょう"
              onClose={() => setTokenVisible(false)} 
            />
          )}

          <button 
            className="Event-btn" 
            onClick={() => setIsModalOpen(true)}
          >
            ＋
            <span className="hide-mobile">出費を追加</span>
          </button>
        </div>
      </div>

      {/* モーダル内フォーム */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* <h2>{editing ? "イベントを編集" : "イベントを追加"}</h2> */}
        <AddSubEventForm
          members={events.members}
          onAdd={(data) => {
            return handleAdd(data);            
          }}
          initialData={false}
          initialCurrency={events.currency}
        />
      </Modal>
      
      <hr className="modal-boder"/>

      {/* タブ切り替え */}
      <div className="Event-detail-summary">
              
        <button
          className={`Event-summary-btn ${activeTab === "summary" ? "active" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          まとめ
        </button>
        <button
          className={`Event-detail-btn ${activeTab === "detail" ? "active" : ""}`}
          onClick={() => setActiveTab("detail")}
        >
          詳細
        </button>
      </div>

      {activeTab === "summary" && (
        <EventSummary id={id}
                      events = {events} /> 
      )}
      {activeTab === "detail" && (
        <EventDetail id={id}
                      events = {events} /> 
      )}     
    </div>
  )
}

export default Event;