Now that we have the parking lot rendering and it looks reasonable from the top down. I need you to create a "Car" model. Cars should be randomly colored and be rectangles slightly smaller than the size of a space.

Spaces can have exactly ONE car at any given TIME.

Then, create a PERSON model, associated with each car. for now assume one person for one car. track walk-time for each person as time spent walking from car to building entrance and back
Each person has a "store visit" time randomly chosen between 2 and 15 minutes.

Additionally, we need a better concept of time. What we need to simulate is an entire hour - 60 minutes of 60 seconds each. so really the timer needs to be 3600 seconds.
