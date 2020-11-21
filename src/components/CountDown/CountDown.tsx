import React, { useState, useEffect } from "react";
import getTimeRemaining from "./../../helpers/getTimeRemaining";

interface Props {
  expire: number;
  onComplete(): void;
  onTick(remaining: any): void;
}

const Countdown = (props: Props) => {
  const { expire, onComplete, onTick } = props;
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(launch, [expire]);

  function launch() {
    if (expire > Date.now()) {
      const timer = setInterval(() => {
        const t = getTimeRemaining(expire);
        setSeconds(t.seconds);
        setMinutes(t.minutes);
        if (onTick && typeof onTick === "function") {
          onTick(t);
        }
        if (t.total <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }

  return (
    <span className="countdown">
      <span className="countdown__minutes">
        {minutes.toString().padStart(2, "0")}
      </span>
      :
      <span className="countdown__seconds">
        {seconds.toString().padStart(2, "0")}
      </span>
    </span>
  );
};

export default React.memo(Countdown);
