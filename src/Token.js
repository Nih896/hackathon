import { useEffect, useState } from "react";
import './Token.css';

function Token({ text, subtext, duration = 3000, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // mountされたら表示
    setShow(true);

    // duration 後に消える
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(); // 完全に消えた後に親へ通知
    }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

  return (
    <div className={`token-container ${show ? "show" : ""}`}>
      <p className="Token-text">{text}</p>
      <p className="Token-subtext">{subtext}</p>
    </div>
  );
}

export default Token;
