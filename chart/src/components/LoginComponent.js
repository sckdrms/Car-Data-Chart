import React, { useState } from 'react';
import '../css/LoginComponent.css';

function LoginComponent() {
  // State to manage the flip card toggle
  const [isFlipped, setIsFlipped] = useState(false);

  // Toggle flip state
  const handleToggleChange = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" checked={isFlipped} onChange={handleToggleChange} />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className={`flip-card__inner ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form">
                <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                <button className="flip-card__btn">Let`s go!</button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form">
                <input className="flip-card__input" placeholder="Name" type="text" />
                <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                <button className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default LoginComponent;
