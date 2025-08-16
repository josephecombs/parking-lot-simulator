import React, { useState } from 'react';
import ParkingLotSpace from './ParkingLotSpace';
import '../styles/ParkingLot.css';

const ParkingLot = ({ parkingLot, cars = [], time = 0, onCarHover, onCarLeave, scalingFactor = 1 }) => {
  const { width, height, entrance, exit, buildingEntrance, spaces } = parkingLot;

  // Apply scaling factor to all dimensions
  const scaledWidth = width * scalingFactor;
  const scaledHeight = height * scalingFactor;
  const scaledEntranceWidth = entrance.width * scalingFactor;
  const scaledEntranceHeight = entrance.height * scalingFactor;
  const scaledBuildingEntranceWidth = buildingEntrance.width * scalingFactor;
  const scaledBuildingEntranceHeight = buildingEntrance.height * scalingFactor;

  // Extract people from cars that are currently walking
  const walkingPeople = cars
    .map(car => car.getPerson())
    .filter(person => person && person.isCurrentlyWalking());

  // Space hover state
  const [hoveredSpace, setHoveredSpace] = useState(null);

  return (
    <div className="parking-lot-container" style={{ position: 'relative' }}>
      <div 
        className="parking-lot"
        style={{
          width: scaledWidth,
          height: scaledHeight,
          position: 'relative',
          backgroundColor: 'darkgray',
          border: `${3 * scalingFactor}px solid #495057`,
          borderRadius: `${8 * scalingFactor}px`,
          boxShadow: `0 ${4 * scalingFactor}px ${8 * scalingFactor}px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Building Entrance - first child inside .parking-lot */}
        <div
          className="building-entrance"
          style={{
            position: 'absolute',
            left: '50%',
            top: -45 * scalingFactor,
            transform: 'translateX(-50%)',
            backgroundColor: '#6c757d',
            border: `${2 * scalingFactor}px solid #545b62`,
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            borderTopLeftRadius: `${6 * scalingFactor}px`,
            borderTopRightRadius: `${6 * scalingFactor}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: `${1.1 * scalingFactor}rem`,
            fontWeight: 'bold',
            letterSpacing: `${1 * scalingFactor}px`,
            padding: `0 ${16 * scalingFactor}px`,
            width: 'auto',
            boxShadow: `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(108,117,125,0.15)`,
            zIndex: 100,
          }}
        >
          <span>BUILDING</span>
          <span style={{fontSize: `${0.8 * scalingFactor}rem`, fontWeight: 400, marginTop: 2 * scalingFactor}}>ENTRANCE</span>
        </div>

        {/* Entrance */}
        <div
          className="entrance"
          style={{
            position: 'absolute',
            left: entrance.x * scalingFactor,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#28a745',
            border: `${2 * scalingFactor}px solid #1e7e34`,
            borderTopRightRadius: `${6 * scalingFactor}px`,
            borderBottomRightRadius: `${6 * scalingFactor}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: `${1.1 * scalingFactor}rem`,
            fontWeight: 'bold',
            letterSpacing: `${1 * scalingFactor}px`,
            // padding: '0 4px',
            width: 'auto',
            boxShadow: `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(40,167,69,0.15)`,
            overflow: 'visible',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
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
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#dc3545',
            border: `${2 * scalingFactor}px solid #c82333`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: `${6 * scalingFactor}px`,
            borderBottomLeftRadius: `${6 * scalingFactor}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: `${1.1 * scalingFactor}rem`,
            fontWeight: 'bold',
            letterSpacing: `${1 * scalingFactor}px`,
            width: 'auto',
            boxShadow: `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(220,53,69,0.15)`,
            overflow: 'visible',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
          }}
        >
          EXIT
        </div>

        {/* Parking Spaces */}
        {spaces.map((space, index) => (
          <ParkingLotSpace 
            key={index} 
            space={space} 
            isLast={index === spaces.length - 1}
            time={time}
            scalingFactor={scalingFactor}
            onSpaceHover={() => setHoveredSpace({ space, index })}
            onSpaceLeave={() => setHoveredSpace(null)}
          />
        ))}

        {/* Render walking people */}
        {walkingPeople.map((person) => {
          const pos = person.getPosition();
          const isWalkingToStore = person.isWalkingToStore;
          const isWalkingToCar = person.isWalkingToCar;
          
          return (
            <div
              key={`person-${person.id}`}
              style={{
                position: 'absolute',
                left: (pos.x - 12 * scalingFactor) * scalingFactor, // Center the person character
                top: (pos.y - 12 * scalingFactor) * scalingFactor,
                width: 24 * scalingFactor,
                height: 24 * scalingFactor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${20 * scalingFactor}px`,
                cursor: 'pointer',
                zIndex: 400, // Higher than cars
                transition: 'none',
                boxShadow: `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(0,0,0,0.2)`,
                filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.6))',
                transform: `scale(${1.2 * scalingFactor})`,
                animation: 'personWalk 0.8s ease-in-out infinite alternate'
              }}
              title={`Person ${person.id} - ${isWalkingToStore ? 'Walking to Store' : 'Walking to Car'}`}
            >
              {isWalkingToStore ? '🚶' : '🚶‍♂️'}
            </div>
          );
        })}

        {/* Render cars as unicode characters */}
        {cars.map((car) => {
          const pos = car.getPosition();
          const carInfo = car.getCarInfo();
          const isMoving = car.isCurrentlyMoving();
          
          return (
            <div
              key={car.id}
              style={{
                position: 'absolute',
                left: pos.x * scalingFactor,
                top: pos.y * scalingFactor,
                width: car.width * scalingFactor,
                height: car.height * scalingFactor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${28 * scalingFactor}px`,
                color: car.color,
                cursor: 'pointer',
                zIndex: isMoving ? 300 : 200,
                transition: isMoving ? 'none' : 'box-shadow 0.2s',
                boxShadow: isMoving 
                  ? `0 ${4 * scalingFactor}px ${12 * scalingFactor}px rgba(255,255,0,0.6), 0 0 ${20 * scalingFactor}px rgba(255,255,0,0.3)` 
                  : `0 ${2 * scalingFactor}px ${8 * scalingFactor}px rgba(0,0,0,0.15)`,
                filter: isMoving ? 'drop-shadow(0 0 8px rgba(255,255,0,0.8))' : 'none',
                transform: isMoving ? `scale(${1.1 * scalingFactor})` : `scale(${1 * scalingFactor})`,
                animation: isMoving ? 'carPulse 0.5s ease-in-out infinite alternate' : 'none'
              }}
              onMouseEnter={() => onCarHover && onCarHover(carInfo)}
              onMouseLeave={() => onCarLeave && onCarLeave()}
              title={`Car #${car.id} - ${car.getStatus()}`}
            >
              {car.getUnicodeChar()}
            </div>
          );
        })}
      </div>
      
      {/* Space statistics tooltip */}
      {hoveredSpace && (
        <div style={{
          position: 'fixed',
          left: '60%',
          top: '20%',
          backgroundColor: '#222',
          color: 'white',
          padding: `${14 * scalingFactor}px`,
          borderRadius: `${8 * scalingFactor}px`,
          fontSize: `${14 * scalingFactor}px`,
          zIndex: 10001,
          boxShadow: `0 ${4 * scalingFactor}px ${12 * scalingFactor}px rgba(0,0,0,0.3)`
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: `${8 * scalingFactor}px` }}>
            Space Stats
          </div>
          <div>Space ID: {hoveredSpace.index}</div>
          <div>Distance from Entrance: {Math.round(hoveredSpace.space.walkDistance * scalingFactor)} px</div>
          {(() => {
            const stats = hoveredSpace.space.getFormattedStats(time);
            return (
              <>
                <div>Total Occupied: {stats.totalOccupiedTime}</div>
                <div>Avg Occupancy: {stats.averageOccupancyTime}</div>
                <div>Occupancy Count: {stats.occupancyCount}</div>
                <div>Occupancy %: {stats.occupancyPercentage}%</div>
                <div>Currently Occupied: {stats.isCurrentlyOccupied ? 'Yes' : 'No'}</div>
              </>
            );
          })()}
        </div>
      )}
      
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes carPulse {
            0% { transform: scale(${1.1 * scalingFactor}); }
            100% { transform: scale(${1.2 * scalingFactor}); }
          }
          
          @keyframes personWalk {
            0% { transform: scale(${1.2 * scalingFactor}) translateY(0px); }
            100% { transform: scale(${1.2 * scalingFactor}) translateY(-${2 * scalingFactor}px); }
          }
        `
      }} />
    </div>
  );
};

export default ParkingLot; 