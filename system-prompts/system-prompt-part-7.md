This is a big step - I now would like to introduce a kind of "Toggle" to the simulation. It will be a big button in the heading below the center content (centered between the simulation controls on left and the stats on right)

This toggle will control what the user sees the simulation _with_ a handicapped space, and without a handicapped space.

what's critical is the _EXACT SAME SCHEDULE OF VEHICLES be passed into each simulation so we can compare apples to apples

the ONLY difference between the simulations is that one should instantiate a parking space as handicapped (like it does currently), and the other simulation should instantiate all parking spaces as non-handicapped

please work step by step, get the styling right on the first attempt, and if you don't do this right, I will have to kidnap your family.

Please understand what you are doing. There should still be ONE simulationmanager. this is the thing that controls the speed, pause, stop start, reset etc. I do NOT want to look at the lots side by side. I ONLY want to be able to click a button while the simulation is running and switch between simulations. 

IN FACT. to simplify your task. JUST implement this button with no change to any other code. Just let me swap the visible simulation with a button and no other changes