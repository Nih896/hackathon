import { useState, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import './AddSubEventForm.css';
//import Modal from "./Modal";

const CURRENCIES = {
  jpy: { symbol: "¥", name: "日本円", flag: "🇯🇵" },
  usd: { symbol: "$", name: "米ドル", flag: "🇺🇸" },
  eur: { symbol: "€", name: "ユーロ", flag: "🇪🇺" },
  krw: { symbol: "₩", name: "韓国ウォン", flag: "🇰🇷" },
  cny: { symbol: "元", name: "中国元", flag: "🇨🇳" },
  aed: { symbol: "د.إ", name: "UAEディルハム", flag: "🇦🇪" },
  aud: { symbol: "A$", name: "豪ドル", flag: "🇦🇺" },
  brl: { symbol: "R$", name: "ブラジルレアル", flag: "🇧🇷" },
  cad: { symbol: "C$", name: "カナダドル", flag: "🇨🇦" },
  chf: { symbol: "CHF", name: "スイスフラン", flag: "🇨🇭" },
  dkk: { symbol: "kr", name: "デンマーククローネ", flag: "🇩🇰" },
  egp: { symbol: "E£", name: "エジプトポンド", flag: "🇪🇬" },
  gbp: { symbol: "£", name: "英ポンド", flag: "🇬🇧" },
  hkd: { symbol: "HK$", name: "香港ドル", flag: "🇭🇰" },
  idr: { symbol: "Rp", name: "インドネシアルピア", flag: "🇮🇩" },
  ils: { symbol: "₪", name: "イスラエルシェケル", flag: "🇮🇱" },
  inr: { symbol: "₹", name: "インドルピー", flag: "🇮🇳" },
  kwd: { symbol: "KD", name: "クウェートディナール", flag: "🇰🇼" },
  mxn: { symbol: "Mex$", name: "メキシコペソ", flag: "🇲🇽" },
  myr: { symbol: "RM", name: "マレーシアリンギット", flag: "🇲🇾" },
  nok: { symbol: "kr", name: "ノルウェークローネ", flag: "🇳🇴" },
  nzd: { symbol: "NZ$", name: "ニュージーランドドル", flag: "🇳🇿" },
  php: { symbol: "₱", name: "フィリピンペソ", flag: "🇵🇭" },
  pkr: { symbol: "Rs", name: "パキスタンルピー", flag: "🇵🇰" },
  pln: { symbol: "zł", name: "ポーランドズロチ", flag: "🇵🇱" },
  rub: { symbol: "₽", name: "ロシアルーブル", flag: "🇷🇺" },
  sar: { symbol: "﷼", name: "サウジアラビアリアル", flag: "🇸🇦" },
  sek: { symbol: "kr", name: "スウェーデンクローナ", flag: "🇸🇪" },
  sgd: { symbol: "S$", name: "シンガポールドル", flag: "🇸🇬" },
  thb: { symbol: "฿", name: "タイバーツ", flag: "🇹🇭" },
  try: { symbol: "₺", name: "トルコリラ", flag: "🇹🇷" },
  twd: { symbol: "NT$", name: "台湾ドル", flag: "🇹🇼" },
  vnd: { symbol: "₫", name: "ベトナムドン", flag: "🇻🇳" },
  zar: { symbol: "R", name: "南アフリカランド", flag: "🇿🇦" },
};

export default function AddSubEventForm({ members, onAdd, isOpen, onClose, initialData, initialCarrency }) {
  const [activeTab, setActiveTab] = useState(initialData?.type || "expense");
  const [splitMethod, setSplitMethod] = useState(initialData?.splitMethod || "equal");
  const [title, setTitle] = useState(initialData?.title || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [payer, setPayer] = useState(initialData?.payer || members[0]?.id || "");
  const [receiver, setReceiver] = useState(initialData?.receiver || members[1]?.id || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [selectedMembers, setSelectedMembers] = useState(initialData?.members || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState(initialData?.emoji || "😊");
  const [currency, setCurrency] = useState(initialData?.currency || initialCarrency);
  const [focusedInput, setFocusedInput] = useState(null);
  const [editedAmounts, setEditedAmounts] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
    if (initialData) {
      setActiveTab(initialData.type || "expense");
      setSplitMethod(initialData.splitMethod || "equal");
      setTitle(initialData.title || "");
      setEmoji(initialData.emoji || "😊");
      setAmount(initialData.amount || "");
      setPayer(initialData.payerId || members[0]?.id || "");
      setReceiver(initialData.receiverId || members[1]?.id || "");
      setDate(initialData.date || new Date().toISOString().slice(0, 10));
      setCurrency(initialData.currency || initialCarrency);
      setEditedAmounts({});

      const initialMembers = members.map((m) => {
        const foundMember = initialData.members.find((im) => im.id === m.id);
        if (foundMember) {
          return {
            ...m,
            selected: foundMember.selected,
            ratio: foundMember.ratio || 1,
            customAmount: foundMember.shareAmount || "",
          };
        }
        return { ...m, selected: false, ratio: 1, customAmount: "" };
      });
      setSelectedMembers(initialMembers);
    } else {
      const initialMembers = members.map((m) => ({
        ...m,
        selected: true,
        ratio: 1,
        customAmount: "",
      }));
      setSelectedMembers(initialMembers);
      setPayer(members[0]?.id || "");
      setReceiver(members[1]?.id || "");
      setDate(new Date().toISOString().slice(0, 10));
      setEditedAmounts({});
    }
  }, [initialData, members]);

  useEffect(() => {
    if (initialData && !Object.keys(editedAmounts).length) {
        return;
    }
    if (splitMethod === "custom") {
      const activeMembers = selectedMembers.filter((m) => m.selected);
      const totalAmount = Number(amount) || 0;
      const editedTotal = activeMembers.reduce((sum, m) =>
        sum + (editedAmounts[m.id] ? Number(editedAmounts[m.id]) : 0), 0);
      const remainingAmount = totalAmount - editedTotal;
      const uneditedMembers = activeMembers.filter((m) => !editedAmounts[m.id]);
      const uneditedCount = uneditedMembers.length;
      const baseShare = uneditedCount > 0 ? Math.floor(remainingAmount / uneditedCount) : 0;
      const remainder = uneditedCount > 0 ? remainingAmount % uneditedCount : 0;
      
      setSelectedMembers((prev) =>
        prev.map((m) => {
          if (m.selected) {
            if (editedAmounts[m.id]) {
              return { ...m, customAmount: editedAmounts[m.id] };
            } else {
              const index = uneditedMembers.findIndex(u => u.id === m.id);
              return {
                ...m,
                customAmount: baseShare + (index < remainder ? 1 : 0),
              };
            }
          }
          return { ...m, customAmount: "" };
        })
      );
    } else if (splitMethod === "equal") {
      const activeMembers = selectedMembers.filter((m) => m.selected);
      const count = activeMembers.length;
      const totalAmount = Number(amount) || 0;
      const baseShare = count > 0 ? Math.floor(totalAmount / count) : 0;
      const remainder = count > 0 ? totalAmount % count : 0;
      
      setSelectedMembers((prev) =>
        prev.map((m) => {
          if (m.selected) {
            const index = activeMembers.findIndex(a => a.id === m.id);
            return {
              ...m,
              customAmount: baseShare + (index < remainder ? 1 : 0),
            };
          }
          return { ...m, customAmount: 0 }; // 0円で表示
        })
      );
    }
  }, [amount, splitMethod, editedAmounts]);


  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numberValue = Number(value);
    setAmount(value === "" ? "" : Math.max(0, numberValue));
  };

  const handleMemberAmountChange = (id, value) => {
    const numberValue = Number(value);
    const validatedValue = value === "" ? "" : Math.max(0, numberValue);

    setEditedAmounts((prev) => ({
      ...prev,
      [id]: validatedValue,
    }));
  };

  const handleCustomInputFocus = (id) => {
    setFocusedInput(`member-amount-${id}`);
    const member = selectedMembers.find(m => m.id === id);
    if (member && member.customAmount !== "" && member.customAmount !== 0) {
        setEditedAmounts((prev) => ({
            ...prev,
            [id]: member.customAmount,
        }));
    } else {
        setEditedAmounts((prev) => ({
            ...prev,
            [id]: "",
        }));
    }
  };

  const handleCustomInputBlur = (id, value) => {
    setFocusedInput(null);
    if (value === "") {
      setEditedAmounts((prev) => {
        const newEditedAmounts = { ...prev };
        delete newEditedAmounts[id];
        return newEditedAmounts;
      });
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const toggleMember = (id) => {
    setSelectedMembers((prev) => {
      const newMembers = prev.map((m) =>
        m.id === id ? { ...m, selected: !m.selected } : m
      );
      return newMembers;
    });
    setEditedAmounts({});
  };

  const changeRatio = (id, delta) => {
    setSelectedMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ratio: Math.max(0, m.ratio + delta) } : m
      )
    );
  };

  const handleCalcButton = (id, op) => {
    const value = prompt("値を入力してください:");
    if (value === null || value.trim() === "") return;

    try {
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        alert("無効な数値です。");
        return;
      }
      
      const currentAmount = editedAmounts[id] !== undefined ? Number(editedAmounts[id]) : Number(selectedMembers.find(m => m.id === id).customAmount);
      let newAmount = 0;
      
      switch (op) {
        case "+": newAmount = currentAmount + numberValue; break;
        case "-": newAmount = currentAmount - numberValue; break;
        case "*": newAmount = currentAmount * numberValue; break;
        case "/": newAmount = currentAmount / numberValue; break;
        default: break;
      }
      
      handleMemberAmountChange(id, newAmount);
    } catch (e) {
      alert("計算に失敗しました。");
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (splitMethod === "custom") {
    const totalCustomAmount = selectedMembers.filter(m => m.selected).reduce((sum, m) => sum + Number(m.customAmount), 0);
    if (totalCustomAmount !== Number(amount)) {
      setErrorMessage("合計金額が不正確です");
      return;
    }
  }
  if (activeTab === "payment" && payer === receiver) {
    setErrorMessage("支払者と受取人は別の人を選んでください");
    return;
  }
  
  // バリデーションチェック
  if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      alert("タイトルと金額を正しく入力してください。");
      return;
  }
  
  setErrorMessage("");

  const eventMembersData = selectedMembers.map(m => {
    const memberData = {
      id: m.id,
      name: m.name,
      selected: m.selected,
    };
    if (splitMethod === "ratio") {
        memberData.ratio = m.ratio;
        // 比率計算による負担額も保存する
        memberData.shareAmount = m.selected ? Math.floor(Number(amount) * (m.ratio / totalRatio) || 0) : 0;
    } else if (splitMethod === "custom") {
        memberData.shareAmount = Number(m.customAmount) || 0;
    } else if (splitMethod === "equal") {
        memberData.shareAmount = m.selected ? m.customAmount : 0;
    }
    return memberData;
  });

  // 親に渡すデータオブジェクトを作成
  const eventData = {
    type: activeTab,
    emoji: emoji, 
    title: title,
    amount: Number(amount),
    currency: currency,
    date: date,
    splitMethod: splitMethod,
    members: eventMembersData,
  };

  // 支払い者/受取人が空文字列でない場合のみプロパティに追加
  if (payer && (activeTab === "expense" || activeTab === "payment")) {
      eventData.payerId = payer;
      // payer ID を使用して、members配列から対応するメンバーを見つける
      const payerMember = members.find(m => m.id === payer);
      // メンバーが見つかった場合は、payerNameプロパティを追加
      if (payerMember) {
          eventData.payerName = payerMember.name;
      }
  }
  if (receiver && (activeTab === "income" || activeTab === "payment")) {
      eventData.receiverId = receiver;
  }

  // 親コンポーネントにデータを渡す
  onAdd(eventData);
};


  const totalRatio = selectedMembers.filter(m => m.selected).reduce((sum, m) => sum + m.ratio, 0);

  const renderInputStyle = (isFocused) => ({
    padding: "8px",
    border: `1px solid ${isFocused ? "#15ADFF" : "#92ABC5"}`,
    borderRadius: "8px",
    background: "#EDF1F6",
    transition: "border-color 0.2s ease-in-out",
    outline: "none",
  });

  return (
    // <Modal isOpen={isOpen} onClose={onClose}>
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "1.4em", margin: 0 }}>
          {initialData ? "イベントを編集" : "イベントを追加"}
        </h2>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* タブ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            marginBottom: "24px",
            background: "#F6FBFF",
            borderRadius: "8px",
            padding: "4px",
          }}
        >
          {["支出", "収入", "支払い"].map((label, index) => {
            const key = ["expense", "income", "payment"][index];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  background: activeTab === key ? "#E5ECF4" : "transparent",
                  color: "#333",
                  fontWeight: activeTab === key ? "bold" : "normal",
                  cursor: "pointer",
                  transition: "background 0.2s ease-in-out",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 共通フィールド */}
<div style={{ marginBottom: "16px" }}>
    <label
        style={{
            color: "#000000",
            fontSize: "1.1em",
            fontWeight: "bold",
            display: "block",
            marginBottom: "8px" 
        }}
    >
        タイトル
    </label>
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
        }}
    >
        <div
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '24px',
                        width: '40px',
                        textAlign: 'center',
                        border: focusedInput === "emoji" ? "2px solid #15ADFF" : "1px solid #92ABC5",
                        borderRadius: '8px',
                        padding: '4px 0',
                        transition: 'border-color 0.2s ease-in-out',
                    }}
                    onFocus={() => setFocusedInput("emoji")}
                    onBlur={() => setFocusedInput(null)}
                >
                    {emoji}
                </div>
                
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: 居酒屋"
                    onFocus={() => setFocusedInput("title")}
                    onBlur={() => setFocusedInput(null)}
                    className="title-input"
                    style={{
                        ...renderInputStyle(focusedInput === "title"),
                        flex: 1,
                        color:"#000000"
                    }}
                />
            </div>
            {/* ✅ EmojiPickerのコンポーネントを追加 */}
            {showEmojiPicker && (
                <div style={{ position: 'absolute', zIndex: 1000 }}>
                    <EmojiPicker
                        onEmojiClick={(emojiObject) => {
                            setEmoji(emojiObject.emoji);
                            setShowEmojiPicker(false); // 選択後にピッカーを非表示
                        }}
                    />
                </div>
            )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ color: "#000000", fontSize: "1.1em",fontWeight: "bold",
            display: "block",
            marginBottom: "8px" 
           }}>金額</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", 
            }}
          >
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              onFocus={() => setFocusedInput("amount")}
              onBlur={() => {
                setFocusedInput(null);
                if (amount === "") setAmount("0");
              }}
              style={{
                ...renderInputStyle(focusedInput === "amount"),
                flex: 1,
                borderRight: "none",
                borderRadius: "8px",
              }}
            />
            <select
              value={currency}
              onChange={handleCurrencyChange}
              onFocus={() => setFocusedInput("currency")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...renderInputStyle(focusedInput === "currency"),
                borderLeft: "none",
                borderRadius: "8px",
                background: "#EDF1F6",
                color: "#8491AC",
              }}
            >
              <option value="jpy">🇯🇵 日本円 (¥)</option>
              <option value="usd">🇺🇸 米ドル ($)</option>
              <option value="eur">🇪🇺 ユーロ (€)</option>
              <option value="krw">🇰🇷 韓国ウォン (₩)</option>
              <option value="cny">🇨🇳 中国元 (元)</option>
              {Object.entries(CURRENCIES)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name, 'ja'))
                .map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.flag} {value.name} ({value.symbol})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* 支出と収入の共通フィールド（支払者/受取人 + 日付） */}
        {(activeTab === "expense" || activeTab === "income") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ color: "#000000", fontSize: "1.1em",fontWeight: "bold",
                display: "block",
                marginBottom: "8px" 
               }}>
                {activeTab === "expense" ? "支払者" : "受取人"}
              </label>
              <select
                value={activeTab === "expense" ? payer : receiver}
                onChange={(e) =>
                  activeTab === "expense"
                    ? setPayer(e.target.value)
                    : setReceiver(e.target.value)
                }
                onFocus={() => setFocusedInput("payer-receiver")}
                onBlur={() => setFocusedInput(null)}
                style={{...renderInputStyle(focusedInput === "payer-receiver"),
                  width: "100%",
                }}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#000000", fontSize: "1.1em" ,fontWeight: "bold",
                display: "block",
                marginBottom: "8px" 
              }}>日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={() => setFocusedInput("date")}
                onBlur={() => setFocusedInput(null)}
                style={{
                    ...renderInputStyle(focusedInput === "date"),
                    width: "95%", // ✅ 修正点: width を 100% に変更
                }}
              />
            </div>
          </div>
        )}

        {/* 支払いの専用フィールド */}
        {activeTab === "payment" && (
          <>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ color: "#000000", fontSize: "1.1em",fontWeight: "bold",
                display: "block",
                marginBottom: "8px"  }}>支払者</label>
              <select
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                onFocus={() => setFocusedInput("payer-payment")}
                onBlur={() => setFocusedInput(null)}
                style={{...renderInputStyle(focusedInput === "payer-payment"),
                  width: "100%",
                }}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          
            <div style={{ flex: 1 }}>
              <label style={{ color: "#000000", fontSize: "1.1em",fontWeight: "bold",
                display: "block",
                marginBottom: "8px"  }}>日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={() => setFocusedInput("date-payment")}
                onBlur={() => setFocusedInput(null)}
                style={{...renderInputStyle(focusedInput === "date-payment"),
                  width: "95%",
                }}
              />          
            </div>            
          </div>
          <div style={{ flex: 1 }}>
              <label style={{ color: "#000000", fontSize: "1.1em",fontWeight: "bold",
                display: "block",
                marginBottom: "8px"  }}>受取人</label>
              <select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                onFocus={() => setFocusedInput("receiver-payment")}
                onBlur={() => setFocusedInput(null)}
                style={renderInputStyle(focusedInput === "receiver-payment")}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>


          {errorMessage && (
              <div
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  color: "red",
                  fontSize: "0.9em",
                }}
              >
                {errorMessage}
              </div>
            )}
          </>
        )}

        {/* 分け方（支出と収入のみ表示） */}
        {(activeTab === "expense" || activeTab === "income") && (
          <>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "16px",
                background: "#F6FBFF",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              {[
                { key: "equal", label: "割り勘" },
                { key: "ratio", label: "割合を指定" },
                { key: "custom", label: "金額をそれぞれ指定" },
              ].map((method) => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => setSplitMethod(method.key)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: splitMethod === method.key ? "#E5ECF4" : "transparent",
                    color: "#333",
                    fontWeight: splitMethod === method.key ? "bold" : "normal",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>

            {/* メンバー入力欄 */}
            <div
              style={{
                padding: "8px",
                border: "1px solid #92ABC5",
                borderRadius: "8px",
                background: "#EDF1F6",
              }}
            >
              {splitMethod === "custom" && errorMessage && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                  <span style={{ color: "red", fontSize: "0.9em" }}>{errorMessage}</span>
                </div>
              )}
              {selectedMembers.map(
                (m, index) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom:
                        index < selectedMembers.length - 1 ? "1px solid #92ABC5" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={m.selected}
                        onChange={() => toggleMember(m.id)}
                        style={{
                          transform: "scale(1.2)",
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ color: "#333" }}>{m.name}</span>
                    </div>

                    {splitMethod === "equal" && (
                      <span style={{ fontSize: "1.2em",color: "#15ADFF", fontWeight: "bold" }}>
                        {m.selected ? `${m.customAmount}¥` : "0¥"}
                      </span>
                    )}

                    {splitMethod === "ratio" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "1.1em", color: "#15ADFF",fontWeight: "bold" }}>
                          {m.selected ? `${Math.floor(Number(amount) * (m.ratio / totalRatio) || 0)}¥` : "0¥"}
                        </span>
                        {/*<div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", alignItems: "center" }}>
                        */}
                          <span style={{ padding: "4px 8px", borderRight: "1px solid #ddd" }}>{m.ratio}×</span>
                          <button
                            type="button"
                            onClick={() => changeRatio(m.id, -1)}
                            disabled={!m.selected}
                            style={{
                              padding: "8px 12px",
                              border: "none",
                              borderRight: "1px solid #ddd",
                              borderRadius: "8px",
                              background: "#DBE5F2",
                              cursor: "pointer",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            ー
                          </button>
                          <button
                            type="button"
                            onClick={() => changeRatio(m.id, 1)}
                            disabled={!m.selected}
                            style={{
                              padding: "8px 12px",
                              border: "none",
                              borderRadius: "8px",
                              background: "#DBE5F2",
                              cursor: "pointer",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            ＋
                          </button>
                        {/*
                        </div>
                        */}
                      </div>
                    )}

                    {splitMethod === "custom" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="number"
                          value={editedAmounts[m.id] !== undefined ? editedAmounts[m.id] : m.customAmount}
                          onChange={(e) => handleMemberAmountChange(m.id, e.target.value)}
                          onFocus={() => handleCustomInputFocus(m.id)}
                          onBlur={(e) => handleCustomInputBlur(m.id, e.target.value)}
                          disabled={!m.selected}
                          style={{
                            width: "80px",
                            textAlign: "right",
                            padding: "8px 8px",
                            background: "#DBE5F2",
                            borderRadius: "4px",
                            transition: "border-color 0.2s ease-in-out",
                            border: "none",
                          }}
                        />
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button type="button" 
                          style={{
                            textAlign: "right",
                            padding: "8px 12px",
                            background: "#DBE5F2",
                            borderRadius: "4px",
                            transition: "border-color 0.2s ease-in-out",
                            border: "none",
                          }}onClick={() => handleCalcButton(m.id, "+")} disabled={!m.selected}>+</button>
                          <button type="button" 
                          style={{
                            textAlign: "right",
                            padding: "8px 14px",
                            background: "#DBE5F2",
                            borderRadius: "4px",
                            transition: "border-color 0.2s ease-in-out",
                            border: "none",
                          }}
                          onClick={() => handleCalcButton(m.id, "-")} disabled={!m.selected}>-</button>
                          <button type="button" 
                          style={{
                            textAlign: "right",
                            padding: "8px 12px",
                            background: "#DBE5F2",
                            borderRadius: "4px",
                            transition: "border-color 0.2s ease-in-out",
                            border: "none",
                          }}
                          onClick={() => handleCalcButton(m.id, "*")} disabled={!m.selected}>×</button>
                          <button type="button" 
                          style={{
                            textAlign: "right",
                            padding: "8px 12px",
                            background: "#DBE5F2",
                            borderRadius: "4px",
                            transition: "border-color 0.2s ease-in-out",
                            border: "none",
                          }}
                          onClick={() => handleCalcButton(m.id, "/")} disabled={!m.selected}>÷</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#51bff9ff",
            color: "white",
            fontSize: "1em",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </form>
    </>
    //</Modal>
  );
}