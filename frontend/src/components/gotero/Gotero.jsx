import React, { useState } from 'react';
import FormGotero from './Formgotero';
import ResultadoGotero from './ResultadoGotero';
import DripAnimacion from './DripAnimacion';
import './Gotero.css';

const Gotero = () => {
  const [results, setResults] = useState(null);
  const [dropCount, setDropCount] = useState(0);

  const handleCalculate = (data) => {
    let volumeInMl = data.volumeUnit === 'liters' ? data.volume * 1000 : data.volume;
    let timeInMinutes = data.timeUnit === 'hours' ? data.time * 60 : data.time;
    const dropsPerMl = data.goteroType === 'Normogotero' ? 20 : 60;
    const dropsPerMinute = Math.round((volumeInMl * dropsPerMl) / timeInMinutes);

    setResults({
      volume: data.volume,
      volumeUnit: data.volumeUnit,
      time: data.time,
      timeUnit: data.timeUnit,
      goteroType: data.goteroType,
      dropsPerMinute: dropsPerMinute,
    });

    // Reset drop count
    setDropCount(0);
  };

  const handleDropCountChange = () => {
    setDropCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="gotero-container">
      <h1>Calculadora de Goteo</h1>
      <div className="gotero-content">
        <FormGotero onCalculate={handleCalculate} />
        {results && (
          <div className="resultado-animacion-container">
            <ResultadoGotero results={results} dropCount={dropCount} />
            <DripAnimacion dropsPerMinute={results.dropsPerMinute} onDropCountChange={handleDropCountChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gotero;