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
    this.handicapped = false; // Default to false for all spaces
    
    // Statistics tracking
    this.occupancyHistory = []; // Array of {startTime, endTime, carId} objects
    this.currentOccupancyStart = null;
    this.totalOccupiedTime = 0; // Total time occupied in seconds
    this.occupancyCount = 0; // Number of times this space has been occupied
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

  occupy(car = null, currentTime = 0) {
    this.isOccupied = true;
    this.occupiedBy = car;
    this.currentOccupancyStart = currentTime;
    this.occupancyCount++;
  }

  vacate(currentTime = 0) {
    if (this.isOccupied && this.currentOccupancyStart !== null) {
      const occupancyDuration = currentTime - this.currentOccupancyStart;
      this.totalOccupiedTime += occupancyDuration;
      
      // Record this occupancy period
      this.occupancyHistory.push({
        startTime: this.currentOccupancyStart,
        endTime: currentTime,
        duration: occupancyDuration,
        carId: this.occupiedBy ? this.occupiedBy.id : null
      });
    }
    
    this.isOccupied = false;
    this.occupiedBy = null;
    this.currentOccupancyStart = null;
  }

  isAvailable() {
    return !this.isOccupied;
  }

  // Get current occupancy statistics
  getOccupancyStats(currentTime = 0) {
    let currentOccupiedTime = this.totalOccupiedTime;
    
    // If currently occupied, add the current occupancy time
    if (this.isOccupied && this.currentOccupancyStart !== null) {
      currentOccupiedTime += (currentTime - this.currentOccupancyStart);
    }
    
    const averageOccupancyTime = this.occupancyCount > 0 ? currentOccupiedTime / this.occupancyCount : 0;
    
    return {
      totalOccupiedTime: currentOccupiedTime,
      occupancyCount: this.occupancyCount,
      averageOccupancyTime: averageOccupancyTime,
      isCurrentlyOccupied: this.isOccupied,
      currentOccupant: this.occupiedBy,
      occupancyHistory: [...this.occupancyHistory] // Return a copy
    };
  }

  // Get occupancy percentage for a given time period
  getOccupancyPercentage(currentTime = 0, totalTime = 3600) {
    const stats = this.getOccupancyStats(currentTime);
    return totalTime > 0 ? (stats.totalOccupiedTime / totalTime) * 100 : 0;
  }

  // Format time for display
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  }

  // Get formatted statistics for display
  getFormattedStats(currentTime = 0) {
    const stats = this.getOccupancyStats(currentTime);
    return {
      totalOccupiedTime: this.formatTime(stats.totalOccupiedTime),
      averageOccupancyTime: this.formatTime(stats.averageOccupancyTime),
      occupancyCount: stats.occupancyCount,
      occupancyPercentage: stats.totalOccupiedTime > 0 ? 
        ((stats.totalOccupiedTime / currentTime) * 100).toFixed(1) : '0.0',
      isCurrentlyOccupied: stats.isCurrentlyOccupied,
      currentOccupant: stats.currentOccupant
    };
  }
} 