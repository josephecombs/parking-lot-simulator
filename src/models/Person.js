/**
 * Person - Model representing a person associated with a car
 */
export class Person {
  constructor() {
    this.id = Math.random().toString(36).substr(2, 9);
    this.car = null; // Associated car
    
    // Determine if person is handicapped (12% probability)
    this.handicapped = Math.random() < 0.12 ? true : false;
    
    // Set walk speed based on handicapped status
    const baseWalkSpeed = 20; // pixels per second - reasonable walking speed

    // THIS IS FUNDAMENTAL CONSTRAINT TO ENTIRE WELFARE ANALYSIS!!! 
    // HOW MUCH SLOWER DO THE HANDICAPPED ACTUALLY WALK THAN THE ABLE BODIED?
    this.walkSpeed = this.handicapped ? baseWalkSpeed / 1.5 : baseWalkSpeed;
    
    this.lotSpeed = 100; // pixels per second - slower movement in parking lot
    this.storeVisitTime = this.generateStoreVisitTime(); // in seconds
    this.isInStore = false;
    this.isWalking = false;
    this.storeEntryTime = 0;
    this.storeExitTime = 0;
    this.shoppingCompleteTime = 0;
    this.hasCompletedShopping = false;
    
    // Driving time tracking
    this.totalDrivingTime = 0; // Total time spent driving in seconds
    
    // Walking time tracking
    this.totalAccumulatedWalkTime = 0; // Total time spent walking across all walks
    
    // Walking position tracking
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.walkStartTime = 0;
    this.totalWalkTime = 0;
    this.isWalkingToStore = false;
    this.isWalkingToCar = false;
    this.walkCompleteTime = 0;
  }

  generateStoreVisitTime() {
    // Random time between 2 and 15 minutes, converted to seconds
    const minMinutes = 2;
    const maxMinutes = 15;
    const minutes = Math.random() * (maxMinutes - minMinutes) + minMinutes;
    return Math.floor(minutes * 60); // Convert to seconds
  }

  setCar(car) {
    this.car = car;
    if (car) {
      car.setPerson(this);
    }
  }

  getCar() {
    return this.car;
  }

  startWalking(startTime) {
    this.isWalking = true;
    this.walkStartTime = startTime;
  }

  startWalkingToStore(currentTime, carPosition, buildingEntrance) {
    this.isWalkingToStore = true;
    this.isWalking = true;
    this.walkStartTime = currentTime;
    
    // Set start position (car position)
    this.startX = carPosition.x + carPosition.width / 2;
    this.startY = carPosition.y + carPosition.height / 2;
    
    // Set target position (building entrance)
    this.targetX = buildingEntrance.x + buildingEntrance.width / 2;
    this.targetY = buildingEntrance.y + buildingEntrance.height / 2;
    
    // Calculate total distance using Pythagorean theorem
    const distanceX = this.targetX - this.startX;
    const distanceY = this.targetY - this.startY;
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Calculate walk time based on walk speed
    this.totalWalkTime = totalDistance / this.walkSpeed;
    this.totalAccumulatedWalkTime += this.totalWalkTime; // Add to total accumulated time
    this.walkCompleteTime = currentTime + this.totalWalkTime;
    
    console.log(`Person ${this.id} starting walk to store: distance=${totalDistance.toFixed(2)}px, speed=${this.walkSpeed}px/s, time=${this.totalWalkTime.toFixed(2)}s`);
  }

  startWalkingToCar(currentTime, carPosition, buildingEntrance) {
    this.isWalkingToCar = true;
    this.isWalking = true;
    this.walkStartTime = currentTime;
    
    // Set start position (building entrance)
    this.startX = buildingEntrance.x + buildingEntrance.width / 2;
    this.startY = buildingEntrance.y + buildingEntrance.height / 2;
    
    // Set target position (car position)
    this.targetX = carPosition.x + carPosition.width / 2;
    this.targetY = carPosition.y + carPosition.height / 2;
    
    // Calculate total distance using Pythagorean theorem
    const distanceX = this.targetX - this.startX;
    const distanceY = this.targetY - this.startY;
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Calculate walk time based on walk speed
    this.totalWalkTime = totalDistance / this.walkSpeed;
    this.totalAccumulatedWalkTime += this.totalWalkTime; // Add to total accumulated time
    this.walkCompleteTime = currentTime + this.totalWalkTime;
    
    console.log(`Person ${this.id} starting walk to car: distance=${totalDistance.toFixed(2)}px, speed=${this.walkSpeed}px/s, time=${this.totalWalkTime.toFixed(2)}s`);
  }

