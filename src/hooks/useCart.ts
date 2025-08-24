import { useState, useEffect } from 'react';

export const useCart = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Get or create session ID for cart
    let cartSessionId = localStorage.getItem('cart_session_id');
    if (!cartSessionId) {
      cartSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cart_session_id', cartSessionId);
    }
    setSessionId(cartSessionId);
  }, []);

  return { sessionId };
};