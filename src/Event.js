
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import SmallEventCreate from "./SmallEventCreate";
import './App.css';
import './Event.css';
import { ReactComponent as ShareIcon } from './Share.svg';
import { ReactComponent as EditIcon } from './Edit.svg';
import EventDetail from "./EventDetail";

function Event() {

    const { id } = useParams(); // ← URLから :id を取得

    const [events, setEvents] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("summary"); // ← "summary" or "detail"

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


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


  return(

    

        <div className="Event-main">

            <div className="Event-name">

                <h1 className="App-h1">
                    {events.title}
                </h1>
                <div>
                    <button className="Event-share"><EditIcon className="Share" /></button>
                    <button><ShareIcon /></button>
                    <button className="create-btn" onClick={openModal}>＋出費を追加</button>
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <SmallEventCreate closeModal={closeModal} />
                        </div>
                        </div>
                    )}
                </div>
            </div>

            <hr />

            {/* タブ切り替え */}
            <div>
              <button onClick={() => setActiveTab("summary")}>まとめ</button>
              <button onClick={() => setActiveTab("detail")}>詳細</button>
            </div>

            {/* 内容を切り替え */}
            {activeTab === "summary" && (
              <div>
                <p>通貨: {events.currency}</p>
                <ul>
                  {events.members.map((m) => (
                    <li key={m.id}>{m.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "detail" && (
              <EventDetail id={id} /> 
            )}
                 
    </div>
    )


    }

    export default Event;