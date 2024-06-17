import React, { useContext, useState } from 'react';
import Countdown from 'react-countdown';
import { AuthContext } from '../../context/AuthContext';

const renderer = ({ days, hours, minutes, seconds, completed, props }) => {

  if (completed) {
    if(props.owner){
      if(!(props.owner.uid === props.item.curWinnerUid || props.owner.email === props.item.email)){
        return null;
      }
    }else{
      return null;
    }
  }


  const handleBidChange = (e) => {
    props.setBidValue(e.target.value);
    props.setErrorMessage('');
  };

  const handleBidSubmit = async () => {
    const bid = parseFloat(props.bidValue);
    if (bid > props.item.curPrice) {
      await props.bidAuction(props.item.id, bid);
      props.setBidValue('');
      props.setErrorMessage('');
      window.location.reload() // Clear error message after successful bid
    } else {
      props.setErrorMessage(`Bid must be greater than the current price of $${props.item.curPrice}`);
    }
  };

  return (
    <div className="col">
      <div className="card shadow-sm">
        <div
          style={{
            height: '320px',
            backgroundImage: `url(${props.item.imgUrl})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
          className="w-100"
        />

        <div className="card-body">
          <p className="lead display-6">{props.item.title}</p>
          <div className="d-flex jsutify-content-between align-item-center">
            <h5>
              {days * 24 + hours} hr: {minutes} min: {seconds} sec
            </h5>
          </div>
          <p className="card-text">{props.item.desc}</p>
          <div className="d-flex justify-content-between align-item-center">
            <div>
              {!props.owner ? (
                <div
                  onClick={() => props.bidAuction()}
                  className="btn btn-outline-secondary"
                >
                  Bid
                </div>
              ) : props.owner.email === props.item.email ? (
                <div>
                  <div
                  onClick={() => props.endAuction(props.item.id)}
                  className="btn btn-outline-secondary"
                  >
                  Cancel Auction
                  </div>
                </div>
              ) : props.owner.email === props.item.curWinner ? (
                <div>
                {!props.item.paymentCompleted ? (<p className="display-6">You Bid highest</p>)  : (<p className="display-6">Payment Completed</p>)}
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    value={props.bidValue}
                    onChange={handleBidChange}
                    placeholder={`Minimum bid: $${props.item.curPrice + 10}`}
                    className="form-control"
                    min={props.item.curPrice + 1}
                  />
                  <button onClick={handleBidSubmit} className="btn btn-outline-secondary mt-2">
                    Place Bid
                  </button>
                  {props.errorMessage && (
                    <div className="text-danger mt-2">
                      {props.errorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="display-6">${props.item.curPrice}</p>
          </div>
          <div className="align-item-center">
            <div>
              { props.owner && completed && props.owner.email === props.item.curWinner && ! props.item.paymentCompleted &&  (
                <div
                  onClick={async() => {await props.addToCart(props.item.id); window.location.reload()}}
                  className="btn btn-outline-secondary"
                >
                  Add to Cart
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuctionCard = ({ item }) => {
  let expiredDate = item.duration;
  const { currentUser, bidAuction, endAuction, addToCart} = useContext(AuthContext);
  const [bidValue, setBidValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  return (
    <Countdown
      owner={currentUser}
      date={expiredDate}
      bidAuction={bidAuction}
      endAuction={endAuction}
      bidValue={bidValue}
      setBidValue={setBidValue}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      addToCart = {addToCart}
      item={item}
      renderer={renderer}
    />
  );
};
