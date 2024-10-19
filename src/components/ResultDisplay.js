// src/components/ResultDisplay.js
import React from 'react';

const ResultDisplay = ({ result, error }) => (
  <div className={`result ${error ? 'error' : 'success'}`}>
    {error ? <span className="error">{error}</span> : `Result = ${result}`}
  </div>
);

export default ResultDisplay;
