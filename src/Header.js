/*ヘッダー*/

import './App.css';
import Checkbox from './Checkbox.svg'

function Header() {
  return (
    <header className="App-header">
        <img src={Checkbox} className="App-logo" alt="アイコンの説明" />
        <h1>Checkout!</h1>
    </header>
  );
}

export default Header;