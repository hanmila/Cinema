import React, { useRef, useCallback } from 'react';
import hintIcon from '../img/hint.png';
import '../css/Tooltip.css';

export default function Tooltip({ onDoubleTap }) {
  const lastTap = useRef(0);
  const lock = useRef(false);

  // Безопасный вызов onDoubleTap (не чаще 500мс)
  const triggerZoom = useCallback(() => {
    if (lock.current) return;
    lock.current = true;

    onDoubleTap?.();

    setTimeout(() => {
      lock.current = false;
    }, 500);
  }, [onDoubleTap]);

  const handleTouch = (e) => {
    if (e.pointerType !== "touch") return; // только на touch

    const now = Date.now();
    const delta = now - lastTap.current;

    if (delta > 0 && delta < 300) {
      triggerZoom();       // двойной тап
      lastTap.current = 0; // сбросим время последнего тапа
    } else {
      lastTap.current = now;
    }
  };

  return (
    <div className="buying__info-hint" onPointerDown={handleTouch} style={{ cursor: "pointer" }}>
      <div className="tap">
        <img src={hintIcon} alt="hint" className="hint" />
        <p>Тапните дважды, чтобы увеличить</p>
      </div>
    </div>
  );
}