import { Car } from './Car';
import { Person } from './Person';

/**
 * SimulationManager - Manages the overall simulation state
 */
export class SimulationManager {
  constructor(parkingLot) {
    this.parkingLot = parkingLot;
    this.cars = [];
    this.people = [];
    this.currentTime = 0;
    this.isRunning = false;
    this.totalSimulationTime = 3600; // 1 hour in seconds
  }

  createCarWithPerson() {
    const car = new Car();
    const person = new Person();
    
    // Associate car and person
    person.setCar(car);
    
    this.cars.push(car);
    this.people.push(person);
    
    return { car, person };
  }

  getAvailableSpaces() {
    return this.parkingLot.getSpaces().filter(space => space.isAvailable());
  }

  getOccupiedSpaces() {
    return this.parkingLot.getSpaces().filter(space => !space.isAvailable());
  }

  getCars() {
    return this.cars;
  }

  getPeople() {
    return this.people;
  }

  getCurrentTime() {
    return this.currentTime;
  }

  setCurrentTime(time) {
    this.currentTime = time;
  }

  isSimulationRunning() {
    return this.isRunning;
  }

  startSimulation() {
    this.isRunning = true;
    this.currentTime = 0;
  }

  pauseSimulation() {
    this.isRunning = false;
  }

  resetSimulation() {
    this.isRunning = false;
    this.currentTime = 0;
    
    // Remove all cars from spaces
    this.cars.forEach(car => car.leave());
    
    // Clear arrays
    this.cars = [];
    this.people = [];
  }

  getTotalSimulationTime() {
    return this.totalSimulationTime;
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Utility method to get simulation statistics
  getSimulationStats() {
    return {
      totalCars: this.cars.length,
      totalPeople: this.people.length,
      occupiedSpaces: this.getOccupiedSpaces().length,
      availableSpaces: this.getAvailableSpaces().length,
      currentTime: this.currentTime,
      formattedTime: this.formatTime(this.currentTime),
      isRunning: this.isRunning
    };
  }
} 