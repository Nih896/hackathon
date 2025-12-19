/*イベント作成画面*/

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import db from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import EmojiPicker from 'emoji-picker-react';
import './EventCreate.css';
import CurrencyModal from "./CurrencyModal";
import { CURRENCIES } from"./Country"

const options = [
  {
    value: "jpy",
    label: `JPY (${CURRENCIES.jpy.symbol})`
  },
  {
    value: "usd",
    label: `USD (${CURRENCIES.usd.symbol})`
  },
  {
    value: "eur",
    label: `EUR (${CURRENCIES.eur.symbol})`
  },
  {
    value: "other",
    label: "その他"
  }
];

//react-selectをカスタマイズ
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        paddingLeft: "6px",
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
        borderRadius: "10px",  // ドロップダウンリスト全体の角丸
        overflow: "hidden",    // 丸みに沿って切る
    }),

    option: (provided, state) => ({
        ...provided,
        margin: state.data.value === "other" ? "0" : "0 8px",
        width: state.data.value === "other" ? "100%" : "calc(100% - 16px)",
        paddingLeft: "20px",
        borderRadius: state.data.value === "other" ? "0px" : "10px", // 角丸の大きさ
        backgroundColor: state.isSelected
            ? "#FDDC70" // 選択中は常に黄色
            :state.data.value === "other"
            ? "#FFF"
            : "white",
            ":hover": {
                backgroundColor: state.isSelected
                ? "#FDDC70" // 選択中は常に黄色
                :state.data.value === "other"
                ? "transparent"
                :"#ffeeb8ff", // マウスが乗ってる時だけ
            },
        borderTop: state.data.value === "other" ? "1px solid #97B1CC" : "none",
        color: state.isSelected 
            ? "black"
            : state.data.value === "other"
            ? "#15ADFF" // その他は青色
            :"black",
        cursor: state.data.value === "other" ? "pointer" : "default",
        // ← active（押してる瞬間）にも強制上書き
        ":active": {
            backgroundColor: state.isSelected 
            ? "#FDDC70"
            :state.data.value === "other"
            ? "#FFF"
            : "#ffeeb8ff",
        },
    }),
};

function EventCreatePage({currency}) {
    const navigate = useNavigate();

    const [emoji, setEmoji] = useState("😊") //絵文字
    const [title, setTitle] = useState(""); // イベント名
    const [memorycurrency, setMemoryCurrency] = useState(options[0]); // 単位（デフォルト日本円)
    const [members, setMembers] = useState([]); // 参加者
    const [memberName, setMemberName] = useState(""); // 入力中の名前

    const [showEmojiPicker, setShowEmojiPicker] = useState(false); //絵文字バーの非表示
    const [errormessege, setErrormessege] = useState(""); //エラーメッセージの非表示

    const pickerRef = useRef(null); //絵文字バー{ current: null }
    const inputRef = useRef(null); //絵文字入力部

    const [isModalOpen, setIsModalOpen] = useState(false);  //単位選択モーダル

    //絵文字バー以外をクリックしたとき，バーを消す
    useEffect(() => {
        function handleClickOutside(event) {
            // pickerRef の中身以外(入力部分は除外)をクリックしたら閉じる
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 通貨選択の処理
    const handleCurrencyChange = (selectedOption) => {
        if (selectedOption.value === "other") {
            // 「その他」が選ばれたらモーダルを開く
            setIsModalOpen(true);
        } else {
            setMemoryCurrency(selectedOption);
        }
    };
    
    // モーダルから渡された currencyValue を反映
    const handleModalCurrency = (currencyValue) => {
        // まず options の中にあるか確認
        let selectedOption = options.find(opt => opt.value === currencyValue);

        // options にない場合 → CURRENCIES から作成
        if (!selectedOption && CURRENCIES[currencyValue]) {
            selectedOption = {
                value: currencyValue,
                label: `${currencyValue.toUpperCase()} (${CURRENCIES[currencyValue].symbol})`
            };
        }

        setMemoryCurrency(selectedOption || null);
    };

    //参加者の削除
    const removeMember = (id) => {
        setMembers(members.filter((m) => m.id !== id));
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

    // Firestoreにデータを書き込む関数
    const addEvent = async () => {
        if (!title.trim()) {
            setErrormessege("イベント名を入力してください");
            return;
        }
        const docRef = await addDoc(collection(db, "events"), {
            emoji: emoji,
            title: title,
            currency: memorycurrency.value,
            members: members, // [{id: 1, name: "太郎"}, ...] の形で保存
            createdAt: serverTimestamp()
        });
        // 保存後、詳細ページに遷移
        navigate(`/event/${docRef.id}`);
    };

    return (
        <div className="EventCreate-main">

            <h1 className="EventCreate-h1">
                イベントを作成
            </h1>
            <h3 className="EventCreate-h3">
                精算内容を簡単に記録、計算します！
            </h3>

            <div className="EventCreate-flex">
                <h2 className="EventCreate-h2">
                    イベント名 
                </h2>
                <h2 className='EventCreate-error'>
                    *
                </h2>
                <p className='EventCreate-error'>
                    {errormessege}
                </p>
            </div>

            <div className='EventCreate-flex'>
                <div 
                    ref={inputRef}
                    className='EventCreate-picker'
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                        border: showEmojiPicker ? '1px solid #15ADFF' : '1px solid #97B1CC'
                    }}
                >
                    { emoji }
                </div>
                
                {/* EmojiPickerのコンポーネントを追加 */}
                {showEmojiPicker && (                
                    <div 
                        ref={pickerRef}/*pickerRef.currentにdivの要素が入る*/ 
                        className='EventCreate-pickerdoloar'
                    >
                        <EmojiPicker
                            className='emoji-picker'
                            onEmojiClick={(emojiObject) => {
                                setEmoji(emojiObject.emoji);   
                                setShowEmojiPicker(false)
                            }}
                            
                        />
                    </div>
                )}            
                            
                <input className='EventCreate-input'
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例）東京旅行"
                />
            </div>
            
            <h2 className="EventCreate-h2">
                単位
            </h2>
               
            <Select
                components={{IndicatorSeparator: () => null,}}//区切りを消す
                styles={customStyles}
                options={options}
                value={memorycurrency}
                onChange={handleCurrencyChange}
                isSearchable={false} // 入力できないようにする
            />
            {isModalOpen && (
                <CurrencyModal 
                    onClose={() => setIsModalOpen(false)}
                    currency={(cur) => handleModalCurrency(cur)} //コールバック渡す
                />
            )}

            <p>{currency?.value}</p>
            
            <h2 className="EventCreate-h2">
                参加者
            </h2>
        
            <div className="member-container">
                <ul className="member-list">
                    {members.map((m) => (
                        <li key={m.id} className="member-item">
                            <span className='member-name'>{m.name}</span>
                            <button
                                className="remove-btn"
                                onClick={() => removeMember(m.id)}
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>         
                
                <input 
                    className='member-input'
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="参加者名"
                />

                <div className="member-top-row">
                    <button className = "member-addbtn" onClick={addMember}>参加者を追加</button>
                </div>
            </div>

            <div className="EventCreate-btn-right">
                <button className="EventCreate-btn" onClick={addEvent}>イベントを作成</button>
            </div>
        </div>
    );
}

export default EventCreatePage;