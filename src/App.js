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
      }, 125); // 0.125 seconds per tick for 8x realtime simulation
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
  const completedStats = simulationManager.getCompletedSummaryStats();

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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          {/* Simulation Controls and Demographic Stats on the Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16 }}>
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
              fontSize: '14px',
              color: '#fff'
            }}>
              <span>Cars: {stats.totalCars}</span>
              <span>People: {stats.totalPeople}</span>
              <span>Occupied: {stats.occupiedSpaces}</span>
              <span>Available: {stats.availableSpaces}</span>
            </div>
          </div>
          
          {/* Summary Statistics on the Right */}
          <div style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8, 
            fontSize: '14px',
            color: '#fff',
            textAlign: 'right'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: 17, color: '#2e3a4d' }}>
              🚶‍♂️ Walk & 🚗 Drive Summary:
            </div>
            <div>
              <span style={{ fontWeight: 500, color: '#fff' }}>Total Walk Time:</span> {completedStats.formatted.totalWalk}
            </div>
            <div>
              <span style={{ fontWeight: 500, color: '#fff' }}>Total Drive Time:</span> {completedStats.formatted.totalDrive}
            </div>
          </div>
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
                <div>Walk Time: {hoveredCarInfo.person.accumulatedWalkTimeFormatted}</div>
                <div>Driving Time: {hoveredCarInfo.person.drivingTimeFormatted}</div>
                <div>Handicapped: {hoveredCarInfo.person.handicapped ? 'Yes' : 'No'}</div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
