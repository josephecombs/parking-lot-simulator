import React from 'react';
import '../styles/ParkingLotSpace.css';

const ParkingLotSpace = ({ space, isLast, onSpaceHover, onSpaceLeave, time, scalingFactor = 1 }) => {
  const { x, y } = space.getPosition();
  const { width, height, borderWidth } = space.getDimensions();
  const walkDistance = space.walkDistance;
  
  // Apply scaling factor to all dimensions
  const scaledX = x * scalingFactor;
  const scaledY = y * scalingFactor;
  const scaledWidth = width * scalingFactor;
  const scaledHeight = height * scalingFactor;
  const scaledBorderWidth = borderWidth * scalingFactor;
  
  // Only the last space in the row gets a right border
  const borderStyle = isLast
    ? `${scaledBorderWidth}px solid #ffd600`
    : `${scaledBorderWidth}px solid #ffd600; border-right: none;`;

  // Set background color based on handicapped status
  const backgroundColor = space.handicapped ? '#87CEEB' : 'transparent'; // Light blue for handicapped

  // Create handicapped symbol background for unoccupied handicapped spots
  const getBackgroundStyle = () => {
    if (space.handicapped && !space.isOccupied) {
      // Create a data URL for the handicapped symbol
      const symbol = '♿';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 24 * scalingFactor;
      canvas.height = 24 * scalingFactor;
      ctx.font = `${20 * scalingFactor}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 12 * scalingFactor, 12 * scalingFactor);
      
      const dataURL = canvas.toDataURL();
      
      return {
        backgroundImage: `url(${dataURL})`,
        backgroundSize: `${20 * scalingFactor}px ${20 * scalingFactor}px`,
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
        left: scaledX,
        top: scaledY,
        width: scaledWidth,
        height: scaledHeight,
        borderTop: `${scaledBorderWidth}px solid #ffd600`,
        borderBottom: 'none',
        borderLeft: `${scaledBorderWidth}px solid #ffd600`,
        borderRight: isLast ? `${scaledBorderWidth}px solid #ffd600` : 'none',
        backgroundColor: backgroundColor,
        borderRadius: isLast ? `0 ${2 * scalingFactor}px ${2 * scalingFactor}px 0` : '0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: `${0.85 * scalingFactor}rem`,
        paddingBottom: '0',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        boxShadow: `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(0,0,0,0.08)`,
        ...getBackgroundStyle(),
      }}
      onMouseEnter={onSpaceHover}
      onMouseLeave={onSpaceLeave}
    >
      <span 
        className="walk-distance" 
        style={{ 
          marginBottom: `${4 * scalingFactor}px`,
          background: 'white',
          color: '#222',
          borderRadius: 4 * scalingFactor,
          padding: `0 ${4 * scalingFactor}px`,
          fontWeight: 600,
          fontSize: `${0.8 * scalingFactor}rem`,
          boxShadow: `0 ${1 * scalingFactor}px ${4 * scalingFactor}px rgba(0,0,0,0.08)`
        }}
      >

      </span>
    </div>
  );
};

export default ParkingLotSpace; 