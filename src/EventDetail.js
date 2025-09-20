import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "./firebase";

function EventDetail({ id }) {
  const [subevents, setSubevents] = useState([]);

  useEffect(() => {
    const fetchSubevents = async () => {
      try {
        // 文字列でパスを指定する方がわかりやすい
        const subeventsRef = collection(db, "events", id, "SubEvents");
        const subeventsSnap = await getDocs(subeventsRef);

        const data = subeventsSnap.docs.map((d) => ({
          id: d.id,   // ← Firestore の subEvent ドキュメント ID
          ...d.data()
        }));

        console.log("Fetched SubEvents:", data); // 🔍 デバッグ用
        setSubevents(data);
      } catch (error) {
        console.error("Error fetching SubEvents:", error);
      }
    };

    fetchSubevents();
  }, [id]);

  return (
    <div>
      <h2>サブイベント一覧</h2>
      {subevents.length === 0 ? (
        <p>サブイベントはまだありません</p>
      ) : (
        <ul>
          {subevents.map((se) => (
            <li key={se.id}>
              <strong>{se.title}</strong>
              <br />
              日時: {new Date(se.datetime).toLocaleString("ja-JP")}
              <br />
              金額合計:{" "}
              {se.transactions?.reduce((sum, t) => sum + t.amount, 0)} 円
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventDetail;