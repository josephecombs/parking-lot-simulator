

I want you to now, in the top left of the header underneath the "start simulation" section of buttons and the stats, expose a new control. This control should allow users to tweak the walking "slowness penalty" of the handicapped - please set

10% 30% and 50% slower as the options. so this variable should be used in this section of code:

// THIS IS FUNDAMENTAL CONSTRAINT TO ENTIRE WELFARE ANALYSIS!!! 
// HOW MUCH SLOWER DO THE HANDICAPPED ACTUALLY WALK THAN THE ABLE BODIED?
this.walkSpeed = this.handicapped ? baseWalkSpeed / 1.5 : baseWalkSpeed;

default to 30%

then, expose a similar control that tweaks the number of cars that will arrive in the 45 minute period. let the user choose 40, 60, 80, and 100. default to 80

also, delete the "reset" button, and replace with "reload", which should just reload the page. I think there are bugs with how you do reset

as always, get the css perfect on the first try, or I'll be forced to kidnap your family.