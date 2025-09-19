/*rootファイル*/

import './App.css';
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
    <div className="App">
        <Routes>
        <Route path="/EventCreatePage" element={<EventCreatePage />} />
        <Route path="/Event" element={<Event />} />
      </Routes>
    </div>
  );

  //***************************************************************** */
  
}

export default App;
