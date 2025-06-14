import React from 'react';
import '../styles/ParkingLotSpace.css';

const ParkingLotSpace = ({ space, isLast }) => {
  const { x, y } = space.getPosition();
  const { width, height, borderWidth } = space.getDimensions();
  
  // Only the last space in the row gets a right border
  const borderStyle = isLast
    ? `${borderWidth}px solid #333`
    : `${borderWidth}px solid #333; border-right: none;`;

  return (
    <div
      className={`parking-space ${space.isOccupied ? 'occupied' : 'available'}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        borderTop: `${borderWidth}px solid #333`,
        borderBottom: `${borderWidth}px solid #333`,
        borderLeft: `${borderWidth}px solid #333`,
        borderRight: isLast ? `${borderWidth}px solid #333` : 'none',
        backgroundColor: space.isOccupied ? '#ff6b6b' : '#f8f9fa',
        borderRadius: isLast ? '0 2px 2px 0' : '0',
        boxSizing: 'border-box'
      }}
      title={`Parking Space at (${x}, ${y}) - ${space.isOccupied ? 'Occupied' : 'Available'}`}
    />
  );
};

export default ParkingLotSpace; 