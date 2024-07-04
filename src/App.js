import './App.scss';
import React, { useState, useEffect, useRef } from 'react';
import alarm from "./alarm.mp3";

function App() {
  const [breakLength, setBreakLength] = useState(5 * 60);
  const [sessionLength, setSessionLength] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerOn , setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const intervalRef = useRef(null);

  const playBreakAlarm = () => {
    document.getElementById("beep").currentTime = 0;
    document.getElementById("beep").play()
  }

  useEffect(() => {
    if (timerOn) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            if (onBreak) {
              playBreakAlarm();
              setOnBreak(false);
              return sessionLength;
            } else {
              playBreakAlarm();
              setOnBreak(true);
              return breakLength;
            }
          }
          return prev - 1;
        });
      }, 1000); // Update every second

      return () => clearInterval(intervalRef.current);
    }
  }, [timerOn, onBreak, sessionLength, breakLength]);

  const startStop = () => {
    setTimerOn((prev) => !prev);
  }

  const reset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
    setTimeLeft(25 * 60);
    setOnBreak(false);
    setTimerOn(false);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return(
      (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    )
  }

  const changeTime = (value, type) => {
    if(type === "break"){
      if(breakLength <= 60 && value < 0 || breakLength >= 3600 && value > 0){
        return;
      }
      setBreakLength((prev) => prev + value);
    }
    else{
      if(sessionLength <= 60 && value < 0 || sessionLength >= 3600 && value > 0){
        return;
      }
      setSessionLength((prev) => prev + value);
      if(!timerOn){
        setTimeLeft(sessionLength + value)
      }
    }
  }

  return (
    <div className="App">
      <div>
        <p id="break-label">Break Length</p>
        <button id="break-increment" onClick={() => changeTime(60, "break")}>increment</button>
        <button id="break-decrement" onClick={() => changeTime(-60, "break")}>decrement</button>
        <p id="break-length">{breakLength / 60}</p>
      </div>

      <div>
        <p id="session-label">Session Length</p>
        <button id="session-increment" onClick={() => changeTime(60, "session")}>increment</button>
        <button id="session-decrement" onClick={() => changeTime(-60, "session")}>decrement</button>
        <p id="session-length">{sessionLength / 60}</p>
      </div>

      <div>
        <p id="timer-label">{onBreak ? "Break" : "Session"}</p>
        <p id="time-left">{formatTime(timeLeft)}</p>
        <button id="start_stop" onClick={() => {startStop()}}>⏯</button>
        <button id="reset" onClick={() => {reset()}}>🔄</button>
        <audio id="beep" src={alarm}></audio>
      </div>
    </div>
  );
}

export default App;
