import React from 'react';

const spinnerStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--button-bg)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

// Add keyframes to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

// PUBLIC_INTERFACE
function LoadingSpinner() {
  return (
    <div style={spinnerStyles.container}>
      <div style={spinnerStyles.spinner} />
    </div>
  );
}

export default LoadingSpinner;
