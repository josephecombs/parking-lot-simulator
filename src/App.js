import React, { useState, useEffect } from 'react';
import { ParkingLot } from './models/ParkingLot';
import { SimulationManager } from './models/SimulationManager';
import { Car } from './models/Car';
import { Person } from './models/Person';
import ParkingLotComponent from './components/ParkingLot';
import SchedulePanel from './components/SchedulePanel';
import CompletedCarsPanel from './components/CompletedCarsPanel';
import './App.css';

// Shared schedule generator to ensure both simulations get identical schedules
const generateSharedSchedule = () => {
  const numCars = 80;
  const maxArrivalTime = 45 * 60; // 45 minutes in seconds
  const scheduledCars = [];
  
  console.log(`🚗 Generating SHARED schedule for ${numCars} cars...`);
  console.log(`⏰ Cars will arrive between 00:00 and ${formatArrivalTime(maxArrivalTime)}`);
  
  for (let i = 0; i < numCars; i++) {
    // Ensure the first car arrives at t=0
    const arrivalTime = i === 0 ? 0 : Math.floor(Math.random() * maxArrivalTime);
    const car = new Car(arrivalTime);
    const person = new Person();
    
    // Associate car and person
    person.setCar(car);
    
    scheduledCars.push({ car, person });
  }
  
  // Sort scheduled cars by arrival time
  scheduledCars.sort((a, b) => a.car.getArrivalTime() - b.car.getArrivalTime());
  
  // Log the complete schedule
  console.log('📅 Complete SHARED Car Schedule:');
  console.log('Time | Car ID | Unicode | Person Store Visit');
  console.log('-----|--------|---------|------------------');
  
  scheduledCars.forEach(({ car, person }, index) => {
    const arrivalTime = formatArrivalTime(car.getArrivalTime());
    const storeVisitMinutes = Math.floor(person.getStoreVisitTime() / 60);
    const storeVisitSeconds = person.getStoreVisitTime() % 60;
    console.log(
      `${arrivalTime} | ${car.id.substring(0, 6)}... | ${car.getUnicodeChar()} | ${storeVisitMinutes}m ${storeVisitSeconds}s`
    );
  });
  
  console.log(`✅ SHARED Schedule generated successfully! ${scheduledCars.length} cars scheduled.`);
  console.log('First 5 cars to arrive:', scheduledCars.slice(0, 5).map(({ car }) => ({
    time: formatArrivalTime(car.getArrivalTime()),
    unicode: car.getUnicodeChar(),
    id: car.id.substring(0, 6)
  })));
  
  return scheduledCars;
};

// Function to clone a Person object with all its properties
const clonePerson = (originalPerson) => {
  const clonedPerson = new Person();
  
  // Copy all the properties from the original person
  clonedPerson.id = originalPerson.id;
  clonedPerson.handicapped = originalPerson.handicapped;
  clonedPerson.walkSpeed = originalPerson.walkSpeed;
  clonedPerson.lotSpeed = originalPerson.lotSpeed;
  clonedPerson.storeVisitTime = originalPerson.storeVisitTime;
  clonedPerson.isInStore = originalPerson.isInStore;
  clonedPerson.isWalking = originalPerson.isWalking;
  clonedPerson.storeEntryTime = originalPerson.storeEntryTime;
  clonedPerson.storeExitTime = originalPerson.storeExitTime;
  clonedPerson.shoppingCompleteTime = originalPerson.shoppingCompleteTime;
  clonedPerson.hasCompletedShopping = originalPerson.hasCompletedShopping;
  clonedPerson.totalDrivingTime = originalPerson.totalDrivingTime;
  clonedPerson.totalAccumulatedWalkTime = originalPerson.totalAccumulatedWalkTime;
  clonedPerson.x = originalPerson.x;
  clonedPerson.y = originalPerson.y;
  clonedPerson.startX = originalPerson.startX;
  clonedPerson.startY = originalPerson.startY;
  clonedPerson.targetX = originalPerson.targetX;
  clonedPerson.targetY = originalPerson.targetY;
  clonedPerson.walkStartTime = originalPerson.walkStartTime;
  clonedPerson.totalWalkTime = originalPerson.totalWalkTime;
  clonedPerson.isWalkingToStore = originalPerson.isWalkingToStore;
  clonedPerson.isWalkingToCar = originalPerson.isWalkingToCar;
  clonedPerson.walkCompleteTime = originalPerson.walkCompleteTime;
  
  return clonedPerson;
};

