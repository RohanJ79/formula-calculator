// src/components/SavedFormulas.js
import React from 'react';

const SavedFormulas = ({ savedFormulas, onLoadFormula }) => (
  <div className="saved-formulas">
    <h3>Saved Formulas</h3>
    {savedFormulas.length > 0 ? (
      <ul>
        {savedFormulas.map((formula, index) => (
          <li
            key={index}
            className="saved-formula-item"
            onClick={() => onLoadFormula(formula)}
          >
            {formula}
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-formulas">No saved formulas yet.</p>
    )}
  </div>
);

export default SavedFormulas;
