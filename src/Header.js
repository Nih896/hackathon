/*ヘッダー*/

import { useParams, useNavigate } from "react-router-dom";
import './App.css';
import Checkbox from './img/Checkbox.svg'

function Header() {
    const navigate = useNavigate();
  return (
    <header className="App-header">
      <div onClick={() => 
              navigate(`/FirstPage`)
            }
            className="App-flex"
      >
        <img src={Checkbox} className="App-logo" alt="アイコンの説明" />
        <h1>Checkout!</h1>
      </div>
    </header>
  );
}

export default Header;