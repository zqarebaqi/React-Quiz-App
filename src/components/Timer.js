import React, { useEffect } from 'react';

const Timer = ({ dispatch, secoundRemaining }) => {
    const mins = Math.floor(secoundRemaining / 60);
    const secounds = secoundRemaining % 60;
  useEffect(() => {
    const IntervalId = setInterval(function () {
      dispatch({ type: "tick" });
    }, 1000);
      return ()=> clearInterval(IntervalId)
  }, [dispatch]);

    return <div className="timer">{mins < 10 && "0"}{mins}:{secounds < 10 && "0"}{secounds }</div>;
};

export default Timer;
