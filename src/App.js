import React, { useState, useEffect } from 'react';
import { ParkingLot } from './models/ParkingLot';
import { SimulationManager } from './models/SimulationManager';
import ParkingLotComponent from './components/ParkingLot';
import SchedulePanel from './components/SchedulePanel';
import CompletedCarsPanel from './components/CompletedCarsPanel';
import './App.css';

function App() {
  // Create two parking lots - one with handicapped spaces, one without
  const [parkingLotWithHandicapped] = useState(() => new ParkingLot(1000, 500));
  const [parkingLotWithoutHandicapped] = useState(() => {
    const lot = new ParkingLot(1000, 500);
    // Remove handicapped designation from all spaces
    lot.getSpaces().forEach(space => {
      space.handicapped = false;
    });
    return lot;
  });
  
  // Create two simulation managers with the same schedule
  const [simulationManagerWithHandicapped] = useState(() => new SimulationManager(parkingLotWithHandicapped));
  const [simulationManagerWithoutHandicapped] = useState(() => new SimulationManager(parkingLotWithoutHandicapped));
  
  // State to track which simulation is active
  const [isHandicappedMode, setIsHandicappedMode] = useState(true);
  
  // Use the active simulation manager based on the mode
  const activeSimulationManager = isHandicappedMode ? simulationManagerWithHandicapped : simulationManagerWithoutHandicapped;
  const activeParkingLot = isHandicappedMode ? parkingLotWithHandicapped : parkingLotWithoutHandicapped;
  
  const [time, setTime] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [hoveredCarInfo, setHoveredCarInfo] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(32); // Default 32x

  // Total simulation time: 3600 seconds (1 hour)
  const TOTAL_SIMULATION_TIME = 3600;

  // Map speed to interval in ms
  const speedToInterval = {
    1: 1000,
    4: 250,
    8: 125,
    16: 62.5,
    32: 31.25,
  };

  useEffect(() => {
    // Start simulation automatically on mount
    setTime(0);
    activeSimulationManager.setCurrentTime(0);
    setIsSimulationRunning(true);
    activeSimulationManager.startSimulation();
    // eslint-disable-next-line
  }, [isHandicappedMode]);

  useEffect(() => {
    let interval;
    if (isSimulationRunning && time < TOTAL_SIMULATION_TIME) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          activeSimulationManager.setCurrentTime(newTime);
          
          if (newTime >= TOTAL_SIMULATION_TIME) {
            setIsSimulationRunning(false);
            activeSimulationManager.pauseSimulation();
            return TOTAL_SIMULATION_TIME;
          }
          return newTime;
        });
      }, speedToInterval[simulationSpeed]);
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, time, activeSimulationManager, simulationSpeed]);

  const startSimulation = () => {
    setTime(0);
    activeSimulationManager.setCurrentTime(0);
    setIsSimulationRunning(true);
    activeSimulationManager.startSimulation();
  };

  const pauseSimulation = () => {
    setIsSimulationRunning(false);
    activeSimulationManager.pauseSimulation();
  };

  const resetSimulation = () => {
    setTime(0);
    activeSimulationManager.setCurrentTime(0);
    setIsSimulationRunning(false);
    activeSimulationManager.resetSimulation();
  };

  const toggleHandicappedMode = () => {
    setIsHandicappedMode(!isHandicappedMode);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = activeSimulationManager.getSimulationStats();
  const completedStats = activeSimulationManager.getCompletedSummaryStats();
  const lotOccupancyPercent = activeParkingLot.getAverageOccupancyPercentage(time, TOTAL_SIMULATION_TIME).toFixed(1);

  return (
    <div className="App" style={{ position: 'relative' }}>
      <header className="App-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <h1 style={{ margin: 0 }}>Parking Lot Simulator</h1>
          <div className="time-ticker" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>
              Time: <span>{formatTime(time)}</span> / {formatTime(TOTAL_SIMULATION_TIME)}
            </span>
            {/* Speed Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '2px 8px' }}>
              {[1, 4, 8, 16, 32].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  style={{
                    background: simulationSpeed === speed ? '#ffd700' : 'rgba(255,255,255,0.15)',
                    color: simulationSpeed === speed ? '#222' : '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 10px',
                    fontWeight: simulationSpeed === speed ? 700 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                    outline: simulationSpeed === speed ? '2px solid #ffd700' : 'none',
                    boxShadow: simulationSpeed === speed ? '0 0 6px #ffd70088' : 'none',
                    transition: 'all 0.15s',
                  }}
                  aria-label={`Set simulation speed to ${speed}x`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
        <p>Interactive parking lot simulation - ORIGINAL SCHOLARSHIP</p>
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
          
          {/* Handicapped Toggle Button in the Center */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={toggleHandicappedMode}
              style={{
                background: isHandicappedMode ? '#ff6b6b' : '#4ecdc4',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              {isHandicappedMode ? (
                <>
                  <span style={{ fontSize: '20px' }}>♿</span>
                  Show "No Handicapped Space" Simulation
                </>
              ) : (
                <>
                  <span style={{ fontSize: '20px' }}>🚗</span>
                  Show "Handicapped Space"
                </>
              )}
            </button>
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
            <div style={{ marginTop: 8, fontWeight: 600, color: '#ffd700', fontSize: 16 }}>
              Lot Occupancy: {lotOccupancyPercent}%
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
          scheduledCars={activeSimulationManager.getScheduledCars()} 
          currentTime={time}
          formatArrivalTime={activeSimulationManager.formatArrivalTime}
        />
        
        {/* Parking Lot in the center */}
        <div style={{ position: 'relative' }}>
          <ParkingLotComponent 
            parkingLot={activeParkingLot} 
            cars={activeSimulationManager.getCars()}
            time={time}
            onCarHover={setHoveredCarInfo}
            onCarLeave={() => setHoveredCarInfo(null)}
          />
        </div>
        
        {/* Completed Cars Panel (right) */}
        <CompletedCarsPanel 
          completedCars={activeSimulationManager.getCompletedCars()} 
          formatTime={formatTime}
          formatArrivalTime={activeSimulationManager.formatArrivalTime}
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
            <div>Arrival: {activeSimulationManager.formatArrivalTime(hoveredCarInfo.arrivalTime)}</div>
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
