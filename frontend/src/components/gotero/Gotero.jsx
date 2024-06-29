import React, { useState } from 'react';
import FormGotero from './Formgotero';
import ResultadoGotero from './ResultadoGotero';
import DripAnimacion from './DripAnimacion';
import './Gotero.css';
import { IconButton } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop'; // Importa el icono de parar rojo
const Gotero = () => {
  const [results, setResults] = useState(null);
  const [dropCount, setDropCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    // Start animation
    setIsAnimating(true);
  };

  const handleDropCountChange = () => {
    setDropCount((prevCount) => prevCount + 1);
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
  };

  return (
    <div className="gotero-container">
      <h1>Calculadora de Goteo</h1>
      <div className="gotero-content">
        <FormGotero onCalculate={handleCalculate} />
        {results && (
          <div className="resultado-container">
            <ResultadoGotero results={results} dropCount={dropCount} />
            <div className="resultado-animacion-container">
              {isAnimating && (
               <IconButton color="error" onClick={handleStopAnimation}>
                <p>Detener</p>
                <StopIcon />
              </IconButton>
              )}
              <DripAnimacion
                dropsPerMinute={results.dropsPerMinute}
                onDropCountChange={handleDropCountChange}
                isAnimating={isAnimating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gotero;