// Function to clone a Car object with all its properties
const cloneCar = (originalCar) => {
  const clonedCar = new Car(originalCar.getArrivalTime());
  
  // Copy all the properties from the original car
  clonedCar.id = originalCar.id;
  clonedCar.color = originalCar.color;
  clonedCar.unicodeChar = originalCar.unicodeChar;
  clonedCar.status = originalCar.status;
  clonedCar.arrivalTime = originalCar.arrivalTime;
  clonedCar.parkingTime = originalCar.parkingTime;
  clonedCar.exitTime = originalCar.exitTime;
  clonedCar.x = originalCar.x;
  clonedCar.y = originalCar.y;
  clonedCar.targetX = originalCar.targetX;
  clonedCar.targetY = originalCar.targetY;
  clonedCar.startX = originalCar.startX;
  clonedCar.startY = originalCar.startY;
  clonedCar.moveStartTime = originalCar.moveStartTime;
  clonedCar.moveDuration = originalCar.moveDuration;
  clonedCar.parkingLot = originalCar.parkingLot;
  clonedCar.parkingSpace = originalCar.parkingSpace;
  clonedCar.person = originalCar.person;
  
  return clonedCar;
};

const formatArrivalTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function App() {
  // Generate the shared schedule once
  const [sharedSchedule] = useState(() => generateSharedSchedule());
  
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
  
  // Create two simulation managers with the SHARED schedule
  const [simulationManagerWithHandicapped] = useState(() => {
    const manager = new SimulationManager(parkingLotWithHandicapped);
    // Replace the generated schedule with our shared schedule - clone everything exactly
    manager.scheduledCars = sharedSchedule.map(({ car, person }) => {
      const clonedCar = cloneCar(car);
      const clonedPerson = clonePerson(person);
      
      // Associate the cloned car and person
      clonedPerson.setCar(clonedCar);
      
      return { car: clonedCar, person: clonedPerson };
    });
    return manager;
  });
  
  const [simulationManagerWithoutHandicapped] = useState(() => {
    const manager = new SimulationManager(parkingLotWithoutHandicapped);
    // Replace the generated schedule with our shared schedule - clone everything exactly
    manager.scheduledCars = sharedSchedule.map(({ car, person }) => {
      const clonedCar = cloneCar(car);
      const clonedPerson = clonePerson(person);
      
      // Associate the cloned car and person
      clonedPerson.setCar(clonedCar);
      
      return { car: clonedCar, person: clonedPerson };
    });
    return manager;
  });
  
  // State to track which simulation is visible
  const [isHandicappedMode, setIsHandicappedMode] = useState(true);
  
  // Use the visible simulation manager based on the mode
  const visibleSimulationManager = isHandicappedMode ? simulationManagerWithHandicapped : simulationManagerWithoutHandicapped;
  const visibleParkingLot = isHandicappedMode ? parkingLotWithHandicapped : parkingLotWithoutHandicapped;
  
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
    // Start both simulations automatically on mount
    setTime(0);
    simulationManagerWithHandicapped.setCurrentTime(0);
    simulationManagerWithoutHandicapped.setCurrentTime(0);
    setIsSimulationRunning(true);
    simulationManagerWithHandicapped.startSimulation();
    simulationManagerWithoutHandicapped.startSimulation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (isSimulationRunning && time < TOTAL_SIMULATION_TIME) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          // Update both simulations in parallel
          simulationManagerWithHandicapped.setCurrentTime(newTime);
          simulationManagerWithoutHandicapped.setCurrentTime(newTime);
          
          if (newTime >= TOTAL_SIMULATION_TIME) {
            setIsSimulationRunning(false);
            simulationManagerWithHandicapped.pauseSimulation();
            simulationManagerWithoutHandicapped.pauseSimulation();
            return TOTAL_SIMULATION_TIME;
          }
          return newTime;
        });
      }, speedToInterval[simulationSpeed]);
    }
    return () => clearInterval(interval);
  }, [isSimulationRunning, time, simulationManagerWithHandicapped, simulationManagerWithoutHandicapped, simulationSpeed]);

  const startSimulation = () => {
    setTime(0);
    simulationManagerWithHandicapped.setCurrentTime(0);
    simulationManagerWithoutHandicapped.setCurrentTime(0);
    setIsSimulationRunning(true);
    simulationManagerWithHandicapped.startSimulation();
    simulationManagerWithoutHandicapped.startSimulation();
  };

  const pauseSimulation = () => {
    setIsSimulationRunning(false);
    simulationManagerWithHandicapped.pauseSimulation();
    simulationManagerWithoutHandicapped.pauseSimulation();
  };

  const resetSimulation = () => {
    setTime(0);
    simulationManagerWithHandicapped.setCurrentTime(0);
    simulationManagerWithoutHandicapped.setCurrentTime(0);
    setIsSimulationRunning(false);
    simulationManagerWithHandicapped.resetSimulation();
    simulationManagerWithoutHandicapped.resetSimulation();
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

  const stats = visibleSimulationManager.getSimulationStats();
  const completedStats = visibleSimulationManager.getCompletedSummaryStats();
  const lotOccupancyPercent = visibleParkingLot.getAverageOccupancyPercentage(time, TOTAL_SIMULATION_TIME).toFixed(1);

  // Get stats from both simulations for comparison
  const handicappedStats = simulationManagerWithHandicapped.getCompletedSummaryStats();
  const nonHandicappedStats = simulationManagerWithoutHandicapped.getCompletedSummaryStats();
  
  // Calculate the "cost" of handicapped spaces (difference in times)
  const walkTimeCost = nonHandicappedStats.totalWalkTime - handicappedStats.totalWalkTime;
  const driveTimeCost = nonHandicappedStats.totalDriveTime - handicappedStats.totalDriveTime;
  
  // Format the cost times
  const formatCostTime = (seconds) => {
    if (seconds === 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };
  
  const walkTimeCostFormatted = formatCostTime(walkTimeCost);
  const driveTimeCostFormatted = formatCostTime(driveTimeCost);

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
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
                  Show "Handicapped Space" Simulation
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
            textAlign: 'right',
            flex: 1
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
            <div style={{ 
              marginTop: 12, 
              padding: '8px 12px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, color: '#ffd700', marginBottom: 4 }}>
                ♿ Handicapped Space Cost:
              </div>
              <div style={{ fontSize: 13, color: walkTimeCost > 0 ? '#ff6b6b' : '#4ecdc4' }}>
                Walk Time: +{walkTimeCostFormatted}
              </div>
              <div style={{ fontSize: 13, color: driveTimeCost > 0 ? '#ff6b6b' : '#4ecdc4' }}>
                Drive Time: +{driveTimeCostFormatted}
              </div>
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
          scheduledCars={visibleSimulationManager.getScheduledCars()} 
          currentTime={time}
          formatArrivalTime={visibleSimulationManager.formatArrivalTime}
        />
        
        {/* Parking Lot in the center */}
        <div style={{ position: 'relative' }}>
          <ParkingLotComponent 
            parkingLot={visibleParkingLot} 
            cars={visibleSimulationManager.getCars()}
            time={time}
            onCarHover={setHoveredCarInfo}
            onCarLeave={() => setHoveredCarInfo(null)}
          />
        </div>
        
        {/* Completed Cars Panel (right) */}
        <CompletedCarsPanel 
          completedCars={visibleSimulationManager.getCompletedCars()} 
          formatTime={formatTime}
          formatArrivalTime={visibleSimulationManager.formatArrivalTime}
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
            <div>Arrival: {visibleSimulationManager.formatArrivalTime(hoveredCarInfo.arrivalTime)}</div>
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
