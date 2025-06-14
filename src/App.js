import React, { useState, useEffect } from 'react';
import { ParkingLot } from './models/ParkingLot';
import ParkingLotComponent from './components/ParkingLot';
import './App.css';

function App() {
  const [parkingLot] = useState(() => new ParkingLot(1000, 500));
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev + 1) % 101);
    }, 250); // 4x speed
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <h1 style={{ margin: 0 }}>Parking Lot Simulator</h1>
          <div className="time-ticker">Time: <span>{time}</span></div>
        </div>
        <p>Interactive parking lot simulation with dynamic spaces</p>
      </header>
      <main>
        <ParkingLotComponent parkingLot={parkingLot} />
      </main>
    </div>
  );
}

export default App;
