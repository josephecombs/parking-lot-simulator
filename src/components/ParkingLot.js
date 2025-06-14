import React from 'react';
import ParkingLotSpace from './ParkingLotSpace';
import '../styles/ParkingLot.css';

const ParkingLot = ({ parkingLot }) => {
  const { width, height, entrance, exit, buildingEntrance, spaces } = parkingLot;

  return (
    <div className="parking-lot-container">
      <div 
        className="parking-lot"
        style={{
          width: width,
          height: height,
          position: 'relative',
          backgroundColor: '#e9ecef',
          border: '3px solid #495057',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Entrance */}
        <div
          className="entrance"
          style={{
            position: 'absolute',
            left: entrance.x,
            top: entrance.y,
            width: entrance.width,
            height: entrance.height,
            backgroundColor: '#28a745',
            border: '2px solid #1e7e34',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ENTRANCE
        </div>

        {/* Exit */}
        <div
          className="exit"
          style={{
            position: 'absolute',
            left: exit.x,
            top: exit.y,
            width: exit.width,
            height: exit.height,
            backgroundColor: '#dc3545',
            border: '2px solid #c82333',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          EXIT
        </div>

        {/* Building Entrance */}
        <div
          className="building-entrance"
          style={{
            position: 'absolute',
            left: buildingEntrance.x,
            top: buildingEntrance.y,
            width: buildingEntrance.width,
            height: buildingEntrance.height,
            backgroundColor: '#6c757d',
            border: '2px solid #545b62',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          BUILDING
        </div>

        {/* Parking Spaces */}
        {spaces.map((space, index) => (
          <ParkingLotSpace key={index} space={space} isLast={index === spaces.length - 1} />
        ))}
      </div>
    </div>
  );
};

export default ParkingLot; 