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
    const y = 10; // Small margin from the top

    for (let i = 0; i < numSpaces; i++) {
      const x = startX + i * spaceWidth;
      this.spaces.push(new ParkingLotSpace(x, y, spaceWidth, spaceHeight, borderWidth));
    }
  }

  getSpaces() {
    return this.spaces;
  }
} 