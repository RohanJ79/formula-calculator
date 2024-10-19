// src/App.js
import React, { useState } from 'react';
import { create, all } from 'mathjs';
import FormulaInput from './components/FormulaInput';
import LatexDisplay from './components/LatexDisplay';
import VariableInput from './components/VariableInput';
import ResultDisplay from './components/ResultDisplay';
import SavedFormulas from './components/SavedFormulas';
import { config } from './config';
import './App.css';

const math = create(all);

const App = () => {
  const [formula, setFormula] = useState('');
  const [variables, setVariables] = useState({});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [savedFormulas, setSavedFormulas] = useState([]);
  const [isFormulaSaved, setIsFormulaSaved] = useState(false); // New state for tracking if formula is saved

  const handleFormulaChange = (e) => {
    const input = e.target.value;
    setFormula(input);
    detectVariables(input);
    // Reset result and error when formula changes
    setResult('');
    setError('');
  };

  const detectVariables = (input) => {
    const foundVariables = [...new Set(input.match(/[a-zA-Z]/g))];

    if (foundVariables) {
      const newVariables = {};

      foundVariables.forEach((variable) => {
        if (!(variable in variables)) {
          newVariables[variable] = ''; // Initialize variable value if not already present
        }
      });
      setVariables((prev) => ({ ...prev, ...newVariables }));
    }
  };

  // Handle changes to variable inputs
  const handleVariableChange = (variable, value) => {
    // Allow empty input for clearing and parse valid numbers
    if (value === '' || !isNaN(value)) {
      // Convert value to a number if it's not empty
      setVariables((prev) => ({
        ...prev,
        [variable]: value === '' ? '' : Number(value),
      }));
      validateInputsAndCalculate(); // Validate inputs before calculating
    }
  };

  // Validate all inputs before calculation
  const validateInputsAndCalculate = () => {
    for (const variable in variables) {
      if (variables[variable] === '' || isNaN(variables[variable])) {
        setError(`Variable "${variable}" must be a valid number.`);
        return; // Stop calculation if any variable is invalid
      }
    }
    calculateResult(formula); // Proceed to calculate if all inputs are valid
  };

  const calculateResult = (input) => {
    try {
      if (!input.trim()) throw new Error('Formula cannot be empty.');

      // Check for empty variables
      for (const variable in variables) {
        if (variables[variable] === '') {
          console.log();
          throw new Error(`Variable "${variable}" cannot be empty.`);
        }
      }

      // Replace variables with their values or default to zero if undefined
      let evaluatedInput = replaceVariables(input);

      // Check for invalid characters
      if (!isValidFormula(evaluatedInput))
        throw new Error('Invalid characters in formula.');

      // Check for division by zero in the evaluated input
      checkDivisionByZero(evaluatedInput);

      // Perform calculation using a safe eval-like approach with support for basic math functions.
      const calculatedValue = evaluateExpression(evaluatedInput);

      // Check if the calculated value is a valid number
      if (isNaN(calculatedValue))
        throw new Error('Calculation resulted in an invalid number.');

      setResult(calculatedValue);
      setError('');
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    setError(
      err.message.includes('invalid formula')
        ? 'Error: Invalid formula syntax.'
        : err.message
    );
    setResult(null); // Clear result on error
  };

  const replaceVariables = (input) => {
    return input.replace(/[a-zA-Z]/g, (match) =>
      variables[match] !== undefined ? variables[match] : 0
    );
  };

  const checkDivisionByZero = (input) => {
    if (/\/\s*0(\.0+)?/.test(input))
      throw new Error('Error: Division by zero is not allowed.');
  };

  // Helper function to validate the formula
  const isValidFormula = (input) => {
    const regex = /^(\s*-?\d+(\.\d+)?\s*[-+*/]?\s*)+$/;
    return regex.test(input);
  };

  // Evaluate mathematical expressions safely
  const evaluateExpression = (expr) => {
    try {
      return math.evaluate(expr); // Use math.js to evaluate the expression
    } catch (error) {
      throw new Error('Invalid mathematical expression.');
    }
  };

  const saveFormula = () => {
    if (formula && !savedFormulas.includes(formula)) {
      setSavedFormulas([...savedFormulas, formula]);
      setIsFormulaSaved(true); // Set to true when formula is saved
    }
  };

  const loadFormula = (loadedFormula) => {
    setFormula(loadedFormula);
    detectVariables(loadedFormula);
    calculateResult(loadedFormula);
  };

  return (
    <div className="calculator">
      <h1>Formula Calculator</h1>

      <FormulaInput formula={formula} onFormulaChange={handleFormulaChange} />

      <LatexDisplay formula={formula} />

      <VariableInput
        variables={variables}
        onVariableChange={handleVariableChange}
        disabled={!isFormulaSaved} // Disable if formula is not saved
      />

      <ResultDisplay result={result} error={error} />

      {config.enableFormulaSaving && (
        <button onClick={saveFormula}>Save Formula</button>
      )}
      {config.enableAdvancedFeatures && (
        <SavedFormulas
          savedFormulas={savedFormulas}
          onLoadFormula={loadFormula}
        />
      )}
    </div>
  );
};

export default App;
