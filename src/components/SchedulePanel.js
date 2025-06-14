import React, { useState } from 'react';

const SchedulePanel = ({ scheduledCars, currentTime, formatArrivalTime }) => {
  const [hoveredCar, setHoveredCar] = useState(null);

  const handleCarHover = (carInfo) => {
    setHoveredCar(carInfo);
  };

  const handleCarLeave = () => {
    setHoveredCar(null);
  };

  return (
    <div className="schedule-panel" style={{
      position: 'absolute',
      left: '-320px',
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
        📅 Scheduled Cars ({scheduledCars.length})
      </h3>
      
      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>
        Arrival times shown as MM:SS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {scheduledCars.map(({ car, person }, index) => {
          const arrivalTime = car.getArrivalTime();
          const isPastTime = arrivalTime <= currentTime;
          
          return (
            <div
              key={car.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 8px',
                backgroundColor: isPastTime ? '#e9ecef' : '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: isPastTime ? 0.6 : 1,
                position: 'relative'
              }}
              onMouseEnter={() => handleCarHover(car.getCarInfo())}
              onMouseLeave={handleCarLeave}
            >
              <span style={{ 
                fontSize: '20px', 
                marginRight: '8px',
                filter: isPastTime ? 'grayscale(100%)' : 'none'
              }}>
                {car.getUnicodeChar()}
              </span>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: isPastTime ? '#6c757d' : '#495057',
                minWidth: '60px'
              }}>
                {formatArrivalTime(arrivalTime)}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#6c757d',
                marginLeft: 'auto'
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
          left: '320px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#212529',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          maxWidth: '250px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Car {hoveredCar.unicodeChar}
          </div>
          <div>ID: {hoveredCar.id}</div>
          <div>Arrival: {formatArrivalTime(hoveredCar.arrivalTime)}</div>
          <div>Status: {hoveredCar.status}</div>
          {hoveredCar.person && (
            <>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                Person Info:
              </div>
              <div>Walk Speed: {hoveredCar.person.walkSpeed} px/s</div>
              <div>Lot Speed: {hoveredCar.person.lotSpeed} px/s</div>
              <div>Store Visit: {Math.floor(hoveredCar.person.storeVisitTime / 60)}m {hoveredCar.person.storeVisitTime % 60}s</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePanel; 