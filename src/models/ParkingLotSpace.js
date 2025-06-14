/**
 * ParkingLotSpace - Core model representing individual parking spaces
 */
export class ParkingLotSpace {
  constructor(x, y, width, height, borderWidth = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderWidth = borderWidth;
    this.isOccupied = false;
    this.occupiedBy = null; // Will hold car reference when implemented
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getDimensions() {
    return { 
      width: this.width, 
      height: this.height, 
      borderWidth: this.borderWidth 
    };
  }

  occupy(car = null) {
    this.isOccupied = true;
    this.occupiedBy = car;
  }

  vacate() {
    this.isOccupied = false;
    this.occupiedBy = null;
  }

  isAvailable() {
    return !this.isOccupied;
  }
} 