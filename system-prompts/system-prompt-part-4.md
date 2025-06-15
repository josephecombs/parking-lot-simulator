now we have the panels and all the classes. we need to start implementing the logic of rendering cars as they drive the lot. at a high level, the process is like this:

1.) a car arrives at the entrance
2.) the car identifies the open space with the minimum distance to the building entrance.
3.) based on the speed of the car set at instantiation, use the pythagorean theorem to figure out where on the lot to render the car as it is driving to the spot it's chosen between based on when it arrives.

the first car of the simulation should ALWAYS arrive at time t=0 so we dont have to wait to see movement

4.) while the person in the car is shopping, render that car in the appropriate space in the lot.

this is enough for now. please do a good job implementing this! I believe in you!!!!