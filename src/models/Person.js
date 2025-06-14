/**
 * Person - Model representing a person associated with a car
 */
export class Person {
  constructor() {
    this.id = Math.random().toString(36).substr(2, 9);
    this.car = null; // Associated car
    this.walkSpeed = 2; // pixels per second - reasonable walking speed
    this.lotSpeed = 1; // pixels per second - slower movement in parking lot
    this.storeVisitTime = this.generateStoreVisitTime(); // in seconds
    this.totalWalkTime = 0; // time spent walking in seconds
    this.isInStore = false;
    this.isWalking = false;
    this.walkStartTime = 0;
    this.storeEntryTime = 0;
    this.storeExitTime = 0;
    this.shoppingCompleteTime = 0;
    this.hasCompletedShopping = false;
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

  stopWalking(endTime) {
    if (this.isWalking) {
      this.isWalking = false;
      const walkDuration = endTime - this.walkStartTime;
      this.totalWalkTime += walkDuration;
    }
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
    console.log(`Person ${this.id} exited store at ${time}s after ${this.storeVisitTime}s visit`);
  }

  updateShopping(currentTime) {
    if (this.isInStore && currentTime >= this.shoppingCompleteTime && !this.hasCompletedShopping) {
      this.exitStore(currentTime);
      this.stopWalking(currentTime);
      
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

  isCurrentlyInStore() {
    return this.isInStore;
  }

  isCurrentlyWalking() {
    return this.isWalking;
  }

  hasFinishedShopping() {
    return this.hasCompletedShopping;
  }
} 