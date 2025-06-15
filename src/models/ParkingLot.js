import { ParkingLotSpace } from './ParkingLotSpace';

/**
 * ParkingLot - Core model representing the parking lot structure
 */
export class ParkingLot {
  constructor(width = 1000, height = 500) {
    this.width = width;
    this.height = height;
    this.entrance = {
      x: 0,
      y: height / 2 - 20, // Center vertically, 40px wide
      width: 40,
      height: 40
    };
    this.exit = {
      x: width - 40,
      y: height / 2 - 20, // Center vertically, 40px wide
      width: 40,
      height: 40
    };
    this.buildingEntrance = {
      x: width / 2 - 20, // Center horizontally, 40px wide
      y: 0,
      width: 40,
      height: 40
    };
    this.spaces = [];
    this.generateParkingSpaces();
  }

  generateParkingSpaces() {
    // Fixed number of spaces, centered, top-aligned, no spacing between
    const numSpaces = 25;
    const spaceWidth = 32;
    const spaceHeight = 48;
    const borderWidth = 1;
    const totalRowWidth = numSpaces * spaceWidth;
    const startX = (this.width - totalRowWidth) / 2;
    const y = 60; // Buffer from building entrance to top row of spaces

    // Midpoint of the building entrance (top edge)
    const buildingMidX = this.buildingEntrance.x + this.buildingEntrance.width / 2;
    const buildingMidY = this.buildingEntrance.y + this.buildingEntrance.height / 2;

    let closestSpace = null;
    let minDistance = Infinity;

    for (let i = 0; i < numSpaces; i++) {
      const x = startX + i * spaceWidth;
      // Midpoint of the top edge of the space
      const spaceMidX = x + spaceWidth / 2;
      const spaceMidY = y;
      // Euclidean distance
      const walkDistance = Math.sqrt(
        Math.pow(spaceMidX - buildingMidX, 2) + Math.pow(spaceMidY - buildingMidY, 2)
      );
      const space = new ParkingLotSpace(x, y, spaceWidth, spaceHeight, borderWidth);
      space.walkDistance = walkDistance;
      this.spaces.push(space);
      
      // Track the closest space
      if (walkDistance < minDistance) {
        minDistance = walkDistance;
        closestSpace = space;
      }
    }
    
    // Set the closest space as handicapped
    if (closestSpace) {
      closestSpace.handicapped = true;
      console.log(`Set space at distance ${minDistance.toFixed(2)}px as handicapped`);
    }
  }

  getSpaces() {
    return this.spaces;
  }

  // Calculate average occupancy percentage across all spaces
  getAverageOccupancyPercentage(currentTime = 0, totalTime = 3600) {
    if (this.spaces.length === 0) return 0;
    const sum = this.spaces.reduce((acc, space) => acc + space.getOccupancyPercentage(currentTime, totalTime), 0);
    return sum / this.spaces.length;
  }
} 