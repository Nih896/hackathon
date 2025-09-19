/*イベント名作成ページ*/

import { useEffect, useState } from 'react';
import './App.css';
//import db from "./firebase";
//import { doc, collection, getDocs, onSnapshot, addDoc } from "firebase/firestore"; 
import Checkbox from './Checkbox.svg'
import Select from 'react-select';


 const options = [
  { value: 'america', label: 'USD' },
  { value: 'england', label: 'GBP' },
  { value: 'china', label: 'CNY' },
  { value: 'japan', label: 'JPY' },
  { value: 'korea', label: 'KRW' },
  { value: 'europe', label: 'EUR' },
]

function App() {
  /*const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");  // 入力用 state
  const [text, setText] = useState("");    // 入力用 state*/

  const [text, setText] = useState(""); // 入力値を管理する状態

  const handleChange = (e) => {
    setText(e.target.value); // 入力値を状態に反映
  };

  const handleSelectChange = (selectedOption) => {
    setText(selectedOption.value);
  };
 

  return (
    <div className="App">
      
      <header className="App-header">
        <img src={Checkbox} className="App-logo" alt="アイコンの説明" />
        <h1>Checkout!</h1>
      </header>

      <main className="App-main">
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
            イベント名を入力してください{text}
          </p>
        </div>        
        <input className='App-input'
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="例）夕食"
        />

        <div className="App-form">
          <h2 className="App-h2">
            単位
          </h2>
        </div>        
        <Select className='App-input'
          options={options}
        />        
      </main>
    </div>
  );

  //***************************************************************** */
  
}

export default App;
