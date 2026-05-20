import React, { useState, useEffect } from 'react';
import { setToastShowFunc } from '../utils/helpers';
import './Toast.css';

export function Toast() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setToastShowFunc((msg, toastType = '') => {
      setMessage(msg);
      setType(toastType);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className={`toast ${type} ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
}
