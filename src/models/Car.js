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
    
    // Driving time tracking
    this.drivingStartTime = null; // When driving to parking space starts
    this.drivingEndTime = null; // When driving to parking space ends
    this.exitDrivingStartTime = null; // When driving to exit starts
    this.exitDrivingEndTime = null; // When driving to exit ends
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
    this.parkingLot = parkingLot; // Store reference to parking lot
    
    // Position car at entrance
    this.x = parkingLot.entrance.x + parkingLot.entrance.width;
    this.y = parkingLot.entrance.y + parkingLot.entrance.height / 2 - this.height / 2;
    
    // Find and IMMEDIATELY claim the closest available space to building entrance
    this.findAndClaimClosestSpace(parkingLot);
    
    if (this.targetSpace) {
      this.startDriving(currentTime);
    } else {
      // All spaces are occupied - add a minute to arrival time and reschedule
      const originalArrivalTime = this.arrivalTime;
      const delaySeconds = 60; // 60 seconds (1 minute) delay
      this.arrivalTime += delaySeconds;
      
      // Add the delay to the person's driving time
      if (this.person) {
        this.person.addFullLotDelay(delaySeconds);
      }
      
      console.warn(`🚫 Car ${this.id} could not find an available space at ${originalArrivalTime}s!`);
      console.log(`⏰ Rescheduling car ${this.id} to arrive at ${this.arrivalTime}s (delayed by ${delaySeconds}s)`);
      
      // Reset car status to scheduled so it can be rescheduled
      this.status = 'scheduled';
      this.actualArrivalTime = null;
      this.targetSpace = null;
      this.x = 0;
      this.y = 0;
    }
  }

  findAndClaimClosestSpace(parkingLot) {
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

    // IMMEDIATELY claim the space to prevent other cars from targeting it
    if (closestSpace) {
      // Double-check the space is still available before claiming
      if (closestSpace.isAvailable()) {
        this.targetSpace = closestSpace;
        // Mark the space as occupied immediately
        closestSpace.occupy(this);
        console.log(`✅ Car ${this.id} successfully claimed space at distance ${minDistance.toFixed(2)}px from building entrance`);
      } else {
        console.warn(`⚠️ Space was claimed by another car while car ${this.id} was selecting. Trying again...`);
        // Recursively try to find another space
        this.findAndClaimClosestSpace(parkingLot);
      }
    }
  }

  startDriving(currentTime) {
    if (!this.targetSpace || !this.person) return;

    this.status = 'driving';
    this.isMoving = true;
    this.movementStartTime = currentTime;
    this.drivingStartTime = currentTime; // Track when driving starts
    
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
      if (this.status === 'driving') {
        this.completeMovement(currentTime);
      } else if (this.status === 'exiting') {
        this.completeExit(currentTime);
      }
    }
  }

  completeMovement(currentTime) {
    this.isMoving = false;
    this.status = 'parked';
    this.parkingTime = currentTime;
    this.drivingEndTime = currentTime; // Track when driving ends
    
    // Add driving time to person's total driving time
    if (this.person && this.drivingStartTime !== null) {
      const drivingTime = currentTime - this.drivingStartTime;
      this.person.addDrivingTime(drivingTime);
    }
    
    // Space is already occupied from when we claimed it upon arrival
    // Just update the car's position to the final position in the space
    if (this.targetSpace) {
      this.x = this.targetSpace.x + (this.targetSpace.width - this.width) / 2;
      this.y = this.targetSpace.y + (this.targetSpace.height - this.height) / 2;
      this.occupiedSpace = this.targetSpace; // Set the occupied space reference
    }
    
    // Start person's walking to store process
    if (this.person) {
      const carPosition = { x: this.x, y: this.y, width: this.width, height: this.height };
      this.person.startWalkingToStore(currentTime, carPosition, this.parkingLot.buildingEntrance);
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

  completeShopping(currentTime) {
    // Person has returned to car, now drive to exit
    this.status = 'exiting';
    this.startDrivingToExit(currentTime);
  }

  startDrivingToExit(currentTime) {
    this.isMoving = true;
    this.movementStartTime = currentTime;
    this.exitDrivingStartTime = currentTime; // Track when exit driving starts
    
    // Set start position (current position in space)
    this.startX = this.x;
    this.startY = this.y;
    
    // Set target position (exit)
    this.targetX = this.parkingLot.exit.x - this.width;
    this.targetY = this.parkingLot.exit.y + this.parkingLot.exit.height / 2 - this.height / 2;
    
    // Calculate total distance to travel
    const distanceX = this.targetX - this.startX;
    const distanceY = this.targetY - this.startY;
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Calculate movement time based on car's lot speed
    const lotSpeed = this.person.getLotSpeed(); // pixels per second
    this.totalMovementTime = totalDistance / lotSpeed;
    
    console.log(`Car ${this.id} starting drive to exit: distance=${totalDistance.toFixed(2)}px, speed=${lotSpeed}px/s, time=${this.totalMovementTime.toFixed(2)}s`);
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
        totalAccumulatedWalkTime: person.getTotalAccumulatedWalkTime(),
        accumulatedWalkTimeFormatted: person.getAccumulatedWalkTimeFormatted(),
        totalDrivingTime: person.getTotalDrivingTime(),
        drivingTimeFormatted: person.getDrivingTimeFormatted(),
        isInStore: person.isCurrentlyInStore(),
        isWalking: person.isCurrentlyWalking()
      } : null
    };
  }

  completeExit(currentTime) {
    this.isMoving = false;
    this.status = 'exited';
    this.exitTime = currentTime;
    this.exitDrivingEndTime = currentTime; // Track when exit driving ends
    
    // Add exit driving time to person's total driving time
    if (this.person && this.exitDrivingStartTime !== null) {
      const exitDrivingTime = currentTime - this.exitDrivingStartTime;
      this.person.addDrivingTime(exitDrivingTime);
    }
    
    // Vacate the parking space
    if (this.occupiedSpace) {
      this.occupiedSpace.vacate();
      this.occupiedSpace = null;
    }
    
    console.log(`Car ${this.id} completed exit at time ${currentTime}`);
  }
} 