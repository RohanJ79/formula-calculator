// src/components/LatexDisplay.js
import React from 'react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { BlockMath } from 'react-katex';

const LatexDisplay = ({ formula }) => (
  <div className="latex-display">
    <h3>Formula:</h3>
    <BlockMath math={formula} />
  </div>
);

export default LatexDisplay;
