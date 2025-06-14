import React, { useState, useEffect } from 'react';
import { ParkingLot } from './models/ParkingLot';
import { SimulationManager } from './models/SimulationManager';
import ParkingLotComponent from './components/ParkingLot';
import './App.css';

function App() {
  const [parkingLot] = useState(() => new ParkingLot(1000, 500));
  const [simulationManager] = useState(() => new SimulationManager(parkingLot));
  const [time, setTime] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Total simulation time: 3600 seconds (1 hour)
  const TOTAL_SIMULATION_TIME = 3600;

  useEffect(() => {
    let interval;
    if (isSimulationRunning && time < TOTAL_SIMULATION_TIME) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          simulationManager.setCurrentTime(newTime);
          
          if (newTime >= TOTAL_SIMULATION_TIME) {
            setIsSimulationRunning(false);
            simulationManager.pauseSimulation();
            return TOTAL_SIMULATION_TIME;
          }
          return newTime;
        });
      }, 1000); // 1 second per tick for real-time simulation
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, time, simulationManager]);

  const startSimulation = () => {
    setTime(0);
    simulationManager.setCurrentTime(0);
    setIsSimulationRunning(true);
    simulationManager.startSimulation();
  };

  const pauseSimulation = () => {
    setIsSimulationRunning(false);
    simulationManager.pauseSimulation();
  };

  const resetSimulation = () => {
    setTime(0);
    simulationManager.setCurrentTime(0);
    setIsSimulationRunning(false);
    simulationManager.resetSimulation();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = simulationManager.getSimulationStats();

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <h1 style={{ margin: 0 }}>Parking Lot Simulator</h1>
          <div className="time-ticker">
            Time: <span>{formatTime(time)}</span> / {formatTime(TOTAL_SIMULATION_TIME)}
          </div>
        </div>
        <p>Interactive parking lot simulation with dynamic spaces</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button 
            onClick={startSimulation} 
            disabled={isSimulationRunning}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Start Simulation
          </button>
          <button 
            onClick={pauseSimulation} 
            disabled={!isSimulationRunning}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Pause
          </button>
          <button 
            onClick={resetSimulation}
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Reset
          </button>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 24, 
          marginTop: 16, 
          fontSize: '14px',
          color: '#666'
        }}>
          <span>Cars: {stats.totalCars}</span>
          <span>People: {stats.totalPeople}</span>
          <span>Occupied: {stats.occupiedSpaces}</span>
          <span>Available: {stats.availableSpaces}</span>
        </div>
      </header>
      <main>
        <ParkingLotComponent 
          parkingLot={parkingLot} 
          cars={simulationManager.getCars()}
          time={time}
        />
      </main>
    </div>
  );
}

export default App;
