// src/components/FormulaInput.js
import React from 'react';

const FormulaInput = ({ formula, onFormulaChange }) => {
  return (
    <input
      type="text"
      value={formula}
      onChange={onFormulaChange}
      placeholder="Enter formula (e.g., a + b * c)"
      className="formula-input"
    />
  );
};

export default FormulaInput;
