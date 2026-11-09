import { useEffect, useState } from 'react';

interface Props {
  enabled: boolean;
  seconds: number;
  running: boolean;
  onExpire: () => void;
  resetKey: string | number;
}

export function Clock({ enabled, seconds, running, onExpire, resetKey }: Props) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (!enabled || !running) return;
    if (left <= 0) {
      onExpire();
      return;
    }
    const t = window.setInterval(() => {
      setLeft((v) => v - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [enabled, running, left, onExpire]);

  if (!enabled) return null;

  const m = Math.floor(left / 60);
  const s = left % 60;
  const urgent = left <= 10;

  return (
    <div className={`clock ${urgent ? 'clock--urgent' : ''}`} aria-live="polite">
      ⏱ {m}:{String(s).padStart(2, '0')}
    </div>
  );
}
