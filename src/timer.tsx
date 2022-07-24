import { useState, useEffect } from 'react';

const Timer = ({active, resetTimer}:any) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  useEffect(()=>{
    setIsActive(active);
  },[active])

  useEffect(()=>{
    // console.log("reset timer");
    setSeconds(0);
  }, [resetTimer])

  function toggle() {
    setIsActive(!isActive);
    console.log(isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval:any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds:any) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="app">
      <div className="time">
        {seconds} s
      </div>
    </div>
  );
};

export default Timer;