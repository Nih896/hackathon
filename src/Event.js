
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Event() {

    const { eventId } = useParams();
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    return(

    <div><h1>こんにちは</h1>
<p>イベントID: {eventId}</p>
</div>
)

    /*useEffect(() => {
        //データベースからデータ取得する.
        const postData = collection(db, "posts");
        //初回データ取得
        getDocs(postData).then((snapShot) => {
        //console.log(snapShot.docs.map((doc) => ({ ...doc.data() })));
        setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })))
        });

        //リアルタイムで取得
        onSnapshot(postData, (post) => {
        setPosts(post.docs.map((doc) => ({ ...doc.data() })));
        });

        // ページ読み込み時に localStorage から復元
        
        const savedPost = localStorage.getItem("lastPost");
        if (savedPost) {
        const { title, text } = JSON.parse(savedPost);
        setTitle(title);
        setText(text);
        }
    }, []);*/    

    }

    export default Event;