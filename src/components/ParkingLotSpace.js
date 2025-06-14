import React from 'react';
import '../styles/ParkingLotSpace.css';

const ParkingLotSpace = ({ space, isLast }) => {
  const { x, y } = space.getPosition();
  const { width, height, borderWidth } = space.getDimensions();
  const walkDistance = space.walkDistance;
  
  // Only the last space in the row gets a right border
  const borderStyle = isLast
    ? `${borderWidth}px solid #ffd600`
    : `${borderWidth}px solid #ffd600; border-right: none;`;

  return (
    <div
      className={`parking-space ${space.isOccupied ? 'occupied' : 'available'}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        borderTop: `${borderWidth}px solid #ffd600`,
        borderBottom: 'none',
        borderLeft: `${borderWidth}px solid #ffd600`,
        borderRight: isLast ? `${borderWidth}px solid #ffd600` : 'none',
        backgroundColor: 'transparent',
        borderRadius: isLast ? '0 2px 2px 0' : '0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '0.85rem',
        paddingBottom: '0',
      }}
      title={`Parking Space at (${x}, ${y}) - ${space.isOccupied ? 'Occupied' : 'Available'} - Walk: ${Math.round(walkDistance)}`}
    >
      <span className="walk-distance" style={{ marginBottom: '-18px', background: 'white', color: '#222', borderRadius: 4, padding: '0 4px', fontWeight: 600, fontSize: '0.8rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>{Math.round(walkDistance)}</span>
    </div>
  );
};

export default ParkingLotSpace; 