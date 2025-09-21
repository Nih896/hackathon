import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

import db from "../firebase";
import './SubEventModal.css';

function Income({ subevent }) {


  return (
    <div>
        <h2 className="Modal-h2">
            収入
        </h2>

        <div className="Modal-cost">
            <p>{(() => {
      const receiver = subevent.members?.find(m => m.id === subevent.receiverId);
      return receiver ? receiver.name : subevent.receiverId; 
    })()}</p>
            <p>{subevent.amount}</p>
        </div >
        <h2 className="Modal-h2">内訳</h2>

        <div className="Modal-box">

              {subevent.members.map((member) => (
              <div className="Modal"
                key={member.id}>
            <p className="member-name">{member.name}</p>
            <p className="member-amount">{member.shareAmount}円</p>
          </div>
        ))}
        </div>

</div>
  );
}

export default Income;