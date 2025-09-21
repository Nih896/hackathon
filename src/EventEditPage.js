// EventEditPage.js
import './App.css';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "./firebase";
import Select from 'react-select';

const options = [
  { value: 'japan', label: 'JPY(¥)' },
  { value: 'america', label: 'USD($)' },
  { value: 'europe', label: 'EUR(€)' },
];

function EventEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState(options[0]);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  // Firestoreから既存データを読み込み
  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setCurrency(options.find(o => o.value === data.currency) || options[0]);
        setMembers(data.members || []);
      }
    };
    fetchEvent();
  }, [id]);

  // 更新処理
  const updateEvent = async () => {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, {
      title: title,
      currency: currency.value,
      members: members,
    });
    navigate(`/event/${id}`); // 更新後、詳細ページに戻る
  };

  // 参加者の追加
  const addMember = () => {
    if (memberName.trim() === "") return;
    const newMember = {
      id: Date.now(),
      name: memberName,
    };
    setMembers([...members, newMember]);
    setMemberName("");
  };

  // 参加者の削除
  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="App-main">
      <h1 className="App-h1">イベントを編集</h1>

      <div className="App-form">
        <h2 className="App-h2">イベント名</h2>
      </div>
      <input
        className="App-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="App-form">
        <h2 className="App-h2">単位</h2>
      </div>
      <Select
        className="App-select"
        options={options}
        value={currency}
        onChange={setCurrency}
      />

      <div className="App-form">
        <h2 className="App-h2">参加者</h2>
      </div>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.name}
            <button onClick={() => removeMember(m.id)}>✕</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      />
      <button onClick={addMember}>参加者を追加</button>

      <div className="button-wrapper">
        <button className="create-btn" onClick={updateEvent}>
          更新する
        </button>
      </div>
    </div>
  );
}

export default EventEditPage;
