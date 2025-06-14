import React, { useState } from 'react';
import { ParkingLot } from './models/ParkingLot';
import ParkingLotComponent from './components/ParkingLot';
import './App.css';

function App() {
  const [parkingLot] = useState(() => new ParkingLot(1000, 1000));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Parking Lot Simulator</h1>
        <p>Interactive parking lot simulation with dynamic spaces</p>
      </header>
      <main>
        <ParkingLotComponent parkingLot={parkingLot} />
      </main>
    </div>
  );
}

export default App;
