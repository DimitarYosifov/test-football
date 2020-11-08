import Background from "./Background.js";
import Config from "./Config.js";
import LevelCardsSet from "./gameLevel/LevelCardsSet.js";
import Grid from "./gameLevel/Grid.js";

export default class Level extends PIXI.Container {

    constructor(app) {

        super();

        this.app = app;
        this.config = Config;
        this.stage = app.stage;
        this.stage.alpha = 0;
        this.proton = app.proton;
        this.width = app.width; // / this.config.rendererResolution;
        this.height = app.height;//  / this.config.rendererResolution;
        this.grid = null;
        this.playerCardsContainer = null;
        this.opponentCardsContainer = null;
        this.animationInProgress = false;
        this.playerTurn = true; //should be rondom or host's

        this.bg = new Background(this.app, {
            gamePhase: "level",
            bgTexture: 'images/pitch.png',
            bg_x: -this.app.width * 0.005,
            bg_y: -this.app.height * 0.005,
            bg_width: this.app.width * 1.005,
            bg_height: this.app.height * 1.005
        });
        this.addChild(this.bg);
        this.grid = new Grid(this.app);
        this.addChild(this.grid);
        this.dataRecieved = () => {
            this.grid.checkGridForMatches();
            TweenMax.delayedCall(1, () => {
                TweenMax.to(this.stage, this.config.fadeTimeBetweenPhases, { alpha: 1 });
            })
        }

        this.playerCards = new LevelCardsSet(this.dataRecieved, this.app.width, this.app.height, "player");
        this.addChild(this.playerCards);

        this.opponentCards = new LevelCardsSet(() => { }, this.app.width, this.app.height, "opponent");
        this.addChild(this.opponentCards);
    }
}
