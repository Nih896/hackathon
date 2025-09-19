import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import './App.css';
import { useEffect, useState } from 'react';


 const options = [
  { value: 'japan', label: 'JPY(¥)' },
  { value: 'america', label: 'USD($)' },
  { value: 'europe', label: 'EUR(€)' },
]

function EventCreatePage() {
  const navigate = useNavigate();

    const [text, setText] = useState(""); // 入力値を管理する状態

  const handleClick = () => {
    navigate("/Event");
  };

    const handleChange = (e) => {
    setText(e.target.value); // 入力値を状態に反映
  };

  const handleSelectChange = (selectedOption) => {
    setText(selectedOption.value);
  };
 

  return (
    <div className="App">

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
        <Select className='App-select'
          components={{IndicatorSeparator: () => null,}}
          options={options}
        />

        <div className="App-form">
          <h2 className="App-h2">
            参加者
          </h2>
          <p className='App-error'>
            イベント名を入力してください{text}
          </p>
        </div>  
        <input className='App-input'
          type="text"
          value={text}
          onChange={handleChange}
        />
      <h1>イベントを作成</h1>
      {/* フォームなど省略 */}
      <button onClick={handleClick}>イベントを作成</button>
    </main>
    </div>
  );
}

export default EventCreatePage;