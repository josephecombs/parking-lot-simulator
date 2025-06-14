import React, { useState } from 'react';

const CompletedCarsPanel = ({ completedCars, formatTime, formatArrivalTime }) => {
  const [hoveredCar, setHoveredCar] = useState(null);

  const handleCarHover = (carInfo) => {
    setHoveredCar(carInfo);
  };

  const handleCarLeave = () => {
    setHoveredCar(null);
  };

  const getDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const duration = Math.floor((endTime - startTime) / 1000); // Convert to seconds
    return formatTime(duration);
  };

  return (
    <div className="completed-cars-panel" style={{
      position: 'absolute',
      right: '-320px',
      top: '0',
      width: '300px',
      height: '100%',
      backgroundColor: '#f8f9fa',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      overflowY: 'auto',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        color: '#495057',
        fontSize: '18px',
        textAlign: 'center',
        borderBottom: '2px solid #dee2e6',
        paddingBottom: '8px'
      }}>
        ✅ Completed Cars ({completedCars.length})
      </h3>
      
      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>
        Cars that have arrived, shopped, and exited
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {completedCars.map(({ car, person }, index) => {
          const carInfo = car.getCarInfo();
          
          return (
            <div
              key={car.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 8px',
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={() => handleCarHover(carInfo)}
              onMouseLeave={handleCarLeave}
            >
              <span style={{ 
                fontSize: '20px', 
                marginRight: '8px'
              }}>
                {car.getUnicodeChar()}
              </span>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                flex: 1
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Arrived: {formatArrivalTime(car.getArrivalTime())}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  color: '#6c757d'
                }}>
                  Duration: {getDuration(carInfo.actualArrivalTime, carInfo.exitTime)}
                </span>
              </div>
              <span style={{ 
                fontSize: '10px', 
                color: '#6c757d'
              }}>
                #{index + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredCar && (
        <div style={{
          position: 'absolute',
          right: '320px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#212529',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          maxWidth: '280px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Car {hoveredCar.unicodeChar} (Completed)
          </div>
          <div>ID: {hoveredCar.id}</div>
          <div>Scheduled: {formatArrivalTime(hoveredCar.arrivalTime)}</div>
          <div>Actual Arrival: {hoveredCar.actualArrivalTime ? formatTime(hoveredCar.actualArrivalTime) : 'N/A'}</div>
          <div>Exit Time: {hoveredCar.exitTime ? formatTime(hoveredCar.exitTime) : 'N/A'}</div>
          <div>Total Duration: {getDuration(hoveredCar.actualArrivalTime, hoveredCar.exitTime)}</div>
          {hoveredCar.person && (
            <>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                Person Stats:
              </div>
              <div>Walk Speed: {hoveredCar.person.walkSpeed} px/s</div>
              <div>Lot Speed: {hoveredCar.person.lotSpeed} px/s</div>
              <div>Store Visit: {Math.floor(hoveredCar.person.storeVisitTime / 60)}m {hoveredCar.person.storeVisitTime % 60}s</div>
              <div>Total Walk Time: {formatTime(hoveredCar.person.totalWalkTime)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompletedCarsPanel; 