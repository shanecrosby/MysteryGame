# To do #
## Dev Mode ##
Re-introduce the orbit controls so I can move the camera to navigate the scene while testing.
Add a dev control panel to allow me to see the camera's coordinates and adjust the FOV, panning, and 3-axis translation/dollying.

## Both Scenes ##
- Replace the snow particle squares with snowflake shapes. Use .\src\images\snowflake.png if you can, copying to .\public as needed.

## Menu Scene ##
- Create five little floating point lights that weave around the forest trees, like forest spirit sprites. They should illuminate the trees and ground, and cast shadows.
- Reposition the trees to cluster to the left and right of the screen with a winding path down the centre off into the distance. Align them to individually conform to the landscape height if possible.

## Level 1 ##
I've temporarily disabled the trees so I can see the other scene elements more clearly while fixing the scene layout. The sky box texture is now positioned weirdly, with the top of the cylinder visible again, and about 50% of the width being cropped or blocked by something.
- Add controls for each of the following elements, to allow the scale, x y and z position, and rotation to be controlled so I can determine the correct values to set as default in the code.
- - Campfire (stones and flame effect grouped)
- - Footprints clue including hover light, grouped
- - Headphone Jack clue including hover light, grouped
- - Fabric clue including hover light, grouped
- - Creeper
- - Outpost/House
- - House window lights. These will need to be moved to fit with the new model, but I'll need to experiment live with their positioning instead of constantly changing the code.
- Get rid of the icicles. I don't think they'll work with the new outpost/house model.