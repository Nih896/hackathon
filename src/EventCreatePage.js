/*イベント作成画面*/

import './App.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import db from "./firebase";
import Select from 'react-select';

const options = [
  { value: 'japan', label: 'JPY(¥)' },
  { value: 'america', label: 'USD($)' },
  { value: 'europe', label: 'EUR(€)' },
];

//react-selectをカスタマイズ
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: "98%",     // 幅
        borderRadius: "10px", // 角丸の大きさ
        borderColor: state.menuIsOpen ? "#15ADFF" : "#97B1CC",
        backgroundColor: state.menuIsOpen ? "#F0F4F8" : "#F0F4F8",
        boxShadow: state.menuIsOpen ? "none" : "none",
        "&:hover": {
        borderColor: state.menuIsOpen ? "#15ADFF" : "#97B1CC",
        },
    }),

    menu: (provided) => ({
        ...provided,
        width: "98%", // ここで横幅を指定
    }),

  option: (provided, state) => ({
    ...provided,
    borderRadius: "10px", // 角丸の大きさ
    width: "100%",     // 幅
    backgroundColor: state.isSelected
    ? "#FDDC70" // 選択中は常に黄色
    : state.isFocused
    ? "#ffeeb8ff" // 選択されていない場合のみホバー色
    : "white",
  color: "black",
  // ← active（押してる瞬間）にも強制上書き
  ":active": {
    backgroundColor: state.isSelected ? "#FDDC70" : "#ffeeb8ff",
  },
  }),
};

function EventCreatePage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState([]); // イベント名
    const [currency, setCurrency] = useState(options[0]); // 単位（デフォルト日本円
    const [members, setMembers] = useState([]); // 参加者
    const [memberName, setMemberName] = useState(""); // 入力中の名前

    // 入力値を状態に反映
    const handleChange = (e) => {
        setTitle(e.target.value);
    };
 
    // Firestoreにデータを書き込む関数
    const addEvent = async () => {
        if (title === "" || members.length === 0) return;
        const docRef = await addDoc(collection(db, "events"), {
            title: title,
            currency: currency.value,
            members: members, // [{id: 1, name: "太郎"}, ...] の形で保存
            createdAt: serverTimestamp()
        });
        // 保存後、詳細ページに遷移
        navigate(`/event/${docRef.id}`);
    };

    //参加者の追加関数
    const addMember = () => {
        if (memberName.trim() === "") return;

        const newMember = {
            id: Date.now(),     // 一意なID（タイムスタンプを使う）
            name: memberName,   // 入力された名前
        };

        setMembers([...members, newMember]); // 配列に追加
        setMemberName(""); // 入力欄をリセット
    };

    //参加者の削除
    const removeMember = (id) => {
        setMembers(members.filter((m) => m.id !== id));
    };

    return (
        <div className="App-main">

            <h1 className="App-h1">
                イベントを作成
            </h1>
            <h3 className="App-h3">
                精算内容を簡単に記録、計算します！
            </h3>

            <div className="App-form">
                <h2 className="App-h2">
                    イベント名
                </h2>
                <p className='App-error'>
                    イベント名を入力してください
                </p>
            </div>     
            <input className='App-input'
                type="text"
                value={title}
                onChange={handleChange}
                placeholder="例）夕食"
            />

            <div className="App-form">
                <h2 className="App-h2">
                    単位
                </h2>
            </div>        
            <Select className='App-select'
            components={{IndicatorSeparator: () => null,}}//区切りを消す
            styles={customStyles}
            options={options}
            value={currency}
            onChange={setCurrency}
            />

        <div className="App-form">
          <h2 className="App-h2">
            参加者
          </h2>
        </div>
        
        <div className="member-container">
            <ul className="member-list">
                {members.map((m) => (
                    <li key={m.id} className="member-item">
                    <span className="member-name">{m.name}</span>
                    <button
                        className="remove-btn"
                        onClick={() => removeMember(m.id)}
                    >
                        ✕
                    </button>
                    </li>
                ))}
            </ul>            
            
            <div className='member-form'>
                <div className="member-input-row">
                    <input 
                    className='member-input'
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="参加者名"
                    />
                </div>
                <div className="member-button-row">
                    <button className = "member-btn" onClick={addMember}>参加者を追加</button>
                </div>
                </div>

        </div>

        <div className="button-wrapper">

        <button className='create-btn' onClick={addEvent}>イベントを作成</button>
        </div>
    </div>
  );
}

export default EventCreatePage;