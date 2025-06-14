import React from 'react';
import ParkingLotSpace from './ParkingLotSpace';
import '../styles/ParkingLot.css';

const ParkingLot = ({ parkingLot, cars = [], time = 0 }) => {
  const { width, height, entrance, exit, buildingEntrance, spaces } = parkingLot;

  return (
    <div className="parking-lot-container" style={{ position: 'relative' }}>
      <div 
        className="parking-lot"
        style={{
          width: width,
          height: height,
          position: 'relative',
          backgroundColor: 'darkgray',
          border: '3px solid #495057',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Building Entrance - first child inside .parking-lot */}
        <div
          className="building-entrance"
          style={{
            position: 'absolute',
            left: '50%',
            top: -45,
            transform: 'translateX(-50%)',
            backgroundColor: '#6c757d',
            border: '2px solid #545b62',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            padding: '0 16px',
            width: 'auto',
            boxShadow: '0 2px 8px rgba(108,117,125,0.15)',
            zIndex: 100,
          }}
        >
          <span>BUILDING</span>
          <span style={{fontSize: '0.8rem', fontWeight: 400, marginTop: 2}}>ENTRANCE</span>
        </div>

        {/* Entrance */}
        <div
          className="entrance"
          style={{
            position: 'absolute',
            left: entrance.x,
            top: entrance.y,
            height: entrance.height,
            backgroundColor: '#28a745',
            border: '2px solid #1e7e34',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            padding: '0 16px',
            width: 'auto',
            boxShadow: '0 2px 8px rgba(40,167,69,0.15)',
            overflow: 'visible',
          }}
        >
          ENTRANCE
        </div>

        {/* Exit */}
        <div
          className="exit"
          style={{
            position: 'absolute',
            right: 0,
            top: exit.y,
            height: exit.height,
            backgroundColor: '#dc3545',
            border: '2px solid #c82333',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            padding: '0 16px',
            width: 'auto',
            boxShadow: '0 2px 8px rgba(220,53,69,0.15)',
            overflow: 'visible',
          }}
        >
          EXIT
        </div>

        {/* Parking Spaces */}
        {spaces.map((space, index) => (
          <ParkingLotSpace key={index} space={space} isLast={index === spaces.length - 1} />
        ))}

        {/* Cars will be rendered here in the next step */}
        {/* For now, we're just setting up the infrastructure */}
      </div>
    </div>
  );
};

export default ParkingLot; 