/*rootファイル*/

import './App.css';
import Header from "./Header";
import { Routes, Route, Link } from 'react-router-dom';
import Event from './Event';
import EventCreatePage from './EventCreatePage';

//import db from "./firebase";
//import { doc, collection, getDocs, onSnapshot, addDoc } from "firebase/firestore"; 

function App() {
  /*const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");  // 入力用 state
  const [text, setText] = useState("");    // 入力用 state*/


  return (
    <div className='App'>
      <Header />
      <div>
        <Routes>
          <Route path="/EventCreatePage" element={<EventCreatePage />} />
          <Route path="/event/:id" element={<Event />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
