import { useEffect, useRef } from "react";

export const SessionTimer = ({ duration, onTimeout = () => null }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onTimeout();
    }, duration * 1000);

    return () => clearTimeout(timerRef.current);
  }, [duration, onTimeout]);

  return <div>Session will expire in {duration} seconds.</div>;
};
