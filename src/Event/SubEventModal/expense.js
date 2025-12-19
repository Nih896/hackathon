import CURRENCIES from "../../EventCreatePage/Country";
import './SubEventModal.css';

function expense({ subevent }) {

  return (
    <div className="Modal-all">
      <h2 className="Modal-h2">
          支出
      </h2>
      <div className="Modal-costbox">
        <span className="Modal-text">
          {subevent.payerName}
        </span>
        <p className="Modal-cost">{subevent.amount}{CURRENCIES[subevent.currency].symbol}</p>
      </div>

      <h2 className="Modal-h2">内訳</h2>
      <div className="Modal-member">
        {subevent.members.map((member, index) => (
          <div key={member.id}>
            <div className="Modal-membercard">
              <span className="Modal-membername">{member.name}</span>
              <span className="Modal-memberamount">{member.shareAmount}{CURRENCIES[subevent.currency].symbol}</span>
            </div>
            {index < subevent.members.length - 1 && (
              <hr className="Modal-boder" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default expense;