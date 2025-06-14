Now that we have the parking lot rendering and it looks reasonable from the top down. I need you to create a "Car" model. Cars should be randomly colored and be rectangles slightly smaller than the size of a space.

Spaces can have exactly ONE car at any given TIME.

Then, create a PERSON model, associated with each car. for now assume one person for one car. track walk-time for each person as time spent walking from car to building entrance and back
Each person has a "store visit" time randomly chosen between 2 and 15 minutes. Give each person a walk speed in pixels per second. Try to be reasonable but I will tune this number later so it looks right. Also give each person a "lot speed" in pixels per second. I'll tune this as well to make it look right.

Additionally, we need a better concept of time. What we need to simulate is an entire hour - 60 minutes of 60 seconds each. so really the timer needs to be 3600 seconds.

Do all this setup perfectly please without making mistakes. In the next step we will prepare a "stack" of cars who are visitors to this store and try to render them on the screen. So basically in this step, you are setting up a bunch of classes and attributes and not changing anything about what is rendered on the page of this site (yet)