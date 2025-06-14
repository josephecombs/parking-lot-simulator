/**
 * Car - Model representing a car in the parking lot
 */
export class Car {
  constructor() {
    this.id = Math.random().toString(36).substr(2, 9);
    this.color = this.generateRandomColor();
    this.width = 28; // Slightly smaller than space width (32px)
    this.height = 44; // Slightly smaller than space height (48px)
    this.x = 0;
    this.y = 0;
    this.occupiedSpace = null;
    this.person = null; // Associated person
  }

  generateRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#A9DFBF', '#F9E79F', '#D5A6BD', '#AED6F1', '#FAD7A0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  park(space) {
    if (space && space.isAvailable()) {
      this.occupiedSpace = space;
      space.occupy(this);
      
      // Position car in the center of the space
      this.x = space.x + (space.width - this.width) / 2;
      this.y = space.y + (space.height - this.height) / 2;
      
      return true;
    }
    return false;
  }

  leave() {
    if (this.occupiedSpace) {
      this.occupiedSpace.vacate();
      this.occupiedSpace = null;
    }
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getDimensions() {
    return { width: this.width, height: this.height };
  }

  setPerson(person) {
    this.person = person;
  }

  getPerson() {
    return this.person;
  }
} 