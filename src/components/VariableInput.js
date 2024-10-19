// src/components/VariableInput.js
import React from 'react';

const VariableInput = ({ variables, onVariableChange, disabled, onBlur }) => (
  <div className="variable-input">
    <h3>Variable Inputs</h3>
    {Object.keys(variables).map((variable) => (
      <div key={variable} className="variable-item">
        <label className="variable-label">{variable}</label>
        <input
          type="number"
          className="variable-input-field"
          value={variables[variable]}
          onChange={(e) => onVariableChange(variable, e.target.value)}
          disabled={disabled} // Disable input if not saved
          onBlur={onBlur} // Call handleBlur when input loses focus
        />
      </div>
    ))}
  </div>
);

export default VariableInput;
