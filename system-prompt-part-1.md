I would like your help in creating a static website to simulate cars moving about a parking lot. This project is "Parking Lot Simulator"

There should be a few core classes:

- ParkingLot
  -initially, this should probably just be a 1000 x 1000 square that can be rendered on the page top down. there should be one entrance and one exit both 40 pixels wide
  -there should be a SINGLE buildingentrance maybe 40 pixels wide
- ParkingLotSpace
  -maybe 20 pixels wide and 40 pixels long with a 1 pixel border to indicate the line stripes
  -the spaces should all know their own position in 2D space and be renderable on top of the parkinglot
  
I'll have more to say about Car objects and how the cars should move about the parking lot but for now just start by rendering a parking lot and spaces on the screen
