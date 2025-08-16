Read everyhting in the system-prompts folder to get up to speed.

so, you've done an amazing job so far. a major issue is that this site looks awful on mobile. right now, The high level changes to the mobile view I'd like you to make are:

PART A) -hide remove all existing controls/toggles on a mobile screen. give the existing stuff a .desktop class that we give display: none with a global media query on a "small" screen (Let's call it under 480 pixels wide to start)

-PART A.1) in a floating header only visible on mobile (give a class "mobile" which is display: none on big screens), but below the real header, there should be 3 things:
    PART B) handicapped on off toggle (maybe a little square with a arrow PART C) handicapped unicode character (TURN ON), and the same with a no smoking sign and a handicapped character (TURN OFF))
    PART D) some little stats comparison like we have now
    PART E) a button with the word "CONTROLS" on it. have this open some modal that also only appears on mobile. put lorem ipsum in it for now. this is eventually where all the controls will go.