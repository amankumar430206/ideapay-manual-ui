import React from "react";
import "./card.style.scss";

const CreditCard = ({ companyName, cardNumber, cardHolder, expiryDate }) => {
  return (
    <div className="credit-card">
      <div className="company-name">{companyName}</div>
      <div className="card-info">
        <div className="card-holder">{cardHolder}</div>
        <div className="expiry">{expiryDate}</div>
      </div>
      <div className="card-number">{cardNumber}</div>
    </div>
  );
};

export default CreditCard;
