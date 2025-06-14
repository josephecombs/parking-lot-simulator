/**
 * Car - Model representing a car in the parking lot
 */
export class Car {
  constructor(arrivalTime = null) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.color = this.generateRandomColor();
    this.width = 28; // Slightly smaller than space width (32px)
    this.height = 44; // Slightly smaller than space height (48px)
    this.x = 0;
    this.y = 0;
    this.occupiedSpace = null;
    this.person = null; // Associated person
    this.arrivalTime = arrivalTime; // Time in seconds when car should arrive
    this.status = 'scheduled'; // 'scheduled', 'arrived', 'driving', 'parked', 'shopping', 'exited'
    this.actualArrivalTime = null;
    this.parkingTime = null;
    this.exitTime = null;
    this.unicodeChar = this.generateUnicodeChar();
    
    // Movement properties
    this.targetSpace = null;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.movementStartTime = 0;
    this.totalMovementTime = 0;
    this.isMoving = false;
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

  generateUnicodeChar() {
    // Car-related unicode characters
    const carChars = ['🚗', '🚙', '🚕', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜'];
    return carChars[Math.floor(Math.random() * carChars.length)];
  }

  arrive(currentTime, parkingLot) {
    this.status = 'arrived';
    this.actualArrivalTime = currentTime;
    
    // Position car at entrance
    this.x = parkingLot.entrance.x + parkingLot.entrance.width;
    this.y = parkingLot.entrance.y + parkingLot.entrance.height / 2 - this.height / 2;
    
    // Find closest available space to building entrance
    this.findClosestSpace(parkingLot);
    
    if (this.targetSpace) {
      this.startDriving(currentTime);
    }
  }

  findClosestSpace(parkingLot) {
    const availableSpaces = parkingLot.getSpaces().filter(space => space.isAvailable());
    
    if (availableSpaces.length === 0) {
      console.warn(`No available spaces for car ${this.id}`);
      return;
    }

    // Find space with minimum distance to building entrance
    const buildingEntrance = parkingLot.buildingEntrance;
    const buildingX = buildingEntrance.x + buildingEntrance.width / 2;
    const buildingY = buildingEntrance.y + buildingEntrance.height / 2;

    let closestSpace = null;
    let minDistance = Infinity;

    availableSpaces.forEach(space => {
      const spaceX = space.x + space.width / 2;
      const spaceY = space.y + space.height / 2;
      
      // Calculate distance using Pythagorean theorem
      const distance = Math.sqrt(
        Math.pow(spaceX - buildingX, 2) + Math.pow(spaceY - buildingY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSpace = space;
      }
    });

    this.targetSpace = closestSpace;
    console.log(`Car ${this.id} selected space at distance ${minDistance.toFixed(2)}px from building entrance`);
  }

  startDriving(currentTime) {
    if (!this.targetSpace || !this.person) return;

    this.status = 'driving';
    this.isMoving = true;
    this.movementStartTime = currentTime;
    
    // Set start position (current position at entrance)
    this.startX = this.x;
    this.startY = this.y;
    
    // Set target position (center of the target space)
    this.targetX = this.targetSpace.x + (this.targetSpace.width - this.width) / 2;
    this.targetY = this.targetSpace.y + (this.targetSpace.height - this.height) / 2;
    
    // Calculate total distance to travel
    const distanceX = this.targetX - this.startX;
    const distanceY = this.targetY - this.startY;
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Calculate movement time based on car's lot speed
    const lotSpeed = this.person.getLotSpeed(); // pixels per second
    this.totalMovementTime = totalDistance / lotSpeed;
    
    console.log(`Car ${this.id} starting drive: distance=${totalDistance.toFixed(2)}px, speed=${lotSpeed}px/s, time=${this.totalMovementTime.toFixed(2)}s`);
  }

  updatePosition(currentTime) {
    if (!this.isMoving || !this.person) return;

    const elapsedTime = currentTime - this.movementStartTime;
    const progress = Math.min(elapsedTime / this.totalMovementTime, 1);
    
    // Linear interpolation between start and target positions
    this.x = this.startX + (this.targetX - this.startX) * progress;
    this.y = this.startY + (this.targetY - this.startY) * progress;
    
    // Check if movement is complete
    if (progress >= 1) {
      this.completeMovement(currentTime);
    }
  }

  completeMovement(currentTime) {
    this.isMoving = false;
    this.status = 'parked';
    this.parkingTime = currentTime;
    
    // Park in the target space
    if (this.targetSpace) {
      this.park(this.targetSpace);
    }
    
    // Start person's shopping process
    if (this.person) {
      this.person.startWalking(currentTime);
      this.person.enterStore(currentTime);
      this.status = 'shopping';
    }
    
    console.log(`Car ${this.id} completed movement and parked at time ${currentTime}`);
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
    this.status = 'exited';
    this.exitTime = Date.now();
  }

  startShopping() {
    this.status = 'shopping';
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

  getArrivalTime() {
    return this.arrivalTime;
  }

  getStatus() {
    return this.status;
  }

  getUnicodeChar() {
    return this.unicodeChar;
  }

  isCurrentlyMoving() {
    return this.isMoving;
  }

  getCarInfo() {
    const person = this.getPerson();
    return {
      id: this.id,
      color: this.color,
      unicodeChar: this.unicodeChar,
      status: this.status,
      arrivalTime: this.arrivalTime,
      actualArrivalTime: this.actualArrivalTime,
      parkingTime: this.parkingTime,
      exitTime: this.exitTime,
      isMoving: this.isMoving,
      person: person ? {
        id: person.id,
        walkSpeed: person.getWalkSpeed(),
        lotSpeed: person.getLotSpeed(),
        storeVisitTime: person.getStoreVisitTime(),
        totalWalkTime: person.getTotalWalkTime(),
        isInStore: person.isCurrentlyInStore(),
        isWalking: person.isCurrentlyWalking()
      } : null
    };
  }
} 