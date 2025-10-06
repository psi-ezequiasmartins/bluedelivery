/**
 * src/context/SessionTimeOFF.jsx
 */

import { useEffect, useRef } from 'react';

export default function SessionTimeout({ onTimeout, timeout }) {
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // console.log("Timeout redefinido.");
    timeoutRef.current = setTimeout(() => {
      // console.log("Tempo de inatividade excedido. Chamando onTimeout.");
      onTimeout();
    }, timeout);
  }

  function handleActivity() {
    resetTimeout();
  }

  useEffect(() => {
    // console.log("Iniciando monitoramento de inatividade.");
    resetTimeout();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
    // eslint-disable-next-line
  }, [onTimeout, timeout]);

  return null;
}
