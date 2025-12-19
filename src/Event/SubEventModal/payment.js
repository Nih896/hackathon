import CURRENCIES from "../../EventCreatePage/Country";
import './SubEventModal.css';

function payment({ events, subevent }) {

  return (
    <div className="Modal-all">
      <h2 className="Modal-h2">
          支払い
      </h2>
      <p className="Modal-h3">
          支払人
      </p>
      <div className="Modal-costbox">
        <span className="Modal-text">
          {
            events?.members?.find(
              (members) => String(members.id) === String(subevent.payerId)
            )?.name || "不明"
          }
        </span>
        <p className="Modal-cost">{subevent.amount}{CURRENCIES[subevent.currency].symbol}</p>
      </div>

      <p className="Modal-h3">
          受取人
      </p>
      <div className="Modal-costbox">
        <span className="Modal-text">
          {
            events?.members?.find(
              (members) => String(members.id) === String(subevent.receiverId)
            )?.name || "不明"
          }
        </span>
        <p className="Modal-cost">{subevent.amount}{CURRENCIES[subevent.currency].symbol}</p>
      </div>
      
    </div>
  );
}

export default payment;