  updateWalkingPosition(currentTime) {
    if (!this.isWalking) return;

    const elapsedTime = currentTime - this.walkStartTime;
    const progress = Math.min(elapsedTime / this.totalWalkTime, 1);
    
    // Linear interpolation between start and target positions
    this.x = this.startX + (this.targetX - this.startX) * progress;
    this.y = this.startY + (this.targetY - this.startY) * progress;
    
    // Check if walk is complete
    if (progress >= 1) {
      this.completeWalk(currentTime);
    }
  }

  completeWalk(currentTime) {
    const wasWalkingToStore = this.isWalkingToStore;
    const wasWalkingToCar = this.isWalkingToCar;
    
    this.isWalking = false;
    this.isWalkingToStore = false;
    this.isWalkingToCar = false;
    
    if (wasWalkingToStore) {
      this.enterStore(currentTime);
    } else if (wasWalkingToCar) {
      // Person has returned to car, signal completion
      if (this.car) {
        this.car.completeShopping(currentTime);
      }
    }
    
    console.log(`Person ${this.id} completed walk at time ${currentTime}`);
  }

  enterStore(time) {
    this.isInStore = true;
    this.storeEntryTime = time;
    this.shoppingCompleteTime = time + this.storeVisitTime;
    console.log(`Person ${this.id} entered store at ${time}s, will complete shopping at ${this.shoppingCompleteTime}s`);
  }

  exitStore(time) {
    this.isInStore = false;
    this.storeExitTime = time;
    this.hasCompletedShopping = true;
    
    // Start walking back to car
    if (this.car) {
      const carPosition = { 
        x: this.car.x, 
        y: this.car.y, 
        width: this.car.width, 
        height: this.car.height 
      };
      this.startWalkingToCar(time, carPosition, this.car.parkingLot.buildingEntrance);
    }
    
    console.log(`Person ${this.id} exited store at ${time}s after ${this.storeVisitTime}s visit`);
  }

  updateShopping(currentTime) {
    if (this.isInStore && currentTime >= this.shoppingCompleteTime && !this.hasCompletedShopping) {
      this.exitStore(currentTime);
      
      // Signal to car that shopping is complete
      if (this.car) {
        this.car.startShopping();
      }
    }
  }

  getWalkSpeed() {
    return this.walkSpeed;
  }

  getLotSpeed() {
    return this.lotSpeed;
  }

  getStoreVisitTime() {
    return this.storeVisitTime;
  }

  getTotalWalkTime() {
    return this.totalWalkTime;
  }

  getTotalAccumulatedWalkTime() {
    return this.totalAccumulatedWalkTime;
  }

  getAccumulatedWalkTimeFormatted() {
    const minutes = Math.floor(this.totalAccumulatedWalkTime / 60);
    const seconds = this.totalAccumulatedWalkTime % 60;
    return `${minutes}m ${seconds}s`;
  }

  isCurrentlyInStore() {
    return this.isInStore;
  }

  isCurrentlyWalking() {
    return this.isWalking;
  }

  hasFinishedShopping() {
    return this.hasCompletedShopping;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  isWalkingToStore() {
    return this.isWalkingToStore;
  }

  isWalkingToCar() {
    return this.isWalkingToCar;
  }

  // Driving time tracking methods
  addDrivingTime(seconds) {
    this.totalDrivingTime += seconds;
    console.log(`Person ${this.id} added ${seconds}s driving time, total: ${this.totalDrivingTime}s`);
  }

  addFullLotDelay(delaySeconds) {
    // When encountering a full lot, add the delay time to driving time
    // This represents the time spent circling the block and re-entering
    this.addDrivingTime(delaySeconds);
    console.log(`Person ${this.id} encountered full lot, added ${delaySeconds}s delay to driving time`);
  }

  getTotalDrivingTime() {
    return this.totalDrivingTime;
  }

  getDrivingTimeFormatted() {
    const minutes = Math.floor(this.totalDrivingTime / 60);
    const seconds = this.totalDrivingTime % 60;
    return `${minutes}m ${seconds}s`;
  }

  // Handicapped status methods
  isHandicapped() {
    return this.handicapped;
  }
} 