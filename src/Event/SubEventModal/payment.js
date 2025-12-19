import CURRENCIES from "../../EventCreatePage/Country";
import './SubEventModal.css';

function payment({ subevent }) {

  return (
    <div className="Modal-all">
      <h2 className="Modal-h2">
          支払い
      </h2>
      <p className="Modal-h3">
          支払人
      </p>
      <div className="Modal-costbox">
        <span className="Modal-text">{(() => {
          const payer = subevent.members?.find(m => m.id === subevent.payerId);
          return payer ? payer.name : subevent.payerId; 
        })()}</span>
        <p className="Modal-cost">{subevent.amount}{CURRENCIES[subevent.currency].symbol}</p>
      </div>

      <p className="Modal-h3">
          受取人
      </p>
      <div className="Modal-costbox">
        <span className="Modal-text">{(() => {
          const receiver = subevent.members?.find(m => m.id === subevent.receiverId);
          return receiver ? receiver.name : subevent.payerId; 
        })()}</span>
        <p className="Modal-cost">{subevent.amount}{CURRENCIES[subevent.currency].symbol}</p>
      </div>
        
      
    </div>
  );
}

export default payment;