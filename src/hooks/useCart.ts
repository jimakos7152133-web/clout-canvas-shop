import { useState, useEffect } from 'react';

// Generate cryptographically secure session ID
const generateSecureSessionId = (): string => {
  // Create a secure random session ID with sufficient entropy
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `cart_session_${timestamp}_${randomHex}`;
};

// Validate session ID format for security
const isValidSessionId = (sessionId: string): boolean => {
  if (!sessionId || typeof sessionId !== 'string') return false;
  
  // Must start with cart_session_ and be at least 40 characters
  const pattern = /^cart_session_\d{13}_[a-f0-9]{32}$/;
  return pattern.test(sessionId);
};

export const useCart = () => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Get or create session ID for cart with enhanced security
    let cartSessionId = localStorage.getItem('cart_session_id');
    
    // Validate existing session ID or create new one
    if (!cartSessionId || !isValidSessionId(cartSessionId)) {
      cartSessionId = generateSecureSessionId();
      localStorage.setItem('cart_session_id', cartSessionId);
    }
    
    setSessionId(cartSessionId);
  }, []);

  // Clear session (useful for testing or manual reset)
  const clearSession = () => {
    localStorage.removeItem('cart_session_id');
    const newSessionId = generateSecureSessionId();
    localStorage.setItem('cart_session_id', newSessionId);
    setSessionId(newSessionId);
  };

  return { 
    sessionId,
    clearSession,
    isValidSession: sessionId && isValidSessionId(sessionId)
  };
};