import React from 'react';
import '../styles/ParkingLotSpace.css';

const ParkingLotSpace = ({ space, isLast, onSpaceHover, onSpaceLeave, time }) => {
  const { x, y } = space.getPosition();
  const { width, height, borderWidth } = space.getDimensions();
  const walkDistance = space.walkDistance;
  
  // Only the last space in the row gets a right border
  const borderStyle = isLast
    ? `${borderWidth}px solid #ffd600`
    : `${borderWidth}px solid #ffd600; border-right: none;`;

  // Set background color based on handicapped status
  const backgroundColor = space.handicapped ? '#87CEEB' : 'transparent'; // Light blue for handicapped

  // Create handicapped symbol background for unoccupied handicapped spots
  const getBackgroundStyle = () => {
    if (space.handicapped && !space.isOccupied) {
      // Create a data URL for the handicapped symbol
      const symbol = '♿';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 24;
      canvas.height = 24;
      ctx.font = '20px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 12, 12);
      
      const dataURL = canvas.toDataURL();
      
      return {
        backgroundImage: `url(${dataURL})`,
        backgroundSize: '20px 20px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {};
  };

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
        backgroundColor: backgroundColor,
        borderRadius: isLast ? '0 2px 2px 0' : '0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '0.85rem',
        paddingBottom: '0',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        ...getBackgroundStyle(),
      }}
      onMouseEnter={onSpaceHover}
      onMouseLeave={onSpaceLeave}
    >
      <span 
        className="walk-distance" 
        style={{ 
          marginBottom: '4px',
          background: 'white',
          color: '#222',
          borderRadius: 4,
          padding: '0 4px',
          fontWeight: 600,
          fontSize: '0.8rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >

      </span>
    </div>
  );
};

export default ParkingLotSpace; 