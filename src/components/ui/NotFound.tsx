import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Page not found</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div>
        <button
          onClick={() => navigate({ to: '/' })}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 6,
            border: 'none',
            background: '#111827',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Go to home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
