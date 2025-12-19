import React from "react";
import { useState } from "react";
import { CURRENCIES } from"./Country"
import "./EventCreate.css";
import "./CurrencyModal.css";
import { ReactComponent as SearchIcon } from "../img/Search.svg"

function CurrencyModal({ onClose, currency }) {

  const [searchTerm, setSearchTerm] = useState(""); //検索

  const sortedCurrenciesByCountry = []; //ソート配列  

  // 国ごとに展開して配列化
  Object.entries(CURRENCIES).forEach(([code, data]) => {
    for (let i = 0; i < data.country.length; i += 2) {
      sortedCurrenciesByCountry.push({
        code: code,
        symbol: data.symbol,
        currencyName: data.name,
        flag: data.flag[Math.floor(i/2)] || data.flag[0], 
        country: {
          jp: data.country[i],     // 偶数インデックス → 日本語
          en: data.country[i + 1]  // 奇数インデックス → 英語
        }
      });
    }
  });

  //検索機能
  const filteredCurrencies = sortedCurrenciesByCountry.filter(option =>
    option.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.currencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.flag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.country.jp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.country.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 英語名を基準にソート（日本語と英語が混在している場合も英語優先）
  sortedCurrenciesByCountry.sort((a, b) => {
    const aKey = String(a.country.en ?? "").toLowerCase();
    const bKey = String(b.country.en ?? "").toLowerCase();
    return aKey.localeCompare(bKey, "en");
  });
  
  // 頭文字ごとにグループ化
  const grouped = sortedCurrenciesByCountry.reduce((acc, option) => {
    const letter = (option.country.en || option.country.jp).charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(option);
    return acc;
  }, {});

  return (
    <div className="modal-overlay">
      <div className="modal-content">     
        <button
          className="modal-btn"
          onClick={onClose}
        >
          ✕
        </button>          
        <div className="modal-body">
          <h2 className="modal-h2">国を選択</h2>

          <div className="modal-searchbox">  
            <SearchIcon className="modal-icon"/>        
            <input
              className="modal-search"       
              type="text"
              placeholder={"検索"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />      
          </div>

          <hr className="modal-boder"/>

          <span className="modal-expect">提案</span>

          {/* 提案リスト */}
          <ul className="modal-list">
            {searchTerm.trim() === "" ? (
              // 検索欄が空のとき → 何も表示しない
              <div className="modal-none"></div>
            ) : filteredCurrencies.length === 0 ? (
              // ヒットが0件のとき → 何も表示しない
              <div className="modal-none"></div>
            ) : (
              filteredCurrencies.map((option, index) => (                
                <li
                  key={option.country.en}
                  className={`modal-item ${index === filteredCurrencies.length - 1 ? "last-item" : ""}`}
                  onClick={() => {
                  currency(option.code);
                  onClose();
                  }}
                >
                  <div className="modal-country">
                    <div className="modal-flag">{option.flag}</div> {option.country.jp}
                  </div>
                  <div className="modal-currency">
                    <div className="modal-upper">{option.code}</div>
                      ({option.symbol})
                  </div>             
                </li>
              ))
            )}
          </ul>

          {/* 国リスト */}
          <div>
            {Object.keys(grouped).sort().map(letter => ( //頭文字（アルファベット）の配列
              <React.Fragment key={letter}>
                {/* 頭文字 */}
                <span className="modal-heading">{letter}</span>
                {/* 枠で囲む */}
                <ul className="modal-list">
                  {grouped[letter].map((option, index) => (
                    <li
                      key={option.code + "-" + option.country.en}
                      className={`modal-item ${index === grouped[letter].length - 1 ? "last-item" : ""}`}
                      onClick={() => {
                        currency(option.code); // 親にオブジェクト丸ごと渡す
                        onClose();// モーダルを閉じる
                    }}
                    >
                      <div className="modal-country">
                        <div className="modal-flag">{option.flag}</div> {option.country.jp}
                      </div>
                      <div className="modal-currency">
                        <div className="modal-upper">{option.code}</div>
                        ({option.symbol})
                      </div>    
                    </li>
                  ))}
                </ul>            
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrencyModal;