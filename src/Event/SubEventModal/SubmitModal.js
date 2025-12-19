import { doc, deleteDoc } from "firebase/firestore";

import "./SubEventModal.css"
import db from "../../firebase";

function SubmitModal({ isOpen, onClose, eventId, subevent}) {

 if (!isOpen) return null;


const handleDelete = async () => {
  try {
    const docRef = doc(db, "events", eventId, "SubEvents", subevent.id);
    await deleteDoc(docRef);
    onClose()
  } catch (err) {
    console.error("削除失敗:", err);
    alert("削除に失敗しました");
  }
};

  return (
    <div className="submit-overlay">
      <div className="submit-content">
        <p className="submit-text">削除しますか？</p>
        <hr className="submit-boder"/>
        <div className="submit-div">
        <button className="submit-cancel" onClick={onClose}>キャンセル</button>

        <button className="submit-delet" onClick={handleDelete}>削除</button>
        
</div>
        
        
      </div>
    </div>
  );
}

export default SubmitModal;