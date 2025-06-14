import React, { useState, useEffect } from 'react';
import { ParkingLot } from './models/ParkingLot';
import { SimulationManager } from './models/SimulationManager';
import ParkingLotComponent from './components/ParkingLot';
import SchedulePanel from './components/SchedulePanel';
import CompletedCarsPanel from './components/CompletedCarsPanel';
import './App.css';

function App() {
  const [parkingLot] = useState(() => new ParkingLot(1000, 500));
  const [simulationManager] = useState(() => new SimulationManager(parkingLot));
  const [time, setTime] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [hoveredCarInfo, setHoveredCarInfo] = useState(null);

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
    <div className="App" style={{ position: 'relative' }}>
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
      <main style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        gap: '20px',
        padding: '20px',
        minHeight: 600 
      }}>
        {/* Schedule Panel (left) */}
        <SchedulePanel 
          scheduledCars={simulationManager.getScheduledCars()} 
          currentTime={time}
          formatArrivalTime={simulationManager.formatArrivalTime}
        />
        
        {/* Parking Lot in the center */}
        <div style={{ position: 'relative' }}>
          <ParkingLotComponent 
            parkingLot={parkingLot} 
            cars={simulationManager.getCars()}
            time={time}
            onCarHover={setHoveredCarInfo}
            onCarLeave={() => setHoveredCarInfo(null)}
          />
        </div>
        
        {/* Completed Cars Panel (right) */}
        <CompletedCarsPanel 
          completedCars={simulationManager.getCompletedCars()} 
          formatTime={formatTime}
          formatArrivalTime={simulationManager.formatArrivalTime}
        />
        
        {/* Optionally, show hovered car info as a floating tooltip */}
        {hoveredCarInfo && (
          <div style={{
            position: 'fixed',
            left: '50%',
            top: '10%',
            transform: 'translateX(-50%)',
            backgroundColor: '#212529',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Car {hoveredCarInfo.unicodeChar}
            </div>
            <div>ID: {hoveredCarInfo.id}</div>
            <div>Status: {hoveredCarInfo.status}</div>
            <div>Arrival: {simulationManager.formatArrivalTime(hoveredCarInfo.arrivalTime)}</div>
            {hoveredCarInfo.person && (
              <>
                <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                  Person Info:
                </div>
                <div>Walk Speed: {hoveredCarInfo.person.walkSpeed} px/s</div>
                <div>Lot Speed: {hoveredCarInfo.person.lotSpeed} px/s</div>
                <div>Store Visit: {Math.floor(hoveredCarInfo.person.storeVisitTime / 60)}m {hoveredCarInfo.person.storeVisitTime % 60}s</div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
