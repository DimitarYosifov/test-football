export default {
    rendererResolution: window.devicePixelRatio,
    hasLogin: false,              //skip login phase ...for tests
    mainFont: 'Girassol',
    addTeam: false,                //for tests and adding teams to DB
    fadeTimeBetweenPhases: 0.5,   //visibility  delay between game phases
    gridHasMask: true,            // UNUSED!!!
    isGridInDebug: false,         // predetermened grid for debug
    debugGrid: [
        ["ball_purple", "ball_red", "ball_purple", "ball_green", "ball_blue", "ball_red"],
        ["ball_red", "ball_purple", "ball_purple", "ball_blue", "ball_green", "ball_blue"],
        ["ball_green", "ball_purple", "ball_purple", "ball_yellow", "ball_green", "ball_green"],
        ["ball_orange", "ball_blue", "ball_purple", "ball_purple", "ball_red", "ball_green"],
        ["ball_red", "ball_red", "ball_green", "ball_red", "ball_green", "ball_red"],
        ["ball_green", "ball_red", "ball_green", "ball_green", "ball_red", "ball_orange"],
        ["ball_red", "ball_orange", "ball_red", "ball_red", "ball_purple", "ball_red"],
        ["ball_blue", "ball_red", "ball_red", "ball_yellow", "ball_blue", "ball_red"]
    ]
}