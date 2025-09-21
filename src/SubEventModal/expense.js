import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

import db from "../firebase";
import '../App.css';
import '../Event.css';

function expense({ subevent }) {


  return (
    <div>
        <h2 className="Modal-h2">
            支出
        </h2>

        <div className="Modal-cost">
            <p>{(() => {
      const receiver = subevent.members?.find(m => m.id === subevent.payerId);
      return receiver ? receiver.name : subevent.payerId; 
    })()}</p>
            <p>{subevent.amount}</p>
        </div>
        <h2 className="Modal-h2">内訳</h2>

        {subevent.members.map((member) => (
        <div key={member.id} className="member-row">
      <span className="member-name">{member.name}</span>
      <span className="member-amount">{member.shareAmount}円</span>
    </div>
  ))}

</div>
  );
}

export default expense;