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
    this.scheduledCars = []; // Cars that haven't arrived yet
    this.completedCars = []; // Cars that have exited
    this.currentTime = 0;
    this.isRunning = false;
    this.totalSimulationTime = 3600; // 1 hour in seconds
    this.generateSchedule();
  }

  generateSchedule() {
    // Generate 80 cars with arrival times between 0 and 45 minutes (2700 seconds)
    const numCars = 80;
    const maxArrivalTime = 45 * 60; // 45 minutes in seconds
    
    console.log(`🚗 Generating schedule for ${numCars} cars...`);
    console.log(`⏰ Cars will arrive between 00:00 and ${this.formatArrivalTime(maxArrivalTime)}`);
    
    for (let i = 0; i < numCars; i++) {
      // Ensure the first car arrives at t=0
      const arrivalTime = i === 0 ? 0 : Math.floor(Math.random() * maxArrivalTime);
      const car = new Car(arrivalTime);
      const person = new Person();
      
      // Associate car and person
      person.setCar(car);
      
      this.scheduledCars.push({ car, person });
    }
    
    // Sort scheduled cars by arrival time
    this.scheduledCars.sort((a, b) => a.car.getArrivalTime() - b.car.getArrivalTime());
    
    // Log the complete schedule
    console.log('📅 Complete Car Schedule:');
    console.log('Time | Car ID | Unicode | Person Store Visit');
    console.log('-----|--------|---------|------------------');
    
    this.scheduledCars.forEach(({ car, person }, index) => {
      const arrivalTime = this.formatArrivalTime(car.getArrivalTime());
      const storeVisitMinutes = Math.floor(person.getStoreVisitTime() / 60);
      const storeVisitSeconds = person.getStoreVisitTime() % 60;
      console.log(
        `${arrivalTime} | ${car.id.substring(0, 6)}... | ${car.getUnicodeChar()} | ${storeVisitMinutes}m ${storeVisitSeconds}s`
      );
    });
    
    console.log(`✅ Schedule generated successfully! ${this.scheduledCars.length} cars scheduled.`);
    console.log('First 5 cars to arrive:', this.scheduledCars.slice(0, 5).map(({ car }) => ({
      time: this.formatArrivalTime(car.getArrivalTime()),
      unicode: car.getUnicodeChar(),
      id: car.id.substring(0, 6)
    })));
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

  updateSimulation() {
    if (!this.isRunning) return;

    // Check for cars that should arrive
    const carsToArrive = this.scheduledCars.filter(({ car }) => 
      car.getArrivalTime() <= this.currentTime && car.getStatus() === 'scheduled'
    );

    carsToArrive.forEach(({ car, person }) => {
      console.log(`🚗 Car ${car.id} arriving at time ${this.currentTime}s`);
      car.arrive(this.currentTime, this.parkingLot);
      this.cars.push(car);
      this.people.push(person);
    });

    // Remove arrived cars from scheduled list
    this.scheduledCars = this.scheduledCars.filter(({ car }) => car.getStatus() === 'scheduled');

    // Update positions of moving cars
    this.cars.forEach(car => {
      if (car.isCurrentlyMoving()) {
        car.updatePosition(this.currentTime);
      }
    });

    // Update walking positions of people
    this.people.forEach(person => {
      if (person.isCurrentlyWalking()) {
        person.updateWalkingPosition(this.currentTime);
      }
    });

    // Update shopping status for people
    this.people.forEach(person => {
      person.updateShopping(this.currentTime);
    });

    // Check for completed cars (exited)
    const completedCars = this.cars.filter(car => car.getStatus() === 'exited');
    completedCars.forEach(car => {
      const person = car.getPerson();
      this.completedCars.push({ car, person });
    });

    // Remove completed cars from active cars
    this.cars = this.cars.filter(car => car.getStatus() !== 'exited');
    this.people = this.people.filter(person => person.getCar() && person.getCar().getStatus() !== 'exited');
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

  getScheduledCars() {
    return this.scheduledCars;
  }

  getCompletedCars() {
    return this.completedCars;
  }

  getCurrentTime() {
    return this.currentTime;
  }

  setCurrentTime(time) {
    this.currentTime = time;
    this.updateSimulation();
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
    this.completedCars = [];
    
    // Regenerate schedule
    this.generateSchedule();
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

  formatArrivalTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Utility method to get simulation statistics
  getSimulationStats() {
    return {
      totalCars: this.cars.length + this.scheduledCars.length + this.completedCars.length,
      activeCars: this.cars.length,
      scheduledCars: this.scheduledCars.length,
      completedCars: this.completedCars.length,
      totalPeople: this.people.length,
      occupiedSpaces: this.getOccupiedSpaces().length,
      availableSpaces: this.getAvailableSpaces().length,
      currentTime: this.currentTime,
      formattedTime: this.formatTime(this.currentTime),
      isRunning: this.isRunning
    };
  }
} 