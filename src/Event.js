
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import './App.css';
import './Event.css';

import EventDetail from "./EventDetail";
import AddSubEventForm from './components/AddSubEventForm'; // パスは適切に修正してください
import EventSummary from "./EvenSummary";
import ShareActive from './Share_Active.svg'
import ShareIcon from './Share_Icon.svg'
import EditActive from './Edit_Active.svg'
import EditIcon from './Edit_Icon.svg'
import Token from './Token'; // パスは適切に修正してください

import { useNavigate } from "react-router-dom";
import EventEditPage from './EventEditPage'

function Event() {

    const { id } = useParams(); // ← URLから :id を取得

    const [events, setEvents] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [tokenVisible, setTokenVisible] = useState(false);


    const [activeTab, setActiveTab] = useState("summary"); // ← "summary" or "detail"

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    // モーダルを閉じる関数
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    // onAddは仮の処理
    const handleAddEvent = (eventData) => {
      console.log("イベントが追加されました:", eventData);
      handleCloseModal(); // 追加後にモーダルを閉じる
    };

    const navigate = useNavigate();

    const dummyMembers = [
      { id: 'A', name: 'A' },
      { id: 'B', name: 'B' },
      { id: 'C', name: 'C' },
      { id: 'D', name: 'D' },
    ];


    useEffect(() => {
      const fetchEvent = async () => {
      //データベースからデータ取得する.
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      //const eventData = collection(db, "events");
      if (docSnap.exists()) {
          setEvents(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchEvent();
    }, [id]);

    if (!events) return <p>読み込み中...</p>;

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

            <div className="Event-name">

                <h1 className="App-h1">
                    {events.title}
                </h1>
                <div>
                    <button className="Event-share" onClick={() => navigate(`/event/${id}/edit`)}>
  <img src={EditIcon} className="Event-logo-Edit" alt="編集" />
</button>
                    <button className="Event-share"
                      onClick={handleShareClick}>
                      <img src={EditIcon} className="Event-logo-Share" alt="アイコンの説明" />
                    </button>
                    <button className="Event-btn" onClick={openModal}>＋出費を追加</button>
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                              <AddSubEventForm
                                      members={dummyMembers}
                                      onAdd={handleAddEvent}
                                      isOpen={isModalOpen} // isModalOpenを渡す
                                      onClose={handleCloseModal} // onClose関数を渡す
                                    />                             
                              
                          </div>
                        </div>
                    )}
                </div>
            </div>

            <hr />

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

            {/* 内容を切り替え */}
            {/*{activeTab === "summary" && (
              <div>
                <p>通貨: {events.currency}</p>
                <ul>
                  {events.members.map((m) => (
                    <li key={m.id}>{m.name}</li>
                  ))}
                </ul>
              </div>
            )}*/}
            {activeTab === "summary" && (
              <EventSummary id={id} /> 
            )}

            {activeTab === "detail" && (
              <EventDetail id={id} /> 
            )}

            {tokenVisible && (
            <Token 
              text="リンクをコピーしました！" 
              subtext="精算内容を共有しましょう"
              onClose={() => setTokenVisible(false)} 
            />
          )}
                 
    </div>
    )


    }

    export default Event;